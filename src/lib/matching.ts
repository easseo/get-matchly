import { supabase, type DbCampaign, type DbCreator } from "@/lib/supabase";
import type { CampaignInput, Creator, ScoredCreator } from "@/data/creators";

const formatFollowers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

const businessToNiches: Record<string, string[]> = {
  "מסעדה": ["מסעדה", "אוכל"],
  "אופנה": ["אופנה", "לייפסטייל"],
  "כושר": ["כושר", "ספורט", "בריאות"],
  "ביוטי": ["ביוטי", "אופנה"],
  "אחר": ["לייפסטייל"],
};

const nicheLabels: Record<string, string> = {
  "מסעדה": "מסעדנות", "אוכל": "קולינריה", "אופנה": "אופנה", "ביוטי": "ביוטי",
  "כושר": "כושר", "ספורט": "ספורט", "בריאות": "בריאות", "לייפסטייל": "לייפסטייל",
  "טכנולוגיה": "טכנולוגיה", "משפחה": "משפחה והורות", "הורות": "הורות",
  "נסיעות": "טיולים ונסיעות", "עיצוב": "עיצוב", "גאדג'טים": "גאדג'טים",
};

function scoreCreator(c: Creator, campaign: CampaignInput) {
  let score = 0;
  const reasons: string[] = [];
  const targets = businessToNiches[campaign.business] ?? [];
  const overlap = c.niches.filter((n) => targets.includes(n)).length;
  if (overlap > 0) {
    score += overlap === c.niches.length ? 40 : 30;
    reasons.push(`מומחה.ית בתחום ה${nicheLabels[c.niches[0]] ?? c.niches[0]} - בדיוק הקהל שלכם`);
  } else score += 8;

  if (c.platform === campaign.platform) { score += 15; reasons.push(`פעיל.ה במיוחד ב־${c.platform}`); }

  if (campaign.location === "כל הארץ" || c.location === campaign.location) {
    score += 12;
    if (campaign.location !== "כל הארץ") reasons.push(`קהל מקומי ומחובר באזור ${c.location}`);
  } else score += 4;

  const budgetRatio = c.price / campaign.budget;
  if (budgetRatio <= 1) {
    score += 18 - Math.abs(1 - budgetRatio) * 8;
    if (budgetRatio <= 0.85) reasons.push(`מתאים בול לתקציב שלכם`);
  } else if (budgetRatio <= 1.2) score += 6;
  else score -= 5;

  const goalEngagementBoost = campaign.goal === "יותר מכירות" || campaign.goal === "יותר לקוחות" ? 2.2 : 1.4;
  score += c.engagementRate * goalEngagementBoost;
  if (c.engagementRate >= 6) reasons.push(`מעורבות גבוהה במיוחד (${c.engagementRate}%) - קהל שמגיב`);

  const reachBoost = campaign.goal === "יותר חשיפה" ? 1 : 0.4;
  score += Math.log10(c.followers) * reachBoost * 4;
  if (campaign.goal === "יותר חשיפה" && c.followers >= 150000)
    reasons.push(`חשיפה רחבה לקהל של ${formatFollowers(c.followers)} עוקבים`);

  if (reasons.length < 3) {
    const fillers = [
      `קהילה אותנטית של ${formatFollowers(c.followers)} עוקבים`,
      `התוכן שלו.ה מתאים מצוין ל${campaign.contentType || "פורמט שבחרתם"}`,
      `שיתופי פעולה מוצלחים עם מותגים דומים`,
      `אמון גבוה של הקהל בהמלצות שלו.ה`,
    ];
    for (const f of fillers) { if (reasons.length >= 3) break; if (!reasons.includes(f)) reasons.push(f); }
  }
  return { score, reasons: reasons.slice(0, 3) };
}

function toSuccessProbability(score: number, rank: number) {
  const base = Math.min(98, Math.max(72, Math.round(60 + score * 0.45)));
  const jitter = ((rank * 7) % 4) - 1;
  return Math.max(70, Math.min(98, base - rank + jitter));
}

function dbToCreator(d: DbCreator): Creator {
  return {
    id: d.id, name: d.name, niches: d.niches, platform: d.platform,
    followers: d.followers, engagementRate: Number(d.engagement_rate),
    location: d.location, price: d.price, avatar: d.avatar, gradient: d.gradient,
  };
}

export async function fetchCreators(): Promise<Creator[]> {
  const { data, error } = await supabase.from("creators").select("*");
  if (error) throw error;
  return (data as DbCreator[]).map(dbToCreator);
}

export async function saveCampaign(input: {
  business: string; goal: string; budget: number; location: string;
  platform: string; contentType: string;
  contents: { type: string; qty: number }[]; deadline?: string;
}): Promise<string> {
  const row: DbCampaign = {
    business: input.business, goal: input.goal, budget: input.budget,
    location: input.location, platform: input.platform,
    content_type: input.contentType, contents: input.contents,
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
  const scored = creators
    .filter((c) => !excludeIds.includes(c.id))
    .map((c) => ({ creator: c, ...scoreCreator(c, campaign) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const result: ScoredCreator[] = scored
    .map((s, i) => ({
      ...s.creator,
      followersLabel: formatFollowers(s.creator.followers),
      successProbability: toSuccessProbability(s.score, i),
      reasons: s.reasons,
      score: s.score,
    }))
    .sort((a, b) => b.successProbability - a.successProbability);

  if (result.length > 0) {
    const matchRows = result.map((r, i) => ({
      campaign_id: campaignId,
      creator_id: r.id,
      score: r.score,
      success_probability: r.successProbability,
      reasons: r.reasons,
      rank: i + 1,
    }));
    const { error } = await supabase.from("matches").insert(matchRows);
    if (error) console.error("Failed to save matches:", error);
  }
  return result;
}
