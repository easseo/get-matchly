# Matchly — Codebase Audit Report

> Full-stack security, architecture, and code-quality review conducted prior to continued development.

---

## 🔴 CRITICAL

---

### 1. `UserProvider` is never mounted — `useUser()` returns dead defaults everywhere

**File:** `src/App.tsx:38`

`App.tsx` wraps the app in `<AuthProvider>` (the demo localStorage hook), but **`<UserProvider>` from `UserContext.tsx` is never mounted at all.** Every component that calls `useUser()` gets the static default context: `{ user: null, profile: null, role: null, loading: true }` — permanently.

```tsx
// App.tsx — current (broken)
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// Fix: add UserProvider
import { UserProvider } from "@/context/UserContext";

<UserProvider>
  <AuthProvider>
    <Routes>...</Routes>
  </AuthProvider>
</UserProvider>
```

**Impact:** `AdvertiserOnboarding`, `CreatorOnboarding`, `ProfileSettings`, and any future component calling `useUser()` receives null/stale data. The `refreshProfile()` call in `AdvertiserOnboarding.tsx:55` is a no-op because it calls the empty default function from the context's default value — the profile is never refreshed after onboarding.

---

### 2. `AppLayout` authenticates from localStorage, not from Supabase

**File:** `src/layouts/AppLayout.tsx:6-14`

The entire app's route-level authentication guard trusts a **client-mutable localStorage entry** rather than the Supabase JWT session. Anyone can open DevTools and do `localStorage.setItem("matchly_demo_user", JSON.stringify({ email:"x", fullName:"x", role:"advertiser" }))` to bypass authentication entirely.

```tsx
// AppLayout.tsx — current
const { user, loading } = useDemoAuth();  // reads localStorage
if (!user) return <Navigate to={`/auth?role=${role}`} replace />;
if (user.role !== role) return <Navigate to="..." replace />;

// Fix: replace with Supabase session
import { useUser } from "@/context/UserContext";

export default function AppLayout({ role }: { role: "advertiser" | "creator" }) {
  const { user, profile, loading } = useUser();

  if (loading) return null;
  if (!user) return <Navigate to={`/auth?role=${role}`} replace />;
  if (profile?.role !== role) {
    return <Navigate to={profile?.role === "advertiser" ? "/app/dashboard" : "/app/creator/dashboard"} replace />;
  }
  // ...
}
```

---

### 3. Notifications RLS allows any authenticated user to create notifications for any other user

**File:** `src/lib/schema.sql:302`

```sql
-- Current — allows any authed user to notify anyone
create policy "System can create notifications" on public.notifications
  for insert with check (true);
```

A logged-in creator can send fake `proposal_accepted` or `payment_deposited` notifications to any advertiser. This is not a theoretical attack — `CampaignDetailPage.tsx:145-155` already calls this insert client-side, meaning the pattern is established.

```sql
-- Fix: only allow users to notify themselves, or move system notifications
-- to a SECURITY DEFINER Postgres function / Edge Function
create policy "Participants can create notifications" on public.notifications
  for insert with check (auth.uid() = user_id);
```

System-triggered notifications (proposal accepted, etc.) should be moved to a `SECURITY DEFINER` Postgres function or a Supabase Edge Function, not client-side inserts.

---

### 4. Race condition in signup: `profiles.upsert` runs before the session exists

**File:** `src/pages/Auth.tsx:33-48`

```tsx
// Auth.tsx
const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } });
if (err) { ... return; }

// PROBLEM: if email confirmation is enabled, session is null here.
// This upsert will fail with an RLS violation and be silently ignored.
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  await supabase.from("profiles").upsert({ id: session.user.id, email, full_name: name, role });
}
```

The `handle_new_user()` trigger in `schema.sql:321-337` already creates the profiles row on signup. The client-side upsert is redundant AND will fail silently when email confirmation is enabled (no session → RLS rejects it). If both succeed there is a double-write race.

```tsx
// Fix: delete lines 36-39 in Auth.tsx entirely.
// The handle_new_user() DB trigger already creates the profile row.
// After signUp, just call getSession and redirect:
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", session.user.id)
    .maybeSingle();
  signIn(email, profile?.full_name ?? email.split("@")[0], profile?.role ?? role);
  navigate(profile?.role === "advertiser" ? "/app/dashboard" : "/app/creator/dashboard");
}
```

---

### 5. Matching engine fetches all creators without ownership verification, and `business_type` is always wrong

**Files:** `src/lib/matching.ts:95-98`, `src/pages/app/CreateCampaign.tsx:29-30`

