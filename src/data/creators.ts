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

// 20+ creators with realistic attributes
const raw: Omit<Creator, "avatar" | "gradient">[] = [
  { id: "1",  name: "נועה לוי",     niches: ["מסעדה", "אוכל"],          platform: "Instagram", followers: 82000,  engagementRate: 5.8, location: "תל אביב",     price: 1200 },
  { id: "2",  name: "איתי כהן",     niches: ["כושר", "לייפסטייל"],      platform: "Instagram", followers: 145000, engagementRate: 4.2, location: "תל אביב",     price: 2400 },
  { id: "3",  name: "שירה ברק",     niches: ["ביוטי", "אופנה"],         platform: "Instagram", followers: 58000,  engagementRate: 6.4, location: "הרצליה",      price: 950  },
  { id: "4",  name: "דניאל אבני",   niches: ["טכנולוגיה", "לייפסטייל"], platform: "Instagram", followers: 210000, engagementRate: 3.1, location: "תל אביב",     price: 3200 },
  { id: "5",  name: "תמר רוזן",     niches: ["משפחה", "לייפסטייל"],    platform: "Instagram", followers: 96000,  engagementRate: 5.5, location: "ראשון לציון", price: 1500 },
  { id: "6",  name: "יונתן פרץ",    niches: ["כושר", "ספורט"],          platform: "Instagram", followers: 120000, engagementRate: 4.8, location: "חיפה",        price: 1800 },
  { id: "7",  name: "עדן שפירא",   niches: ["אופנה", "לייפסטייל"],     platform: "Instagram", followers: 175000, engagementRate: 4.0, location: "תל אביב",     price: 2700 },
  { id: "8",  name: "רן מזרחי",     niches: ["מסעדה", "אוכל"],          platform: "Instagram", followers: 65000,  engagementRate: 6.0, location: "ירושלים",     price: 1100 },
  { id: "9",  name: "מאיה גולן",    niches: ["ביוטי"],                  platform: "Instagram", followers: 138000, engagementRate: 5.2, location: "תל אביב",     price: 2100 },
  { id: "10", name: "אופיר דהן",    niches: ["לייפסטייל", "נסיעות"],   platform: "Instagram", followers: 92000,  engagementRate: 4.5, location: "אילת",        price: 1400 },
  { id: "11", name: "ליאור נחום",   niches: ["כושר", "בריאות"],         platform: "Instagram", followers: 108000, engagementRate: 5.1, location: "פתח תקווה",   price: 1700 },
  { id: "12", name: "הילה אסולין", niches: ["עיצוב", "לייפסטייל"],     platform: "Instagram", followers: 73000,  engagementRate: 5.7, location: "רמת גן",      price: 1300 },
  { id: "13", name: "אורי שמש",    niches: ["אוכל", "מסעדה"],         platform: "TikTok",    followers: 220000, engagementRate: 7.2, location: "תל אביב",     price: 1900 },
  { id: "14", name: "ספיר חדד",    niches: ["אופנה", "ביוטי"],         platform: "Instagram", followers: 49000,  engagementRate: 7.8, location: "אשדוד",       price: 800  },
  { id: "15", name: "גיא לוין",    niches: ["טכנולוגיה"],              platform: "YouTube",   followers: 320000, engagementRate: 3.4, location: "תל אביב",     price: 3500 },
  { id: "16", name: "רוני אדרי",   niches: ["משפחה", "הורות"],        platform: "Instagram", followers: 87000,  engagementRate: 6.1, location: "באר שבע",     price: 1250 },
  { id: "17", name: "טל אבידן",    niches: ["כושר", "לייפסטייל"],      platform: "TikTok",    followers: 165000, engagementRate: 6.7, location: "תל אביב",     price: 2000 },
  { id: "18", name: "מיכל ברגר",   niches: ["ביוטי", "אופנה"],         platform: "Instagram", followers: 105000, engagementRate: 5.0, location: "נתניה",       price: 1650 },
  { id: "19", name: "יובל קפלן",   niches: ["נסיעות", "לייפסטייל"],   platform: "Instagram", followers: 198000, engagementRate: 4.3, location: "תל אביב",     price: 2800 },
  { id: "20", name: "נועם בר",     niches: ["אוכל", "לייפסטייל"],     platform: "Instagram", followers: 54000,  engagementRate: 6.9, location: "חיפה",        price: 900  },
  { id: "21", name: "אלינור מלכה", niches: ["ביוטי", "לייפסטייל"],     platform: "TikTok",    followers: 78000,  engagementRate: 8.1, location: "ראשון לציון", price: 1150 },
  { id: "22", name: "עומר שגיא",   niches: ["ספורט", "כושר"],          platform: "Instagram", followers: 142000, engagementRate: 4.6, location: "ירושלים",     price: 2200 },
  { id: "23", name: "דנה אליאס",   niches: ["עיצוב", "אופנה"],         platform: "Instagram", followers: 61000,  engagementRate: 6.3, location: "תל אביב",     price: 1050 },
  { id: "24", name: "אבי טסלר",    niches: ["טכנולוגיה", "גאדג'טים"], platform: "YouTube",   followers: 250000, engagementRate: 3.8, location: "הרצליה",      price: 3100 },
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

const businessToNiches: Record<string, string[]> = {
  "מסעדה": ["מסעדה", "אוכל"],
  "אופנה": ["אופנה", "לייפסטייל"],
  "כושר": ["כושר", "ספורט", "בריאות"],
  "ביוטי": ["ביוטי", "אופנה"],
  "אחר": ["לייפסטייל"],
};

function scoreCreator(c: Creator, campaign: CampaignInput) {
  let score = 0;
  const reasons: string[] = [];

  // Niche match
  const targets = businessToNiches[campaign.business] ?? [];
  const overlap = c.niches.filter((n) => targets.includes(n)).length;
  const nicheLabels: Record<string, string> = {
    "מסעדה": "מסעדנות",
    "אוכל": "קולינריה",
    "אופנה": "אופנה",
    "ביוטי": "ביוטי",
    "כושר": "כושר",
    "ספורט": "ספורט",
    "בריאות": "בריאות",
    "לייפסטייל": "לייפסטייל",
    "טכנולוגיה": "טכנולוגיה",
    "משפחה": "משפחה והורות",
    "הורות": "הורות",
    "נסיעות": "טיולים ונסיעות",
    "עיצוב": "עיצוב",
    "גאדג'טים": "גאדג'טים",
  };
  if (overlap > 0) {
    score += overlap === c.niches.length ? 40 : 30;
    const label = nicheLabels[c.niches[0]] ?? c.niches[0];
    reasons.push(`מומחה.ית בתחום ה${label} - בדיוק הקהל שלכם`);
  } else {
    score += 8;
  }

  // Platform match
  if (c.platform === campaign.platform) {
    score += 15;
    reasons.push(`פעיל.ה במיוחד ב־${c.platform}`);
  }

  // Location match
  if (campaign.location === "כל הארץ" || c.location === campaign.location) {
    score += 12;
    if (campaign.location !== "כל הארץ") {
      reasons.push(`קהל מקומי ומחובר באזור ${c.location}`);
    }
  } else {
    score += 4;
  }

  // Budget fit
  const budgetRatio = c.price / campaign.budget;
  if (budgetRatio <= 1) {
    score += 18 - Math.abs(1 - budgetRatio) * 8;
    if (budgetRatio <= 0.85) reasons.push(`מתאים בול לתקציב שלכם`);
  } else if (budgetRatio <= 1.2) {
    score += 6;
  } else {
    score -= 5;
  }

  // Engagement
  const goalEngagementBoost =
    campaign.goal === "יותר מכירות" || campaign.goal === "יותר לקוחות" ? 2.2 : 1.4;
  score += c.engagementRate * goalEngagementBoost;
  if (c.engagementRate >= 6) {
    reasons.push(`מעורבות גבוהה במיוחד (${c.engagementRate}%) - קהל שמגיב`);
  }

  // Reach
  const reachBoost = campaign.goal === "יותר חשיפה" ? 1 : 0.4;
  score += Math.log10(c.followers) * reachBoost * 4;
  if (campaign.goal === "יותר חשיפה" && c.followers >= 150000) {
    reasons.push(`חשיפה רחבה לקהל של ${formatFollowers(c.followers)} עוקבים`);
  }

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

  return { score, reasons: reasons.slice(0, 3) };
}

function toSuccessProbability(score: number, rank: number) {
  // Map score to a believable percentage and slightly decay by rank
  const base = Math.min(98, Math.max(72, Math.round(60 + score * 0.45)));
  const jitter = ((rank * 7) % 4) - 1;
  return Math.max(70, Math.min(98, base - rank + jitter));
}

export function matchCreators(
  campaign: CampaignInput,
  excludeIds: string[] = [],
  limit = 3
): ScoredCreator[] {
  const scored = allCreators
    .filter((c) => !excludeIds.includes(c.id))
    .map((c) => {
      const { score, reasons } = scoreCreator(c, campaign);
      return { creator: c, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s, i) => ({
    ...s.creator,
    followersLabel: formatFollowers(s.creator.followers),
    successProbability: toSuccessProbability(s.score, i),
    reasons: s.reasons,
    score: s.score,
  }));
}
