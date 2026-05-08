import { supabase, type DbCampaign, type DbCreator } from "@/lib/supabase";
import type { CampaignInput, Creator, ScoredCreator } from "@/data/creators";
import dalitGolanAvatar from "@/assets/creators/dalit-golan.png";

const avatarOverrides: Record<string, string> = {
  "דלית גולן": dalitGolanAvatar,
};

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

const businessToNiches: Record<string, string[]> = {
  "מסעדה": ["מסעדה", "אוכל"],
  "אופנה": ["אופנה", "לייפסטייל"],
  "כושר": ["כושר", "ספורט", "בריאות"],
  "ביוטי": ["ביוטי", "אופנה"],
  "אחר": [],
};

function splitMulti(s: string): string[] {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

function targetNichesFor(business: string): string[] {
  const items = splitMulti(business);
  const set = new Set<string>();
  for (const b of items) {
    const list = businessToNiches[b] ?? [];
    list.forEach((n) => set.add(n));
  }
  return Array.from(set);
}

function goalsInclude(goal: string, ...candidates: string[]): boolean {
  const items = splitMulti(goal);
  return items.some((g) => candidates.includes(g));
}

const nicheLabels: Record<string, string> = {
  "מסעדה": "מסעדנות", "אוכל": "קולינריה", "אופנה": "אופנה", "ביוטי": "ביוטי",
  "כושר": "כושר", "ספורט": "ספורט", "בריאות": "בריאות", "לייפסטייל": "לייפסטייל",
  "טכנולוגיה": "טכנולוגיה", "משפחה": "משפחה והורות", "הורות": "הורות",
  "נסיעות": "טיולים ונסיעות", "עיצוב": "עיצוב", "גאדג'טים": "גאדג'טים",
};

function scoreCreator(c: Creator, campaign: CampaignInput) {
  let score = 0;
  const reasons: string[] = [];
  const targets = targetNichesFor(campaign.business);
  const overlap = targets.length === 0 ? 0 : c.niches.filter((n) => targets.includes(n)).length;
  if (overlap > 0) {
    score += overlap === c.niches.length ? 40 : 30;
    const matched = c.niches.find((n) => targets.includes(n)) ?? c.niches[0];
    reasons.push(`מומחה.ית בתחום ה${nicheLabels[matched] ?? matched} - בדיוק הקהל שלכם`);
  } else if (targets.length === 0) {
    score += 12;
  } else {
    score += 4;
  }

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

  const goalEngagementBoost = goalsInclude(campaign.goal, "יותר מכירות", "יותר לקוחות") ? 2.2 : 1.4;
  score += c.engagementRate * goalEngagementBoost;
  if (c.engagementRate >= 6) reasons.push(`מעורבות גבוהה במיוחד (${c.engagementRate}%) - קהל שמגיב`);

  const isExposureGoal = goalsInclude(campaign.goal, "יותר חשיפה");
  const reachBoost = isExposureGoal ? 1 : 0.4;
  score += Math.log10(Math.max(c.followers, 10)) * reachBoost * 4;
  if (isExposureGoal && c.followers >= 150000)
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

function dbToCreator(d: DbCreator, idx: number): Creator {
  const price = Math.round(((d.price_min ?? 0) + (d.price_max ?? d.price_min ?? 0)) / 2);
  return {
    id: d.id,
    name: d.name,
    niches: d.niche ? [d.niche] : [],
    platform: d.platform,
    followers: d.followers,
    engagementRate: Number(d.engagement_rate),
    location: d.location,
    price,
    avatar: avatarOverrides[d.name] || d.profile_image || initials(d.name),
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
}): Promise<string> {
  const row: DbCampaign = {
    business_type: input.business,
    goal: input.goal,
    budget_min: Math.round(input.budget * 0.8),
    budget_max: Math.round(input.budget * 1.2),
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
  const targets = targetNichesFor(campaign.business);
  const scored = creators
    .filter((c) => !excludeIds.includes(c.id))
    .filter((c) => targets.length === 0 || c.niches.some((n) => targets.includes(n)))
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
    .filter((c) => c.successProbability >= 70)
    .sort((a, b) => b.successProbability - a.successProbability);

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