Two bugs combine to make the core product feature broken end-to-end.

**Bug A — `business_type` stores the business name, not the niche:**

```tsx
// CreateCampaign.tsx:29-30
business_name: data.business,
business_type: data.business,  // ← both set to the same free-form string
```

The matching algorithm awards 40 points (the largest weight) for `creatorNiche === campaign.business_type`. But `business_type` will be a raw business name like "My Café", never matching a niche category like "אוכל". **The primary matching criterion never fires.**

```tsx
// Fix — add a dedicated niche/category field to CampaignForm and use it:
business_type: data.category, // a controlled enum selection, not a free-text name
```

**Bug B — no ownership check before running or persisting matches:**

```ts
// matching.ts:95-135
export async function runMatchingEngine(campaign: Campaign): Promise<MatchResult[]> {
  const { data } = await supabase.from("creator_profiles").select("*"); // all creators, always
  // ... compute scores ...
  supabase.from("matches").upsert(results.map(r => ({
    campaign_id: campaign.id, // caller can pass any campaign object
    creator_id: r.creator_id,
    score: r.score,
  })));
}
```

The RLS policy on `matches` would reject the upsert for non-owners, but the full table scan and scoring still run. Add an ownership check up front:

```ts
export async function runMatchingEngine(campaign: Campaign): Promise<MatchResult[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.id !== campaign.advertiser_id) {
    throw new Error("Not authorized to run matching for this campaign");
  }
  // ... rest of function unchanged
}
```

---

## 🟠 HIGH

---

### 6. Zero functional pages for creators — all data is hardcoded mock

The following pages display hardcoded data and perform no real database reads or writes:

| File | Mock Used | Real Impact |
|---|---|---|
| `src/pages/app/AllProposals.tsx:13` | `mockProposals` | Accept/reject updates local state only; nothing is written to Supabase |
| `src/pages/creator/BrowseCampaigns.tsx:8,194` | `mockCampaigns` | Creators never see real campaigns |
| `src/pages/creator/BrowseCampaigns.tsx:44` | `setTimeout(900)` | Proposal submissions are silently discarded |
| `src/pages/app/Payments.tsx:23-28` | Hardcoded `escrowPayments` | Advertisers see fake payment history |
| `src/pages/creator/Earnings.tsx:11-13` | `mockPayments` | Creators see fake earnings |

The creator proposal flow is especially deceptive — it shows a success state and navigates to the proposals page, but nothing was ever written to the database:

```tsx
// BrowseCampaigns.tsx:41-47 — fake submit
const handleSubmit = async () => {
  setLoading(true);
  await new Promise((r) => setTimeout(r, 900)); // fake network delay
  setLoading(false);
  setSubmitted(true); // shows success UI — but nothing was saved
};
```

These all need to be replaced with real Supabase queries. The proposals insert is the highest priority:

```ts
// Real proposal submit for BrowseCampaigns.tsx
const { data: { session } } = await supabase.auth.getSession();
if (!session) return;

const { error } = await supabase.from("proposals").insert({
  campaign_id: campaign.id,
  creator_id: session.user.id,
  price: Number(price),
  message: message.trim(),
  estimated_delivery: delivery ?? null,
  status: "pending",
});
if (error) { /* show error toast */ return; }
setSubmitted(true);
```

---

### 7. Campaign detail page loads without owner verification, then auto-triggers a full-table scan

**File:** `src/pages/advertiser/CampaignDetailPage.tsx:85-119`

```tsx
const fetchData = async () => {
  if (!id) return;
  // No check that session.user.id === campaign.advertiser_id
  const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
  setCampaign(c as Campaign);
};
```

Then, the moment `campaign` is set, the matching engine fires automatically:

```tsx
useEffect(() => {
  if (!campaign || !id) return;
  (async () => {
    // Runs on every fresh page load without cached matches:
    const results = await runMatchingEngine(campaign); // full creator_profiles scan
  })();
}, [campaign?.id]);
```

A creator navigating directly to `/app/campaigns/[uuid]` would trigger this scan. Fix by adding an owner check and making the first match run user-triggered:

```tsx
const fetchData = async () => {
  if (!id) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { data: c } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("advertiser_id", session.user.id) // explicit ownership check
    .maybeSingle();
  if (!c) { /* show "not found or not authorized" */ return; }
  setCampaign(c as Campaign);
};
```

---

### 8. Budget min can exceed max when budget is zero or very small

**File:** `src/pages/app/CreateCampaign.tsx:34-35`

```tsx
budget_min: Math.max(100, Math.round(data.budget * 0.7)),
budget_max: Math.round(data.budget * 1.3),
```

