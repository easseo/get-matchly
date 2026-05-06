export type Creator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: string;
  price: number;
  successProbability: number;
  reasons: string[];
  avatar: string;
  gradient: string;
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

export const avatarFor = (name: string, idx: number) => ({
  initials: initials(name),
  gradient: gradients[idx % gradients.length],
});

export const allCreators: Creator[] = [
  {
    id: "1", name: "נועה לוי", niche: "אוכל וקולינריה", platform: "Instagram",
    followers: "82K", price: 1200, successProbability: 94,
    reasons: ["קהל יעד מקומי באיזור שלך", "אחוזי מעורבות גבוהים בתחום האוכל", "ניסיון מוכח עם מסעדות בוטיק"],
    avatar: "NL", gradient: gradients[0],
  },
  {
    id: "2", name: "איתי כהן", niche: "לייפסטייל וכושר", platform: "Instagram",
    followers: "145K", price: 2400, successProbability: 88,
    reasons: ["קהל גילאי 25-40 רלוונטי", "תוכן רילס ויראלי באופן עקבי", "המרה גבוהה בקמפיינים דומים"],
    avatar: "IK", gradient: gradients[1],
  },
  {
    id: "3", name: "שירה ברק", niche: "ביוטי ואופנה", platform: "Instagram",
    followers: "58K", price: 950, successProbability: 91,
    reasons: ["מומחית ביוטי עם קהילה מעורבת", "מתאימה לטון של המותג שלך", "מחיר אטרקטיבי לתקציב"],
    avatar: "SB", gradient: gradients[2],
  },
  {
    id: "4", name: "דניאל אבני", niche: "טכנולוגיה וגאדג'טים", platform: "Instagram",
    followers: "210K", price: 3200, successProbability: 86,
    reasons: ["חשיפה רחבה בקהל איכותי", "סטוריז עם CTA אפקטיבי", "אמון גבוה של העוקבים"],
    avatar: "DA", gradient: gradients[3],
  },
  {
    id: "5", name: "תמר רוזן", niche: "הורות ומשפחה", platform: "Instagram",
    followers: "96K", price: 1500, successProbability: 89,
    reasons: ["קהל אמהות רלוונטי לקמפיין", "סגנון אותנטי ומעורר אמון", "ביצועי קמפיין עבר חזקים"],
    avatar: "TR", gradient: gradients[4],
  },
  {
    id: "6", name: "יונתן פרץ", niche: "ספורט וחוץ", platform: "Instagram",
    followers: "120K", price: 1800, successProbability: 90,
    reasons: ["מתאים למיקום ולתחום", "רילס באיכות פרודקשן גבוהה", "המרות הוכחו במותגים דומים"],
    avatar: "YP", gradient: gradients[5],
  },
  {
    id: "7", name: "עדן שפירא", niche: "אופנה וסטייל", platform: "Instagram",
    followers: "175K", price: 2700, successProbability: 92,
    reasons: ["טרנדסטרית בתחום האופנה", "אסתטיקה תואמת למותג", "קהל קונה ופעיל"],
    avatar: "AS", gradient: gradients[0],
  },
  {
    id: "8", name: "רן מזרחי", niche: "אוכל ובישול", platform: "Instagram",
    followers: "65K", price: 1100, successProbability: 87,
    reasons: ["שף ויוצר תוכן קולינרי", "ביקורות מסעדות עם אימפקט", "יחס עלות תועלת מצוין"],
    avatar: "RM", gradient: gradients[1],
  },
  {
    id: "9", name: "מאיה גולן", niche: "ביוטי וטיפוח", platform: "Instagram",
    followers: "138K", price: 2100, successProbability: 93,
    reasons: ["מובילת דעה בתחום הביוטי", "אחוזי שמירה גבוהים בסטוריז", "המרות חזקות בקמפיינים אחרונים"],
    avatar: "MG", gradient: gradients[2],
  },
  {
    id: "10", name: "אופיר דהן", niche: "לייפסטייל ונסיעות", platform: "Instagram",
    followers: "92K", price: 1400, successProbability: 85,
    reasons: ["אסתטיקה פרימיום וייחודית", "קהל איכותי ופעיל", "מתאים לטון של הקמפיין"],
    avatar: "OD", gradient: gradients[3],
  },
  {
    id: "11", name: "ליאור נחום", niche: "כושר ובריאות", platform: "Instagram",
    followers: "108K", price: 1700, successProbability: 90,
    reasons: ["מאמן עם קהילה מעורבת", "תוכן חינוכי שמייצר אמון", "ביצועי המרה מעולים"],
    avatar: "LN", gradient: gradients[4],
  },
  {
    id: "12", name: "הילה אסולין", niche: "עיצוב ובית", platform: "Instagram",
    followers: "73K", price: 1300, successProbability: 88,
    reasons: ["אסתטיקה תואמת למותג", "קהל בעל כוח קנייה", "תוצאות יציבות בקמפיינים"],
    avatar: "HA", gradient: gradients[5],
  },
];

export function pickThree(exclude: string[] = []): Creator[] {
  const available = allCreators.filter((c) => !exclude.includes(c.id));
  const pool = available.length >= 3 ? available : allCreators;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).sort((a, b) => b.successProbability - a.successProbability);
}
