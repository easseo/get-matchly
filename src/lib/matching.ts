import { supabase } from "./supabase";
import type { Campaign } from "./supabase";

type CreatorProfile = {
  user_id: string;
  instagram_username: string | null;
  niche: string | null;
  location: string | null;
  followers: number | null;
  engagement_rate: number | null;
  price_min: number | null;
  price_max: number | null;
  content_types: string[] | null;
  content_pricing: Record<string, number> | null;
  bio: string | null;
  availability: boolean | null;
  // joined from profiles (may be null if RLS blocks)
  full_name?: string | null;
};

export type MatchResult = {
  creator_id: string;
  score: number;
  reasons: string[];
  budget_fit: boolean;
  creator: {
    id: string;
    full_name: string;
    email: string;
    creator_profiles: CreatorProfile | null;
  };
};

function scoreCreator(
  campaign: Campaign,
  cp: CreatorProfile
): { score: number; reasons: string[]; budget_fit: boolean } {
  let score = 0;
  const reasons: string[] = [];

  // ── Niche match: 40 pts ─────────────────────────────────────────────────
  const creatorNiche = cp.niche ?? "";
  if (creatorNiche && creatorNiche === campaign.business_type) {
    score += 40;
    reasons.push(`מומחה בתחום ${creatorNiche}`);
  } else if (creatorNiche) {
    score -= 15; // strong mismatch penalty
  }

  // ── Budget fit: 25 pts ──────────────────────────────────────────────────
  const priceMin = cp.price_min ?? 0;
  const priceMax = cp.price_max ?? 999999;
  const budgetFit = priceMin <= campaign.budget_max && priceMax >= campaign.budget_min;
  if (budgetFit) {
    score += 25;
    reasons.push("מחיר בתוך התקציב");
  }

  // ── Location match: 15 pts ──────────────────────────────────────────────
  const loc = cp.location ?? "";
  if (!campaign.target_location || campaign.target_location === "כל הארץ" || loc === "כל הארץ" || loc === campaign.target_location) {
    score += 15;
    reasons.push(`מיקום מתאים: ${loc || "ארצי"}`);
  }

  // ── Engagement rate: 10 pts ─────────────────────────────────────────────
  const eng = cp.engagement_rate ?? 0;
  if (eng >= 5) {
    score += 10;
    reasons.push(`מעורבות גבוהה ${eng}%`);
  } else if (eng >= 3) {
    score += 6;
    reasons.push(`מעורבות טובה ${eng}%`);
  } else if (eng > 0) {
    score += 3;
  }

  // ── Followers: 10 pts ───────────────────────────────────────────────────
  const followers = cp.followers ?? 0;
  if (followers >= 100000) {
    score += 10;
    reasons.push(`${Math.round(followers / 1000)}K עוקבים`);
  } else if (followers >= 30000) {
    score += 7;
    reasons.push(`${Math.round(followers / 1000)}K עוקבים`);
  } else if (followers >= 10000) {
    score += 4;
    reasons.push(`${Math.round(followers / 1000)}K עוקבים`);
  } else if (followers > 0) {
    score += 2;
  }

  return { score: Math.max(0, Math.min(score, 100)), reasons, budget_fit: budgetFit };
}

export async function runMatchingEngine(campaign: Campaign): Promise<MatchResult[]> {
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*");

  if (error) throw new Error(`creator_profiles query failed: ${error.message}`);
  if (!data || data.length === 0) throw new Error(`creator_profiles returned empty (count=0)`);

  const results: MatchResult[] = (data as CreatorProfile[])
    .map((cp) => {
      const { score, reasons, budget_fit } = scoreCreator(campaign, cp);
      const displayName = cp.full_name ?? cp.instagram_username ?? "יוצר תוכן";
      return {
        creator_id: cp.user_id,
        score,
        reasons,
        budget_fit,
        creator: {
          id: cp.user_id,
          full_name: displayName,
          email: "",
          creator_profiles: cp,
        },
      };
    })
    .sort((a, b) => {
      if (a.budget_fit !== b.budget_fit) return a.budget_fit ? -1 : 1;
      return b.score - a.score;
    });

  // Try to save matches (silently ignore RLS errors)
  if (results.length > 0) {
    supabase.from("matches").upsert(
      results.map((r) => ({
        campaign_id: campaign.id,
        creator_id: r.creator_id,
        score: r.score,
        reasons: r.reasons,
      })),
      { onConflict: "campaign_id,creator_id" }
    ).then(({ error }) => { if (error) console.warn("matches upsert:", error.message); });
  }

  return results;
}

export async function getExistingMatches(campaignId: string): Promise<MatchResult[]> {
  const { data } = await supabase
    .from("matches")
    .select("*, creator_profiles!matches_creator_id_fkey(*)")
    .eq("campaign_id", campaignId)
    .order("score", { ascending: false });

  if (!data) return [];

  return data
    .filter((m: any) => m.creator_profiles)
    .map((m: any) => {
      const cp = m.creator_profiles as CreatorProfile;
      const displayName = cp.instagram_username ?? "יוצר תוכן";
      return {
        creator_id: m.creator_id,
        score: m.score,
        reasons: m.reasons ?? [],
        budget_fit: true,
        creator: {
          id: m.creator_id,
          full_name: displayName,
          email: "",
          creator_profiles: cp,
        },
      };
    });
}