If `data.budget` is `0`: `budget_min = 100`, `budget_max = 0`. The matching algorithm checks `priceMin <= campaign.budget_max`, which is always false when `budget_max = 0`. **No creator would ever match the budget criterion.**

```tsx
// Fix
const budget = Math.max(100, data.budget);
const budget_min = Math.round(budget * 0.7);
const budget_max = Math.round(budget * 1.3);
```

---

### 9. `window.location.href` hard navigation in onboarding navigates to a non-existent route

**File:** `src/pages/onboarding/AdvertiserOnboarding.tsx:56`

```tsx
window.location.href = "/advertiser"; // full page reload + 404
```

`/advertiser` is not defined in `App.tsx`. The correct advertiser dashboard route is `/app/dashboard`. This means **the onboarding success flow always ends on a 404.**

```tsx
// Fix — use the router
navigate("/app/dashboard");
```

---

### 10. `updateProposalStatus` has no guard against concurrent clicks

**File:** `src/pages/advertiser/CampaignDetailPage.tsx:135-157`

The `updating` state tracks one proposal ID. While one proposal is being updated, all other proposals' accept/reject buttons remain active. A user can trigger concurrent writes across multiple proposals. Add a global `updating` boolean guard, or disable all action buttons while any update is in flight.

---

### 11. `fetchProfile` swallows errors — `loading` can hang on auth state change

**File:** `src/context/UserContext.tsx:37-44`

```tsx
const fetchProfile = async (userId: string) => {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) setProfile(data as Profile); // error is silently discarded
};
```

If the query fails (network error, RLS violation for a user with no profiles row), `setProfile` is never called and the error is swallowed. In the `onAuthStateChange` callback at line 57, `fetchProfile` is called without `.finally()` — if it throws, `loading` stays `true` forever (since the initial `.finally` at line 50 has already run). Select only needed columns and handle the error:

```tsx
const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (!error && data) setProfile(data as Profile);
};
```

---

## 🟡 MEDIUM / LOW

---

### 12. `any` casts on Supabase join results

**Files:** `src/lib/matching.ts:151-152`, `src/pages/advertiser/CampaignDetailPage.tsx:94`

```ts
// matching.ts
.filter((m: any) => m.creator_profiles)
.map((m: any) => { ... })

// CampaignDetailPage.tsx
setProposals((p as ProposalWithCreator[]) ?? []);
```

The types in `src/lib/supabase.ts` are well-defined. Define the join shape and use it:

```ts
type MatchRow = {
  creator_id: string;
  score: number;
  reasons: string[];
  creator_profiles: CreatorProfile | null;
};

// Then:
.filter((m: MatchRow) => m.creator_profiles !== null)
```

---

### 13. `select("*")` on all Supabase queries

**Files:** `matching.ts:97`, `UserContext.tsx:38`, `CampaignDetailPage.tsx:87`

All queries use `select("*")`. This over-fetches, makes intent unclear, and will silently start returning new columns if the schema grows. Select only the columns each feature actually uses.

---

### 14. Duplicate dead-code page directories

The router in `App.tsx` uses pages from `src/pages/app/` and `src/pages/creator/`, but the following directories and files are orphaned:

- `src/pages/advertiser/` (except `CampaignDetailPage.tsx` which is referenced)
- `src/pages/dashboard/` (8 files, none in the router)
- `src/pages/AdvertiserDashboard.tsx`, `src/pages/Dashboard.tsx`, `src/pages/LoginPage.tsx`, `src/pages/RoleSelectPage.tsx`

These add ~1,500+ lines of dead code and will confuse future developers.

---

### 15. Score normalization displays misleading match percentages

**File:** `src/pages/advertiser/CampaignDetailPage.tsx:50-53`

```tsx
// Maps raw 0–100 to a "realistic" 62–94 range
function normalizeScore(raw: number): number {
  return Math.round(62 + (raw / 100) * 32);
}
```

A creator with a raw score of 0 displays as 62 ("partial match"). The label "high match" requires ≥88 displayed, which maps back to a raw score of ~81. The displayed number is cosmetically inflated and has no honest meaning. Either show the raw score, or rename the field to something like "compatibility index" with documented meaning.

---

### 16. `confirm()` and `alert()` used for destructive campaign deletion

**File:** `src/pages/app/Dashboard.tsx:54, 64`

```tsx
if (!confirm("למחוק את הקמפיין?...")) return;
// ...
alert(error ? `שגיאה: ${error.message}` : "המחיקה נכשלה");
```

