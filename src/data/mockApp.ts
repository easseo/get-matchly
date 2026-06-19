// Mock data powering the dashboard experience (demo mode).

export type AppRole = "advertiser" | "creator";

export type CampaignStatus = "פעיל" | "טיוטה" | "הסתיים" | "ממתין";

export type AppCampaign = {
  id: string;
  title: string;
  brand: string;
  category: string;
  platform: string;
  budgetRange: string;
  deadline: string;
  status: CampaignStatus;
  proposals: number;
  views: number;
  cover: string; // gradient class (fallback)
  coverImage: string; // real photo URL
  description: string;
  contentFormat: string[]; // e.g. ["ריל", "סטורי", "פוסט"]
};

export type Proposal = {
  id: string;
  campaignTitle: string;
  brand: string;
  creatorName: string;
  creatorHandle: string;
  followers: string;
  engagement: string;
  price: number;
  status: "ממתין" | "אושר" | "נדחה";
  submittedAt: string;
  message: string;
  gradient: string;
  avatar: string;
};

export type Payment = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: "הושלם" | "ממתין";
};

export type ReviewItem = {
  id: string;
  from: string;
  campaign: string;
  rating: number;
  date: string;
  text: string;
  gradient: string;
  avatar: string;
};

const gradients = [
  "from-pink-500 via-rose-500 to-orange-400",
  "from-fuchsia-500 via-pink-500 to-yellow-400",
  "from-purple-500 via-pink-500 to-orange-500",
  "from-orange-400 via-pink-500 to-purple-600",
  "from-yellow-400 via-orange-500 to-pink-600",
  "from-violet-500 via-fuchsia-500 to-pink-500",
];

const covers = [
  "bg-gradient-to-br from-pink-300 via-rose-400 to-orange-300",
  "bg-gradient-to-br from-purple-300 via-fuchsia-400 to-pink-300",
  "bg-gradient-to-br from-amber-300 via-orange-400 to-rose-400",
  "bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-400",
  "bg-gradient-to-br from-indigo-300 via-violet-400 to-fuchsia-400",
];

export const mockCampaigns: AppCampaign[] = [
  {
    id: "c1",
    title: "השקת קולקציית קיץ אקולוגית",
    brand: "EcoStyle",
    category: "אופנה",
    platform: "Instagram",
    budgetRange: "₪500 - ₪1,200",
    deadline: "25 ביוני 2026",
    status: "פעיל",
    proposals: 12,
    views: 1840,
    cover: covers[0],
    coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    description: "אנחנו מחפשים יוצרי תוכן בתחום האופנה והלייפסטייל להציג את הקולקציה החדשה שלנו.",
    contentFormat: ["ריל", "פוסט"],
  },
  {
    id: "c2",
    title: "ביקורת מוצרי טיפוח טבעיים",
    brand: "PureGlow",
    category: "ביוטי",
    platform: "Instagram",
    budgetRange: "₪800 - ₪1,500",
    deadline: "10 ביולי 2026",
    status: "פעיל",
    proposals: 7,
    views: 920,
    cover: covers[1],
    coverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    description: "סדרת ביקורות אותנטיות על מוצרי הטיפוח הטבעיים שלנו עם דגש על מרכיבים פעילים.",
    contentFormat: ["סטורי", "ריל"],
  },
  {
    id: "c3",
    title: "קמפיין מודעות מותג אורגני",
    brand: "FarmFresh",
    category: "אוכל",
    platform: "Instagram",
    budgetRange: "₪1,000 - ₪2,000",
    deadline: "1 באוגוסט 2026",
    status: "ממתין",
    proposals: 4,
    views: 540,
    cover: covers[2],
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    description: "מותג מזון אורגני חדש מחפש יוצרים בעלי קהל מחויב לאורח חיים בריא.",
    contentFormat: ["פוסט", "סטורי"],
  },
  {
    id: "c4",
    title: "הפצת אפליקציית כושר",
    brand: "FitLab",
    category: "כושר",
    platform: "Instagram",
    budgetRange: "₪600 - ₪1,000",
    deadline: "18 ביולי 2026",
    status: "פעיל",
    proposals: 9,
    views: 1320,
    cover: covers[3],
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    description: "אפליקציית כושר חדשה מחפשת יוצרי תוכן בתחום הספורט והבריאות לקמפיין השקה.",
    contentFormat: ["ריל"],
  },
  {
    id: "c5",
    title: "פתיחת בית קפה ברמת גן",
    brand: "Café Aroma",
    category: "מסעדה",
    platform: "Instagram",
    budgetRange: "₪400 - ₪800",
    deadline: "5 ביולי 2026",
    status: "הסתיים",
    proposals: 15,
    views: 2410,
    cover: covers[4],
    coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    description: "בית קפה חדש שמחפש יוצרי תוכן קולינריים להפקת פוסטים וסטוריז של פתיחה.",
    contentFormat: ["פוסט", "סטורי"],
  },
];

