import { supabase, type DbCampaign, type DbCreator } from "@/lib/supabase";
import type { CampaignInput, Creator, ScoredCreator } from "@/data/creators";

const gradients = [
  "from-pink-500 via-rose-500 to-orange-400",
  "from-fuchsia-500 via-pink-500 to-yellow-400",
  "from-purple-500 via-pink-500 to-orange-500",
  "from-orange-400 via-pink-500 to-purple-600",
  "from-yellow-400 via-orange-500 to-pink-600",
  "from-violet-500 via-fuchsia-500 to-pink-500",
];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2);

const formatFollowers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

// Niche relations: business -> { exact: [...], related: [...] }
const businessRelations: Record<string, { exact: string[]; related: string[] }> = {
  "מסעדה": { exact: ["מסעדה", "אוכל"], related: ["לייפסטייל"] },
  "אופנה": { exact: ["אופנה"], related: ["לייפסטייל"] },
  "כושר": { exact: ["כושר", "ספורט"], related: ["בריאות", "לייפסטייל"] },
  "ביוטי": { exact: ["ביוטי"], related: ["אופנה", "לייפסטייל"] },
  "אחר": { exact: [], related: [] },
};

const nicheLabel: Record<string, string> = {
  "מסעדה": "המסעדנות", "אוכל": "הקולינריה", "אופנה": "האופנה", "ביוטי": "הביוטי",
  "כושר": "הכושר", "ספורט": "הספורט", "בריאות": "הבריאות",
};

function splitMulti(s: string): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

function relationsFor(business: string) {
  const items = splitMulti(business);
  const exact = new Set<string>();
  const related = new Set<string>();
  for (const b of items) {
    const rel = businessRelations[b];
    if (!rel) continue;
    rel.exact.forEach((n) => exact.add(n));
    rel.related.forEach((n) => related.add(n));
  }
  // Related cannot also be exact
  Array.from(exact).forEach((n) => related.delete(n));
  return { exact: Array.from(exact), related: Array.from(related) };
}

function goalsInclude(goal: string, ...candidates: string[]): boolean {
  const items = splitMulti(goal);
  return items.some((g) => candidates.includes(g));
}

type ScoreBreakdown = {
  niche: number;
  budget: number;
  location: number;
  engagement: number;
  followers: number;
  total: number;
  reasons: string[];
  matchType: "exact" | "related" | "none";
  budgetFit: "in" | "partial" | "out";
  excluded?: string;
};

function scoreCreator(c: Creator, campaign: CampaignInput): ScoreBreakdown {
  const reasons: string[] = [];
  const { exact, related } = relationsFor(campaign.business);
  const businesses = splitMulti(campaign.business);

  const empty = (excluded: string): ScoreBreakdown => ({
    niche: 0, budget: 0, location: 0, engagement: 0, followers: 0,
    total: 0, reasons: [], matchType: "none", budgetFit: "out", excluded,
  });

  // --- Niche (40) ---
  let niche = 0;
  let matchType: "exact" | "related" | "none" = "none";
  const hasExact = c.niches.some((n) => exact.includes(n));
  const hasRelated = c.niches.some((n) => related.includes(n));
  const hasNicheRules = exact.length > 0 || related.length > 0;

  if (hasExact) {
    niche = 40;
    matchType = "exact";
    const primary = businesses[0] || c.niches.find((n) => exact.includes(n)) || "";
    const label = nicheLabel[primary] || primary;
    reasons.push(label ? `מתאים לתחום ${label}` : "מתאים לתחום הקמפיין");
  } else if (hasRelated) {
    niche = 22;
    matchType = "related";
    reasons.push("תחום קרוב לקמפיין שלכם");
  } else if (!hasNicheRules) {
    // Unknown business (e.g. "אחר") — neutral
    niche = 22;
    matchType = "related";
  } else {
    return empty("niche-unrelated");
  }

  // --- Budget (25) — exclude if fully outside ---
  const cMin = c.priceMin ?? c.price;
  const cMax = c.priceMax ?? c.price;
  const bMin = campaign.budgetMin ?? Math.round(campaign.budget * 0.8);
  const bMax = campaign.budgetMax ?? Math.round(campaign.budget * 1.2);

  let budget = 0;
  let budgetFit: "in" | "partial" | "out" = "out";
  const fullyInside = cMin >= bMin && cMax <= bMax;
  const overlaps = cMax >= bMin && cMin <= bMax;
  if (fullyInside) {
    budget = 25;
    budgetFit = "in";
    reasons.push("נמצא בטווח התקציב שלך");
  } else if (overlaps) {
    budget = 15;
    budgetFit = "partial";
    reasons.push("נמצא בטווח התקציב שלך");
  } else {
    return empty("budget-out-of-range");
  }

  // --- Location (10) ---
  let location = 0;
  if (campaign.location === "כל הארץ") {
    location = 7;
  } else if (c.location === campaign.location) {
    location = 10;
    reasons.push(`קהל רלוונטי ב${c.location}`);
  } else {
    location = 0;
  }

  // --- Engagement (15) ---
  let engagement = 2;
  const er = c.engagementRate;
  if (er > 6) engagement = 15;
  else if (er >= 4) engagement = 12;
  else if (er >= 2) engagement = 7;
  else engagement = 3;
  if (er >= 4) reasons.push("מעורבות גבוהה ביחס לגודל הקהל");

  // --- Followers (10) ---
  let followers = 2;
  const f = c.followers;
  if (f >= 100000) followers = 10;
  else if (f >= 50000) followers = 9;
  else if (f >= 20000) followers = 7;
  else if (f >= 5000) followers = 5;
  else followers = 2;
  if (f >= 50000) reasons.push("קהל עוקבים גדול");

  let total = niche + budget + location + engagement + followers;

  // Followers caps
  if (f < 2000) total = Math.min(total, 80);
  else if (f < 5000) total = Math.min(total, 90);

  total = Math.max(0, Math.min(100, Math.round(total)));

  return {
    niche, budget, location, engagement, followers,
    total, reasons: reasons.slice(0, 4), matchType, budgetFit,
  };
}

