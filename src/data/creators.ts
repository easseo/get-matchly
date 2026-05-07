export type Creator = {
  id: string;
  name: string;
  niches: string[];
  platform: string;
  followers: number;
  engagementRate: number; // percent
  location: string;
  price: number;
  avatar: string;
  gradient: string;
};

export type ScoredCreator = Creator & {
  followersLabel: string;
  successProbability: number;
  reasons: string[];
  score: number;
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

// === Approved niches ===
// אופנה · ביוטי · אוכל · כושר · לייפסטייל · טכנולוגיה · גיימינג · תיירות · רכב · עסקים
export const ALLOWED_NICHES = [
  "אופנה", "ביוטי", "אוכל", "כושר", "לייפסטייל",
  "טכנולוגיה", "גיימינג", "תיירות", "רכב", "עסקים",
] as const;

// === 50 realistic Israeli creators (tier-consistent followers/price/engagement) ===
const raw: Omit<Creator, "avatar" | "gradient">[] = [
  { id: "1", name: "עידו חכים", niches: ["טכנולוגיה", "רכב"], platform: "Instagram", followers: 4500, engagementRate: 5.8, location: "נתניה", price: 700 },
  { id: "2", name: "נטע חכים", niches: ["ביוטי"], platform: "YouTube", followers: 5000, engagementRate: 6.3, location: "ירושלים", price: 800 },
  { id: "3", name: "רוני לוין", niches: ["תיירות", "אוכל"], platform: "Instagram", followers: 4000, engagementRate: 6.5, location: "רמת גן", price: 550 },
  { id: "4", name: "מאיה עמר", niches: ["אוכל", "תיירות"], platform: "Instagram", followers: 2500, engagementRate: 7.4, location: "הרצליה", price: 400 },
  { id: "5", name: "יובל בר", niches: ["תיירות"], platform: "Instagram", followers: 2000, engagementRate: 8.3, location: "פתח תקווה", price: 300 },
  { id: "6", name: "רומי קפלן", niches: ["תיירות", "אוכל"], platform: "YouTube", followers: 3000, engagementRate: 7.3, location: "פתח תקווה", price: 500 },
  { id: "7", name: "יובל קפלן", niches: ["אופנה", "ביוטי"], platform: "Instagram", followers: 3500, engagementRate: 7.0, location: "באר שבע", price: 500 },
  { id: "8", name: "רן דהן", niches: ["ביוטי", "אופנה"], platform: "TikTok", followers: 3000, engagementRate: 7.3, location: "באר שבע", price: 500 },
  { id: "9", name: "שני חדד", niches: ["ביוטי", "אופנה"], platform: "TikTok", followers: 18000, engagementRate: 5.4, location: "ירושלים", price: 2300 },
  { id: "10", name: "תמר אזולאי", niches: ["עסקים", "טכנולוגיה"], platform: "YouTube", followers: 12000, engagementRate: 5.2, location: "אשדוד", price: 1650 },
  { id: "11", name: "אופיר חכים", niches: ["תיירות"], platform: "Instagram", followers: 13000, engagementRate: 5.9, location: "ראשון לציון", price: 1850 },
  { id: "12", name: "אלון טסלר", niches: ["ביוטי", "לייפסטייל"], platform: "Instagram", followers: 12000, engagementRate: 5.8, location: "הרצליה", price: 1700 },
  { id: "13", name: "רן אסולין", niches: ["רכב", "טכנולוגיה"], platform: "TikTok", followers: 11000, engagementRate: 5.3, location: "רמת גן", price: 1400 },
  { id: "14", name: "דניאל גולן", niches: ["אוכל"], platform: "Instagram", followers: 16000, engagementRate: 5.0, location: "אשדוד", price: 2050 },
  { id: "15", name: "ניר פרץ", niches: ["לייפסטייל", "אוכל"], platform: "YouTube", followers: 9000, engagementRate: 6.2, location: "ראשון לציון", price: 1200 },
  { id: "16", name: "מור חכים", niches: ["גיימינג", "טכנולוגיה"], platform: "YouTube", followers: 17000, engagementRate: 5.2, location: "אשדוד", price: 2150 },
  { id: "17", name: "נועה שפירא", niches: ["לייפסטייל", "תיירות"], platform: "Instagram", followers: 14000, engagementRate: 5.4, location: "באר שבע", price: 1700 },
  { id: "18", name: "יובל שגיא", niches: ["רכב", "לייפסטייל"], platform: "TikTok", followers: 14000, engagementRate: 5.5, location: "חולון", price: 1600 },
  { id: "19", name: "אורין אסולין", niches: ["גיימינג", "טכנולוגיה"], platform: "YouTube", followers: 18000, engagementRate: 5.0, location: "רמת גן", price: 2200 },
  { id: "20", name: "אלינור חכים", niches: ["עסקים"], platform: "Instagram", followers: 6000, engagementRate: 6.5, location: "חיפה", price: 1000 },
  { id: "21", name: "אביגיל לוין", niches: ["טכנולוגיה"], platform: "YouTube", followers: 19000, engagementRate: 5.2, location: "באר שבע", price: 2100 },
  { id: "22", name: "ענבר טסלר", niches: ["תיירות", "לייפסטייל"], platform: "Instagram", followers: 17000, engagementRate: 5.2, location: "אשדוד", price: 2250 },
  { id: "23", name: "נועה פרידמן", niches: ["ביוטי"], platform: "TikTok", followers: 28000, engagementRate: 5.1, location: "חיפה", price: 2600 },
  { id: "24", name: "ענבר אליאס", niches: ["אופנה", "ביוטי"], platform: "Instagram", followers: 22000, engagementRate: 5.5, location: "פתח תקווה", price: 2800 },
  { id: "25", name: "רן גולן", niches: ["טכנולוגיה", "רכב"], platform: "YouTube", followers: 48000, engagementRate: 4.0, location: "באר שבע", price: 4750 },
  { id: "26", name: "ספיר מלכה", niches: ["אופנה", "לייפסטייל"], platform: "Instagram", followers: 29000, engagementRate: 5.3, location: "הרצליה", price: 2900 },
  { id: "27", name: "עידו אליאס", niches: ["כושר"], platform: "Instagram", followers: 41000, engagementRate: 4.2, location: "חיפה", price: 4000 },
  { id: "28", name: "הילה אדרי", niches: ["רכב", "טכנולוגיה"], platform: "Instagram", followers: 37000, engagementRate: 4.0, location: "אילת", price: 3300 },
  { id: "29", name: "רוני חכים", niches: ["רכב"], platform: "Instagram", followers: 39000, engagementRate: 4.7, location: "אשדוד", price: 4000 },
  { id: "30", name: "הדר כהן", niches: ["עסקים"], platform: "Instagram", followers: 40000, engagementRate: 3.8, location: "הרצליה", price: 3400 },
  { id: "31", name: "אריאל דהן", niches: ["רכב", "טכנולוגיה"], platform: "Instagram", followers: 47000, engagementRate: 4.0, location: "הרצליה", price: 4000 },
  { id: "32", name: "אריאל אזולאי", niches: ["עסקים", "טכנולוגיה"], platform: "YouTube", followers: 34000, engagementRate: 4.9, location: "הרצליה", price: 3800 },
  { id: "33", name: "קרן רוזן", niches: ["ביוטי", "לייפסטייל"], platform: "TikTok", followers: 43000, engagementRate: 4.1, location: "רמת גן", price: 4100 },
  { id: "34", name: "איתי שפירא", niches: ["אוכל", "תיירות"], platform: "Instagram", followers: 46000, engagementRate: 4.1, location: "באר שבע", price: 4200 },
  { id: "35", name: "רועי לוין", niches: ["אוכל"], platform: "TikTok", followers: 30000, engagementRate: 4.8, location: "חיפה", price: 3350 },
  { id: "36", name: "שני קפלן", niches: ["לייפסטייל"], platform: "Instagram", followers: 42000, engagementRate: 3.7, location: "רמת גן", price: 3900 },
  { id: "37", name: "אבי לוין", niches: ["כושר", "אוכל"], platform: "Instagram", followers: 61000, engagementRate: 4.1, location: "רמת גן", price: 6000 },
  { id: "38", name: "רוני פרידמן", niches: ["אופנה", "ביוטי"], platform: "Instagram", followers: 75000, engagementRate: 3.7, location: "רמת גן", price: 7900 },
  { id: "39", name: "נועם עמר", niches: ["אופנה", "ביוטי"], platform: "TikTok", followers: 61000, engagementRate: 4.2, location: "פתח תקווה", price: 4950 },
  { id: "40", name: "אופיר לוי", niches: ["לייפסטייל"], platform: "YouTube", followers: 59000, engagementRate: 4.0, location: "באר שבע", price: 5200 },
  { id: "41", name: "הילה נחום", niches: ["טכנולוגיה", "עסקים"], platform: "Instagram", followers: 58000, engagementRate: 3.9, location: "אילת", price: 6200 },
  { id: "42", name: "שירה ברק", niches: ["גיימינג"], platform: "YouTube", followers: 93000, engagementRate: 3.1, location: "ירושלים", price: 9350 },
  { id: "43", name: "שירה אבידן", niches: ["תיירות"], platform: "Instagram", followers: 66000, engagementRate: 4.1, location: "חולון", price: 5450 },
  { id: "44", name: "עומר מור", niches: ["לייפסטייל"], platform: "Instagram", followers: 52000, engagementRate: 4.4, location: "חיפה", price: 5900 },
  { id: "45", name: "אורין אליאס", niches: ["ביוטי", "לייפסטייל"], platform: "Instagram", followers: 73000, engagementRate: 3.8, location: "חולון", price: 7050 },
  { id: "46", name: "מאיה רוזן", niches: ["אוכל"], platform: "Instagram", followers: 215000, engagementRate: 2.5, location: "ראשון לציון", price: 11900 },
  { id: "47", name: "ליה ברק", niches: ["תיירות", "אוכל"], platform: "Instagram", followers: 375000, engagementRate: 2.4, location: "נתניה", price: 17350 },
  { id: "48", name: "ענבר שגיא", niches: ["רכב", "טכנולוגיה"], platform: "YouTube", followers: 155000, engagementRate: 3.6, location: "הרצליה", price: 9550 },
  { id: "49", name: "אלינור עמר", niches: ["ביוטי", "אופנה"], platform: "Instagram", followers: 190000, engagementRate: 3.2, location: "תל אביב", price: 13050 },
  { id: "50", name: "יעל דהן", niches: ["אוכל"], platform: "Instagram", followers: 380000, engagementRate: 2.3, location: "אילת", price: 17050 },
];

export const allCreators: Creator[] = raw.map((c, i) => ({
  ...c,
  avatar: initials(c.name),
  gradient: gradients[i % gradients.length],
}));

// === Matching Engine ===
export type CampaignInput = {
  business: string;
  goal: string;
  budget: number;
  location: string;
  platform: string;
  contentType: string;
};

// Maps user-selected business categories to allowed niches.
export const businessToNiches: Record<string, string[]> = {
  "מסעדה": ["אוכל"],
  "אופנה": ["אופנה", "לייפסטייל"],
  "כושר": ["כושר"],
  "ביוטי": ["ביוטי", "אופנה"],
  "אחר": [],
};

const nicheLabels: Record<string, string> = {
  "אופנה": "אופנה",
  "ביוטי": "ביוטי",
  "אוכל": "קולינריה",
  "כושר": "כושר",
  "לייפסטייל": "לייפסטייל",
  "טכנולוגיה": "טכנולוגיה",
  "גיימינג": "גיימינג",
  "תיירות": "תיירות",
  "רכב": "רכב",
  "עסקים": "עסקים",
};

// === Tier-based realism: validate price/engagement match follower count ===
type Tier = { minF: number; maxF: number; minP: number; maxP: number; minE: number; maxE: number };
const TIERS: Tier[] = [
  { minF: 0,      maxF: 5000,    minP: 300,  maxP: 800,   minE: 5.0, maxE: 9.0 },
  { minF: 5000,   maxF: 20000,   minP: 800,  maxP: 2500,  minE: 4.0, maxE: 7.0 },
  { minF: 20000,  maxF: 50000,   minP: 2000, maxP: 5000,  minE: 3.0, maxE: 6.0 },
  { minF: 50000,  maxF: 100000,  minP: 4000, maxP: 10000, minE: 2.5, maxE: 5.0 },
  { minF: 100000, maxF: Infinity, minP: 8000, maxP: Infinity, minE: 1.5, maxE: 4.0 },
];

function tierFor(followers: number): Tier {
  return TIERS.find((t) => followers >= t.minF && followers < t.maxF) ?? TIERS[TIERS.length - 1];
}

// Internal quality score 0..100: rewards realistic pricing + engagement + niche consistency.
function qualityScore(c: Creator): number {
  const t = tierFor(c.followers);
  let q = 60;
  // Pricing realism
  if (c.price >= t.minP && c.price <= t.maxP) q += 20;
  else {
    const off = c.price < t.minP ? (t.minP - c.price) / t.minP : (c.price - t.maxP) / Math.max(t.maxP, 1);
    q -= Math.min(25, off * 30);
  }
  // Engagement realism
  if (c.engagementRate >= t.minE && c.engagementRate <= t.maxE) q += 15;
  else {
    const off = c.engagementRate < t.minE ? t.minE - c.engagementRate : c.engagementRate - t.maxE;
    q -= Math.min(15, off * 4);
  }
  // Niche consistency: all niches must be in the allowed list
  const allValid = c.niches.every((n) => (ALLOWED_NICHES as readonly string[]).includes(n));
  if (allValid && c.niches.length > 0) q += 5;
  else q -= 10;
  return Math.max(0, Math.min(100, Math.round(q)));
}

function scoreCreator(c: Creator, campaign: CampaignInput) {
  let score = 0;
  const reasons: string[] = [];

  // Niche match — exact match dominates
  const targets = businessToNiches[campaign.business] ?? [];
  const overlap = c.niches.filter((n) => targets.includes(n)).length;
  if (overlap > 0) {
    score += overlap === c.niches.length ? 45 : 32;
    const matched = c.niches.find((n) => targets.includes(n)) ?? c.niches[0];
    reasons.push(`מומחה.ית בתחום ה${nicheLabels[matched] ?? matched} - בדיוק הקהל שלכם`);
  } else if (targets.length === 0) {
    score += 10;
  } else {
    score -= 15; // strongly penalize off-niche
  }

  // Platform
  if (c.platform === campaign.platform) {
    score += 12;
    reasons.push(`פעיל.ה במיוחד ב־${c.platform}`);
  }

  // Location
  if (campaign.location === "כל הארץ" || c.location === campaign.location) {
    score += 10;
    if (campaign.location !== "כל הארץ") reasons.push(`קהל מקומי ומחובר באזור ${c.location}`);
  } else {
    score += 3;
  }

  // Budget fit — symmetric realistic window
  const ratio = c.price / Math.max(campaign.budget, 1);
  if (ratio >= 0.7 && ratio <= 1.1) {
    score += 22;
    reasons.push(`מתאים בול לתקציב שלכם`);
  } else if (ratio >= 0.4 && ratio < 0.7) {
    score += 10;
  } else if (ratio > 1.1 && ratio <= 1.3) {
    score += 4;
  } else {
    score -= 18; // heavy penalty for far-off budget
  }

  // Engagement (goal-weighted)
  const engBoost = (campaign.goal || "").includes("מכירות") || (campaign.goal || "").includes("לקוחות") ? 2.0 : 1.2;
  score += c.engagementRate * engBoost;
  if (c.engagementRate >= 5) {
    reasons.push(`מעורבות גבוהה (${c.engagementRate}%) - קהל שמגיב`);
  }

  // Reach (goal-weighted)
  const reachBoost = (campaign.goal || "").includes("חשיפה") ? 1.0 : 0.35;
  score += Math.log10(Math.max(c.followers, 10)) * reachBoost * 4;
  if ((campaign.goal || "").includes("חשיפה") && c.followers >= 100000) {
    reasons.push(`חשיפה רחבה לקהל של ${formatFollowers(c.followers)} עוקבים`);
  }

  // Quality bonus — grounds the score in realism
  const q = qualityScore(c);
  score += (q - 60) * 0.15; // ±6 typical swing

  // Fillers
  if (reasons.length < 3) {
    const fillers = [
      `קהילה אותנטית של ${formatFollowers(c.followers)} עוקבים`,
      `התוכן שלו.ה מתאים מצוין ל${campaign.contentType || "פורמט שבחרתם"}`,
      `שיתופי פעולה מוצלחים עם מותגים דומים`,
      `אמון גבוה של הקהל בהמלצות שלו.ה`,
    ];
    for (const f of fillers) {
      if (reasons.length >= 3) break;
      if (!reasons.includes(f)) reasons.push(f);
    }
  }

  return { score, reasons: reasons.slice(0, 3), quality: q };
}

function toSuccessProbability(score: number, quality: number, rank: number) {
  // Cap by quality so weak creators can't show fake-high percentages.
  const base = Math.round(45 + score * 0.55);
  const qualityCap = Math.round(70 + (quality - 60) * 0.5); // quality 60 -> cap 70, 100 -> 90
  const capped = Math.min(base, qualityCap, 96);
  const jitter = ((rank * 7) % 3) - 1;
  return Math.max(60, Math.min(96, capped - rank + jitter));
}

export function matchCreators(
  campaign: CampaignInput,
  excludeIds: string[] = [],
  limit = 3
): ScoredCreator[] {
  const targets = businessToNiches[campaign.business] ?? [];
  const scored = allCreators
    .filter((c) => !excludeIds.includes(c.id))
    .filter((c) => targets.length === 0 || c.niches.some((n) => targets.includes(n)))
    .map((c) => ({ creator: c, ...scoreCreator(c, campaign) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored
    .map((s, i) => ({
      ...s.creator,
      followersLabel: formatFollowers(s.creator.followers),
      successProbability: toSuccessProbability(s.score, s.quality, i),
      reasons: s.reasons,
      score: s.score,
    }))
    .sort((a, b) => b.successProbability - a.successProbability);
}