Browser `confirm`/`alert` are blocked in sandboxed iframes, look inconsistent in RTL UIs (button order is browser-determined), and cannot be styled. Replace with a shadcn `AlertDialog`.

---

### 17. No cooldown on the "Run Matching Again" button

**File:** `src/pages/advertiser/CampaignDetailPage.tsx:121-133`

`handleRefreshMatching` can be triggered as fast as the user can click. Each call scans the full `creator_profiles` table and bulk-upserts matches. Add a cooldown:

```tsx
const [lastRun, setLastRun] = useState(0);

const handleRefreshMatching = async () => {
  if (Date.now() - lastRun < 10_000) return; // 10-second cooldown
  setLastRun(Date.now());
  // ...
};
```

---

## Summary Table

| # | Severity | File | Issue |
|---|---|---|---|
| 1 | 🔴 CRITICAL | `App.tsx:38` | `UserProvider` never mounted — `useUser()` always returns defaults |
| 2 | 🔴 CRITICAL | `AppLayout.tsx:6` | Route auth reads localStorage, not Supabase session |
| 3 | 🔴 CRITICAL | `schema.sql:302` | Notifications RLS `with check (true)` — any user can notify any user |
| 4 | 🔴 CRITICAL | `Auth.tsx:36-38` | Signup race: client upsert to profiles before session exists; DB trigger already handles this |
| 5 | 🔴 CRITICAL | `matching.ts:95` / `CreateCampaign.tsx:30` | `business_type` stores wrong value, killing the 40-pt niche score; no ownership check on matching |
| 6 | 🟠 HIGH | Multiple pages | Core creator and payment flows use hardcoded mock data; proposals are never written to DB |
| 7 | 🟠 HIGH | `CampaignDetailPage.tsx:85` | No owner check before fetching; auto-triggers full-table scan on every page load |
| 8 | 🟠 HIGH | `CreateCampaign.tsx:34` | Budget min can exceed max (budget=0), breaking all matching |
| 9 | 🟠 HIGH | `AdvertiserOnboarding.tsx:56` | `window.location.href = "/advertiser"` navigates to a non-existent route |
| 10 | 🟠 HIGH | `CampaignDetailPage.tsx:135` | No guard against concurrent proposal accept/reject clicks |
| 11 | 🟠 HIGH | `UserContext.tsx:37` | `fetchProfile` swallows errors; `loading` can hang indefinitely |
| 12 | 🟡 MEDIUM | `matching.ts:151` | `any` casts on Supabase join results |
| 13 | 🟡 MEDIUM | Multiple files | `select("*")` used on all Supabase queries |
| 14 | 🟡 MEDIUM | `src/pages/` | ~12 orphaned page files not referenced in the router |
| 15 | 🟡 LOW | `CampaignDetailPage.tsx:50` | Score normalization displays cosmetically inflated, meaningless numbers |
| 16 | 🟡 LOW | `Dashboard.tsx:54` | `confirm()` / `alert()` used for destructive actions |
| 17 | 🟡 LOW | `CampaignDetailPage.tsx:121` | No cooldown on "refresh matching" button |

---

## Recommended Fix Order

### Phase 1 — Blockers (do before any new features)

1. **Mount `<UserProvider>` in `App.tsx`** — 5-minute fix, unblocks items 1, 9, 11
2. **Switch `AppLayout` to `useUser()`** — makes real Supabase auth the enforcer (fixes item 2)
3. **Delete the client-side `profiles.upsert` in `Auth.tsx:36-39`** — trust the DB trigger (fixes item 4)
4. **Fix `business_type` field in `CreateCampaign.tsx`** — the core matching feature is broken without it (fixes item 5A)
5. **Add ownership check to `runMatchingEngine`** (fixes item 5B)

### Phase 2 — Feature completeness

6. Wire `AllProposals.tsx` to real Supabase queries
7. Replace fake proposal submit in `BrowseCampaigns.tsx` with a real `proposals.insert`
8. Wire `Payments.tsx` and `Earnings.tsx` to real Supabase queries
9. Fix `AdvertiserOnboarding.tsx` to use `navigate("/app/dashboard")` (fixes item 9)
10. Tighten the notifications RLS policy (fixes item 3)

### Phase 3 — Quality

11. Add owner check to campaign fetch in `CampaignDetailPage.tsx`
12. Delete orphaned page directories
13. Replace `confirm`/`alert` with `AlertDialog`
14. Add cooldown to matching refresh button
15. Replace all `any` casts with typed Supabase join shapes
16. Replace all `select("*")` with specific column lists