function dbToCreator(d: DbCreator, idx: number): Creator {
  const priceMin = d.price_min ?? 0;
  const priceMax = d.price_max ?? d.price_min ?? 0;
  const price = Math.round((priceMin + priceMax) / 2);
  return {
    id: d.id,
    name: d.name,
    niches: d.niche ? [d.niche] : [],
    platform: d.platform,
    followers: d.followers,
    engagementRate: Number(d.engagement_rate),
    location: d.location,
    price,
    priceMin,
    priceMax,
    avatar: d.profile_image || initials(d.name),
    gradient: gradients[idx % gradients.length],
  };
}

export async function fetchCreators(): Promise<Creator[]> {
  const { data, error } = await supabase.from("creators").select("*");
  if (error) throw error;
  return (data as DbCreator[]).map(dbToCreator);
}

export async function saveCampaign(input: {
  business: string; goal: string; budget: number; platform: string;
  contents: { type: string; qty: number }[]; deadline?: string;
  budgetMin?: number; budgetMax?: number;
}): Promise<string> {
  const row: DbCampaign = {
    business_type: input.business,
    goal: input.goal,
    budget_min: input.budgetMin ?? Math.round(input.budget * 0.8),
    budget_max: input.budgetMax ?? Math.round(input.budget * 1.2),
    platform: input.platform,
    content_types: input.contents.map((c) => c.type),
    deadline: input.deadline ?? null,
  };
  const { data, error } = await supabase.from("campaigns").insert(row).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function matchAndSave(
  campaignId: string,
  campaign: CampaignInput,
  excludeIds: string[] = [],
  limit = 3
): Promise<ScoredCreator[]> {
  const creators = await fetchCreators();
  const available = creators.filter((c) => !excludeIds.includes(c.id));

  const scored = available.map((c) => ({ creator: c, ...scoreCreator(c, campaign) }));

  // Debug logs
  console.groupCollapsed(`[Matching] Campaign: ${campaign.business} | budget ${campaign.budgetMin ?? "?"}-${campaign.budgetMax ?? "?"} | ${campaign.platform} | ${campaign.location}`);
  scored.forEach((s) => {
    if (s.excluded) {
      console.log(`✗ ${s.creator.name} — excluded: ${s.excluded}`);
    } else {
      console.log(
        `• ${s.creator.name} | niche:${s.niche} budget:${s.budget}(${s.budgetFit}) platform:${s.platform} location:${s.location} engagement:${s.engagement} → total:${s.total} [${s.matchType}]`
      );
    }
  });
  console.groupEnd();

  // Filter excluded (unrelated niche)
  const eligible = scored.filter((s) => !s.excluded);

  // Tier 1: in-budget candidates with score >= 70
  const inBudget = eligible.filter((s) => s.budgetFit === "in" && s.total >= 70);
  const sortFn = (a: typeof scored[number], b: typeof scored[number]) => {
    if (b.total !== a.total) return b.total - a.total;
    // tie-breakers: exact niche, budget fit, engagement, followers
    const exactDiff = (b.matchType === "exact" ? 1 : 0) - (a.matchType === "exact" ? 1 : 0);
    if (exactDiff) return exactDiff;
    const fitDiff = (b.budgetFit === "in" ? 1 : 0) - (a.budgetFit === "in" ? 1 : 0);
    if (fitDiff) return fitDiff;
    if (b.engagement !== a.engagement) return b.engagement - a.engagement;
    return b.creator.followers - a.creator.followers;
  };

  let chosen = inBudget.sort(sortFn).slice(0, limit);

  // If fewer than limit and fewer than 3 valid in-budget, allow near/out-of-budget creators (capped score)
  // Per spec: only if there are NOT at least 3 valid creators we can show out-of-budget ones, but capped at 60.
  if (chosen.length < 3) {
    const fallback = eligible
      .filter((s) => !chosen.includes(s) && s.total >= 70 && s.budgetFit !== "in")
      .sort(sortFn);
    for (const s of fallback) {
      if (chosen.length >= limit) break;
      chosen.push(s);
    }
  }

  // Final hard threshold: score >= 70
  chosen = chosen.filter((s) => s.total >= 70).sort(sortFn);

  const result: ScoredCreator[] = chosen.map((s) => ({
    ...s.creator,
    followersLabel: formatFollowers(s.creator.followers),
    successProbability: s.total,
    reasons: s.reasons,
    score: s.total,
  }));

  if (result.length > 0) {
    const matchRows = result.map((r) => ({
      campaign_id: campaignId,
      creator_id: r.id,
      score: r.score,
    }));
    const { error } = await supabase.from("matches").insert(matchRows);
    if (error) console.error("Failed to save matches:", error);
  }
  return result;
}
