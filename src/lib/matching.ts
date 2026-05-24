import { supabase } from "./supabase";
import type { Campaign } from "./supabase";

type CreatorWithProfile = {
  id: string;
  full_name: string;
  email: string;
  creator_profiles: {
    instagram_username: string | null;
    niche: string | null;
    location: string | null;
    followers: number | null;
    engagement_rate: number | null;
    price_min: number | null;
    price_max: number | null;
    content_types: string[] | null;
    bio: string | null;
    availability: boolean | null;
  } | null;
};

export type MatchResult = {
  creator_id: string;
  score: number;
  reasons: string[];
  creator: CreatorWithProfile;
};

const nicheMap: Record<string, string[]> = {
  "ביוטי":         ["ביוטי"],
  "אופנה":         ["אופנה"],
  "אוכל ומסעדות":  ["אוכל ומסעדות"],
  "כושר ובריאות":  ["כושר ובריאות"],
  "טכנולוגיה":     ["טכנולוגיה"],
  "טיולים":        ["טיולים"],
  "גיימינג":       ["גיימינג"],
  "בית ועיצוב":    ["בית ועיצוב"],
  "חינוך":         ["חינוך"],
};

function scoreCreator(campaign: Campaign, creator: CreatorWithProfile): { score: number; reasons: string[] } {
  const cp = creator.creator_profiles;
  if (!cp) return { score: 0, reasons: [] };

  let score = 0;
  const reasons: string[] = [];

  // Niche match (30 pts)
  const matchingNiches = nicheMap[campaign.business_type] ?? [];
  if (matchingNiches.includes(cp.niche ?? "")) {
    score += 30;
    reasons.push(`מומחה בתחום ${cp.niche}`);
  } else {
    score += 5;
  }

  // Location match (20 pts)
  if (
    campaign.target_location === "כל הארץ" ||
    cp.location === "כל הארץ" ||
    cp.location === campaign.target_location
  ) {
    score += 20;
    reasons.push(`מיקום מתאים: ${cp.location}`);
  }

  // Budget overlap (25 pts)
  const priceMin = cp.price_min ?? 0;
  const priceMax = cp.price_max ?? 999999;
  if (priceMin <= campaign.budget_max && priceMax >= campaign.budget_min) {
    score += 25;
    reasons.push("מחיר בטווח התקציב");
  } else if (priceMin <= campaign.budget_max * 1.5) {
    score += 10;
    reasons.push("מחיר קרוב לתקציב");
  }

  // Content format match (20 pts)
  const creatorTypes = cp.content_types ?? [];
  const matched = creatorTypes.filter((t) => campaign.content_format.includes(t));
  if (matched.length > 0) {
    score += 20;
    reasons.push(`פורמט תוכן: ${matched.join(", ")}`);
  }

  // Engagement bonus (5 pts)
  if ((cp.engagement_rate ?? 0) >= 3) {
    score += 5;
    reasons.push(`מעורבות ${cp.engagement_rate}%`);
  }

  return { score: Math.min(score, 100), reasons };
}

export async function runMatchingEngine(campaign: Campaign): Promise<MatchResult[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, creator_profiles(*)")
    .eq("role", "creator");

  if (!data || data.length === 0) return [];

  const results: MatchResult[] = (data as CreatorWithProfile[])
    .filter((c) => c.creator_profiles?.availability !== false)
    .map((creator) => {
      const { score, reasons } = scoreCreator(campaign, creator);
      return { creator_id: creator.id, score, reasons, creator };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // return top 15

  if (results.length > 0) {
    await supabase.from("matches").upsert(
      results.map((r) => ({
        campaign_id: campaign.id,
        creator_id: r.creator_id,
        score: r.score,
        reasons: r.reasons,
      })),
      { onConflict: "campaign_id,creator_id" }
    );
  }

  return results;
}

export async function getExistingMatches(campaignId: string): Promise<MatchResult[]> {
  const { data } = await supabase
    .from("matches")
    .select("*, profiles!matches_creator_id_fkey(id, full_name, email, creator_profiles(*))")
    .eq("campaign_id", campaignId)
    .order("score", { ascending: false });

  if (!data) return [];

  return data.map((m: any) => ({
    creator_id: m.creator_id,
    score: m.score,
    reasons: m.reasons ?? [],
    creator: m.profiles as CreatorWithProfile,
  }));
}
