import { TrendingUp, Clock, DollarSign, ArrowLeft, Heart, Instagram, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "קמפיינים פעילים", value: "6", sub: "בהתקדמות", icon: TrendingUp, bg: "bg-orange-50", iconColor: "text-orange-400", border: "border-orange-100" },
  { label: "הצעות ממתינות", value: "10", sub: "ממתינות לאישור", icon: Clock, bg: "bg-blue-50", iconColor: "text-blue-400", border: "border-blue-100" },
  { label: "סה\"כ הכנסות", value: "₪468", sub: "הכנסות כוללות", icon: DollarSign, bg: "bg-purple-50", iconColor: "text-purple-400", border: "border-purple-100" },
];

const activeCampaigns = [
  { name: "קולקציית אופנה קיץ 2026", brand: "StyleCo", deadline: "20 מרץ 2026", budget: "₪800", status: "בתהליך" },
];

const pendingProposals = [
  { name: "Tech Gadget Review Series", brand: "TechNova", deadline: "20 מרץ 2026" },
  { name: "Fitness App Launch Campaign", brand: "TechNova", deadline: "20 מרץ 2026" },
];

const recommended = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop",
    category: "ביוטי", categoryColor: "text-purple-500 bg-purple-50",
    name: "מוצרי יופי בר-קיימא", brand: "EcoGlow", brandColor: "text-purple-500",
    description: "קידום קו מוצרי הביוטי הירוק שלנו",
    deadline: "30 מרץ 2026", budget: "₪1,200 - ₪1,800", featured: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=200&fit=crop",
    category: "טיולים", categoryColor: "text-blue-500 bg-blue-50",
    name: "קידום ציוד טיולים", brand: "Wanderlust Co", brandColor: "text-blue-500",
    description: "סקירת ציוד הטיולים העדכני שלנו",
    deadline: "30 מרץ 2026", budget: "₪1,200 - ₪1,800", featured: false,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop",
    category: "גיימינג", categoryColor: "text-green-500 bg-green-50",
    name: "השקת אביזרי גיימינג", brand: "GamePro", brandColor: "text-green-500",
    description: "יצירת תוכן עם הפריפריה שלנו",
    deadline: "30 מרץ 2026", budget: "₪1,200 - ₪1,800", featured: false,
  },
];

export default function OverviewPage() {
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">ברוכים השבים!</h1>
        <p className="text-sm text-gray-500 mt-1">הנה מה שקורה עם הקמפיינים שלכם</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between ${s.border}`}>
            <div>
              <div className="text-3xl font-black text-gray-900">{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={20} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Active Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-gray-900 text-base">קמפיינים פעילים</h2>
          <Link to="/creator/proposals" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            הצג הכל <ArrowLeft size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {activeCampaigns.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">{c.brand}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                  <Calendar size={12} />
                  <span>עד: {c.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xl font-black text-gray-900">{c.budget}</div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Proposals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-gray-900 text-base">הצעות ממתינות</h2>
          <Link to="/creator/proposals" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            הצג הכל <ArrowLeft size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {pendingProposals.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-gray-900 text-sm leading-tight flex-1 ml-2">{p.name}</div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100 shrink-0">ממתין</span>
              </div>
              <div className="text-xs text-gray-500">{p.brand}</div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Calendar size={11} />
                <span>עד: {p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-gray-900 text-base">קמפיינים מומלצים</h2>
          <Link to="/creator/browse" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            הצג הכל <ArrowLeft size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {recommended.map((c, i) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${c.featured ? "border-primary/30 ring-1 ring-primary/20" : "border-gray-100"}`}
            >
              <div className="relative h-36 overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <button className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                  <Heart size={13} className="text-gray-400" />
                </button>
                <div className="absolute bottom-2 left-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
                  <Instagram size={14} className="text-white" />
                </div>
              </div>
              <div className="p-3">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.categoryColor}`}>{c.category}</span>
                <div className="font-bold text-gray-900 text-sm leading-tight mt-1.5 mb-0.5">{c.name}</div>
                <div className={`text-xs font-semibold mb-1 ${c.brandColor}`}>{c.brand}</div>
                <div className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-1">{c.description}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <Calendar size={11} />
                  <span>עד: {c.deadline}</span>
                  <span className="mr-auto font-bold text-gray-700 text-[11px]">{c.budget}</span>
                </div>
                <Link
                  to={`/creator/campaigns/${c.id}`}
                  className={`block w-full py-2 rounded-xl text-xs font-bold text-center transition-all ${
                    i === 0 ? "text-white" : "text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  }`}
                  style={i === 0 ? { background: "var(--gradient-brand)" } : {}}
                >
                  צפה בפרטים
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
