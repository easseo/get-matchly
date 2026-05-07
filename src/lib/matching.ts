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

const businessToNiches: Record<string, string[]> = {
  "מסעדה": ["אוכל"],
  "אופנה": ["אופנה", "לייפסטייל"],
  "כושר": ["כושר"],
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

const ALLOWED_NICHES = ["אופנה","ביוטי","אוכל","כושר","לייפסטייל","טכנולוגיה","גיימינג","תיירות","רכב","עסקים"];

const nicheLabels: Record<string, string> = {
  "אופנה": "אופנה", "ביוטי": "ביוטי", "אוכל": "קולינריה", "כושר": "כושר",
  "לייפסטייל": "לייפסטייל", "טכנולוגיה": "טכנולוגיה", "גיימינג": "גיימינג",
  "תיירות": "תיירות", "רכב": "רכב", "עסקים": "עסקים",
};

type Tier = { minF: number; maxF: number; minP: number; maxP: number; minE: number; maxE: number };
const TIERS: Tier[] = [
  { minF: 0,      maxF: 5000,    minP: 300,  maxP: 800,   minE: 5.0, maxE: 9.0 },
  { minF: 5000,   maxF: 20000,   minP: 800,  maxP: 2500,  minE: 4.0, maxE: 7.0 },
  { minF: 20000,  maxF: 50000,   minP: 2000, maxP: 5000,  minE: 3.0, maxE: 6.0 },
  { minF: 50000,  maxF: 100000,  minP: 4000, maxP: 10000, minE: 2.5, maxE: 5.0 },
  { minF: 100000, maxF: Infinity, minP: 8000, maxP: Infinity, minE: 1.5, maxE: 4.0 },
];
function tierFor(f: number): Tier { return TIERS.find(t => f >= t.minF && f < t.maxF) ?? TIERS[TIERS.length-1]; }
function qualityScore(c: Creator): number {
  const t = tierFor(c.followers);
  let q = 60;
  if (c.price >= t.minP && c.price <= t.maxP) q += 20;
  else { const off = c.price < t.minP ? (t.minP - c.price)/t.minP : (c.price - t.maxP)/Math.max(t.maxP,1); q -= Math.min(25, off*30); }
  if (c.engagementRate >= t.minE && c.engagementRate <= t.maxE) q += 15;
  else { const off = c.engagementRate < t.minE ? t.minE - c.engagementRate : c.engagementRate - t.maxE; q -= Math.min(15, off*4); }
  const allValid = c.niches.every(n => ALLOWED_NICHES.includes(n));
  if (allValid && c.niches.length > 0) q += 5; else q -= 10;
  return Math.max(0, Math.min(100, Math.round(q)));
}

function scoreCreator(c: Creator, campaign: CampaignInput) {
  let score = 0;
  const reasons: string[] = [];
  const targets = targetNichesFor(campaign.business);
  const overlap = targets.length === 0 ? 0 : c.niches.filter((n) => targets.includes(n)).length;
  if (overlap > 0) {
    score += overlap === c.niches.length ? 45 : 32;
    const matched = c.niches.find((n) => targets.includes(n)) ?? c.niches[0];
    reasons.push(`מומחה.ית בתחום ה${nicheLabels[matched] ?? matched} - בדיוק הקהל שלכם`);
  } else if (targets.length === 0) {
    score += 10;
  } else {
    score -= 15;
  }

  if (c.platform === campaign.platform) { score += 12; reasons.push(`פעיל.ה במיוחד ב־${c.platform}`); }

  if (campaign.location === "כל הארץ" || c.location === campaign.location) {
    score += 10;
    if (campaign.location !== "כל הארץ") reasons.push(`קהל מקומי ומחובר באזור ${c.location}`);
  } else score += 3;

  const ratio = c.price / Math.max(campaign.budget, 1);
  if (ratio >= 0.7 && ratio <= 1.1) { score += 22; reasons.push(`מתאים בול לתקציב שלכם`); }
  else if (ratio >= 0.4 && ratio < 0.7) score += 10;
  else if (ratio > 1.1 && ratio <= 1.3) score += 4;
  else score -= 18;

  const engBoost = goalsInclude(campaign.goal, "יותר מכירות", "יותר לקוחות") ? 2.0 : 1.2;
  score += c.engagementRate * engBoost;
  if (c.engagementRate >= 5) reasons.push(`מעורבות גבוהה (${c.engagementRate}%) - קהל שמגיב`);

  const isExposureGoal = goalsInclude(campaign.goal, "יותר חשיפה");
  const reachBoost = isExposureGoal ? 1.0 : 0.35;
  score += Math.log10(Math.max(c.followers, 10)) * reachBoost * 4;
  if (isExposureGoal && c.followers >= 100000)
    reasons.push(`חשיפה רחבה לקהל של ${formatFollowers(c.followers)} עוקבים`);

  const q = qualityScore(c);
  score += (q - 60) * 0.15;

  if (reasons.length < 3) {
    const fillers = [
      `קהילה אותנטית של ${formatFollowers(c.followers)} עוקבים`,
      `התוכן שלו.ה מתאים מצוין ל${campaign.contentType || "פורמט שבחרתם"}`,
      `שיתופי פעולה מוצלחים עם מותגים דומים`,
      `אמון גבוה של הקהל בהמלצות שלו.ה`,
    ];
    for (const f of fillers) { if (reasons.length >= 3) break; if (!reasons.includes(f)) reasons.push(f); }
  }
  return { score, reasons: reasons.slice(0, 3), quality: q };
}

function toSuccessProbability(score: number, quality: number, rank: number) {
  const base = Math.round(45 + score * 0.55);
  const qualityCap = Math.round(70 + (quality - 60) * 0.5);
  const capped = Math.min(base, qualityCap, 96);
  const jitter = ((rank * 7) % 3) - 1;
  return Math.max(60, Math.min(96, capped - rank + jitter));
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