export const mockProposals: Proposal[] = [
  {
    id: "p1",
    campaignTitle: "השקת קולקציית קיץ אקולוגית",
    brand: "EcoStyle",
    creatorName: "שרה יונסון",
    creatorHandle: "@sarah_style",
    followers: "82K",
    engagement: "5.8%",
    price: 950,
    status: "ממתין",
    submittedAt: "לפני יומיים",
    message: "היי! התוכן שלכם מתאים בול לקהל שלי. אשמח להציג את הקולקציה ברילס וסטוריז.",
    gradient: gradients[0],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: "p2",
    campaignTitle: "השקת קולקציית קיץ אקולוגית",
    brand: "EcoStyle",
    creatorName: "מיכל חן",
    creatorHandle: "@michalc",
    followers: "23K",
    engagement: "7.2%",
    price: 720,
    status: "אושר",
    submittedAt: "לפני 3 ימים",
    message: "מומחית באופנה בת קיימא, אשמח לשתף פעולה עם דגש על אקולוגיה.",
    gradient: gradients[1],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: "p3",
    campaignTitle: "הפצת אפליקציית כושר",
    brand: "FitLab",
    creatorName: "אמה רודריגז",
    creatorHandle: "@emma_fit",
    followers: "145K",
    engagement: "4.2%",
    price: 1100,
    status: "ממתין",
    submittedAt: "לפני יום",
    message: "אני מאמנת כושר עם קהל מחויב. נשמח להציע סדרת רילסים של אימונים עם האפליקציה.",
    gradient: gradients[2],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  },
  {
    id: "p4",
    campaignTitle: "ביקורת מוצרי טיפוח טבעיים",
    brand: "PureGlow",
    creatorName: "נועה לוי",
    creatorHandle: "@noa.skin",
    followers: "58K",
    engagement: "6.4%",
    price: 880,
    status: "ממתין",
    submittedAt: "לפני 5 שעות",
    message: "מתמחה בביקורות סקין-קר אותנטיות. תוכלו לסמוך על חוות דעת כנה ומקצועית.",
    gradient: gradients[3],
    avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&q=80",
  },
  {
    id: "p5",
    campaignTitle: "פתיחת בית קפה ברמת גן",
    brand: "Café Aroma",
    creatorName: "רון מזרחי",
    creatorHandle: "@ron.eats",
    followers: "65K",
    engagement: "6.0%",
    price: 600,
    status: "נדחה",
    submittedAt: "לפני שבוע",
    message: "כותב קולינרי, אעלה רילס + 3 סטוריז על חוויית הבית קפה.",
    gradient: gradients[4],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
];

export const mockPayments: Payment[] = [
  { id: "pay1", title: "קמפיין השקת בית קפה", date: "12 במרץ 2026", amount: 350, status: "הושלם" },
  { id: "pay2", title: "קמפיין אפליקציית כושר", date: "15 במרץ 2026", amount: 350, status: "ממתין" },
  { id: "pay3", title: "ביקורת גאדג'ט טכנולוגי", date: "5 במרץ 2026", amount: 350, status: "הושלם" },
  { id: "pay4", title: "קמפיין משלוחי מזון", date: "25 בפברואר 2026", amount: 350, status: "הושלם" },
];

export const mockReviews: ReviewItem[] = [
  {
    id: "r1",
    from: "FitLife App",
    campaign: "קמפיין כושר",
    rating: 5,
    date: "10 בנובמבר 2025",
    text: "עבודה יוצאת מן הכלל! התוכן באינסטגרם היה יצירתי, איכותי והגיע לפני הזמן. אחוז המעורבות עלה על הציפיות שלנו. ממליצים בחום!",
    gradient: gradients[0],
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
  },
  {
    id: "r2",
    from: "EcoStyle",
    campaign: "השקת קולקציית קיץ",
    rating: 5,
    date: "2 בנובמבר 2025",
    text: "שיתוף פעולה מקצועי ומדוייק. הקריאייטיב היה מרענן ושירת בדיוק את המסר של המותג.",
    gradient: gradients[1],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    id: "r3",
    from: "Café Aroma",
    campaign: "פתיחת בית קפה",
    rating: 4,
    date: "25 באוקטובר 2025",
    text: "תוכן נחמד, התקבל היטב על ידי הקהל. נשמח לעבוד שוב בעתיד.",
    gradient: gradients[2],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
];
