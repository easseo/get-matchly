import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search, Calendar, Send, X, Check,
  Eye, Briefcase, Info, Loader2, UserPlus,
} from "lucide-react";
import { PageHeader } from "@/components/app/KpiCard";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/supabase";
import { CREATOR_PRICING_KEY } from "@/pages/creator/PricingSetup";
import { useDemoAuth } from "@/hooks/useDemoAuth";

const ALL = "הכל";
const deliveryOptions = ["3 ימים", "5 ימים", "שבוע", "שבועיים"];

const FORMAT_TO_KEY: Record<string, string> = {
  "ריל": "reel",
  "סטורי": "story",
  "פוסט": "post",
};

const NICHE_IMAGES: Record<string, string> = {
  "ביוטי":          "photo-1596462502278-27bfdc403348",
  "אופנה":          "photo-1558769132-cb1aea458c5e",
  "אוכל ומסעדות":  "photo-1490645935967-10de6ba17061",
  "אוכל":           "photo-1490645935967-10de6ba17061",
  "כושר ובריאות":  "photo-1534438327276-14e5300c3a48",
  "כושר":           "photo-1534438327276-14e5300c3a48",
  "טכנולוגיה":     "photo-1518770660439-4636190af475",
  "תיירות":        "photo-1488646953014-85cb44e25828",
  "גיימינג":        "photo-1538481199705-c710c4e965fc",
  "בית ועיצוב":    "photo-1586023492125-27b2c045efd7",
  "חינוך":          "photo-1503676260728-1c00da094a0b",
};

const FALLBACK_PHOTOS = [
  "photo-1493723843671-1d655e66ac1c",
  "photo-1485955900006-10f4d324d411",
  "photo-1496181133206-80ce9b88a853",
];

function getCampaignPhoto(c: Campaign): string {
  if (NICHE_IMAGES[c.business_type]) return NICHE_IMAGES[c.business_type];
  const idx = c.id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % FALLBACK_PHOTOS.length;
  return FALLBACK_PHOTOS[idx];
}

function getFakeViews(c: Campaign): number {
  const seed = c.id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return 300 + (seed % 2500);
}

const NICHE_GRADIENT: Record<string, string> = {
  "ביוטי": "from-pink-400 to-purple-500",
  "אופנה": "from-blue-400 to-purple-500",
  "אוכל ומסעדות": "from-orange-400 to-red-500",
  "אוכל": "from-orange-400 to-red-500",
  "כושר ובריאות": "from-green-400 to-emerald-600",
  "כושר": "from-green-400 to-emerald-600",
  "טכנולוגיה": "from-sky-400 to-blue-600",
  "תיירות": "from-teal-400 to-cyan-600",
  "גיימינג": "from-violet-500 to-purple-700",
  "בית ועיצוב": "from-amber-400 to-orange-500",
  "חינוך": "from-blue-400 to-indigo-600",
};
function heroGradient(niche: string) {
  return NICHE_GRADIENT[niche] ?? "from-pink-500 to-purple-600";
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "demo-1", advertiser_id: "", title: "הפצת אפליקציית כושר", business_name: "FitLab",
    business_type: "כושר", goal: "הגדלת הורדות", description: "אפליקציית כושר חדשה מחפשת יוצרים לקמפיין השקה.",
    platform: "instagram", content_format: ["ריל"], content_count: 1,
    budget_min: 600, budget_max: 1000, target_location: "ישראל",
    deadline: "2026-07-18", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
  {
    id: "demo-2", advertiser_id: "", title: "ביקורת מוצרי טיפוח טבעיים", business_name: "PureGlow",
    business_type: "ביוטי", goal: "מודעות מותג", description: "סדרת ביקורות על מוצרי הטיפוח הטבעיים שלנו.",
    platform: "instagram", content_format: ["סטורי", "ריל"], content_count: 2,
    budget_min: 800, budget_max: 1500, target_location: "ישראל",
    deadline: "2026-07-10", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
  {
    id: "demo-3", advertiser_id: "", title: "השקת קולקציית קיץ אקולוגית", business_name: "EcoStyle",
    business_type: "אופנה", goal: "מכירות", description: "יוצרי לייפסטייל לקולקציה האקולוגית החדשה שלנו.",
    platform: "instagram", content_format: ["ריל", "פוסט"], content_count: 2,
    budget_min: 500, budget_max: 1200, target_location: "ישראל",
    deadline: "2026-06-25", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
  {
    id: "demo-4", advertiser_id: "", title: "קמפיין מזון אורגני", business_name: "FarmFresh",
    business_type: "אוכל", goal: "מודעות מותג", description: "מותג מזון אורגני מחפש יוצרים עם קהל בריאות.",
    platform: "instagram", content_format: ["פוסט", "סטורי"], content_count: 2,
    budget_min: 1000, budget_max: 2000, target_location: "ישראל",
    deadline: "2026-08-01", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
  {
    id: "demo-5", advertiser_id: "", title: "חוויית טיול מושלמת לאירופה", business_name: "WanderIL",
    business_type: "תיירות", goal: "הגדלת הזמנות", description: "סוכנות תיירות מחפשת יוצרי תוכן לחווית נסיעה.",
    platform: "instagram", content_format: ["ריל"], content_count: 1,
    budget_min: 1200, budget_max: 2500, target_location: "ישראל",
    deadline: "2026-08-15", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
  {
    id: "demo-6", advertiser_id: "", title: "עיצוב הבית החדש שלכם", business_name: "DecoHome",
    business_type: "בית ועיצוב", goal: "מכירות", description: "חנות עיצוב בית מחפשת יוצרים לתוכן אינטריאור.",
    platform: "instagram", content_format: ["פוסט", "ריל"], content_count: 2,
    budget_min: 700, budget_max: 1300, target_location: "ישראל",
    deadline: "2026-07-30", requirements: null, status: "receiving_proposals",
    created_at: "", updated_at: "",
  },
];

function getSuggestedPrice(contentFormat: string[], pricing: Record<string, string>): string {
  const total = contentFormat.reduce((sum, fmt) => {
    const key = FORMAT_TO_KEY[fmt];
    return sum + (key ? parseInt(pricing[key] || "0", 10) : 0);
  }, 0);
  return total > 0 ? String(total) : "";
}

// ──────────────── Proposal Modal ────────────────
function ProposalModal({
  campaign,
  onClose,
  onDone,
}: {
  campaign: Campaign;
  onClose: () => void;
  onDone: () => void;
}) {
  const { user: demoUser } = useDemoAuth();
  const isDemo = demoUser?.email === "guest@matchly.net";

  const savedPricing: Record<string, string> = (() => {
    try { return JSON.parse(localStorage.getItem(CREATOR_PRICING_KEY) || "{}"); } catch { return {}; }
  })();

  const formats = Array.isArray(campaign.content_format) ? campaign.content_format : [];
  const suggested = getSuggestedPrice(formats, savedPricing);
  const hasSavedPricing = Object.values(savedPricing).some(v => v && parseInt(v) > 0);

  const [price, setPrice] = useState(suggested);
  const [message, setMessage] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [delivery, setDelivery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = price && message.trim().length > 10 && deliverables.trim() && delivery;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError("יש להתחבר מחדש"); setLoading(false); return; }
      const { error: err } = await supabase.from("proposals").insert({
        campaign_id: campaign.id,
        creator_id: session.user.id,
        price: Number(price),
        message: `${message.trim()}\n\nתוצרים: ${deliverables.trim()}`,
        estimated_delivery: delivery,
        status: "pending",
      });
      setLoading(false);
      if (err) { setError(err.message); return; }
      setSubmitted(true);
    } catch (e) {
      setLoading(false);
      setError("שגיאה בשליחה, נסו שוב");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-extrabold text-gray-900 text-base">הגשת הצעה</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Campaign preview */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br ${heroGradient(campaign.business_type)}`} />
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{campaign.title}</p>
              <p className="text-[11px] text-gray-400">{campaign.business_name} · {campaign.business_type}</p>
            </div>
          </div>
        </div>

        {isDemo ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-brand)" }}>
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">כדי להגיש הצעה</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              יש ליצור חשבון יוצר תוכן חינמי<br />ולהתחיל להרוויח מקמפיינים.
            </p>
            <Link
              to="/auth?role=creator&mode=signup"
              className="px-8 py-3 rounded-2xl text-white font-bold text-sm inline-block"
              style={{ background: "var(--gradient-brand)" }}
              onClick={onClose}
            >
              יצירת חשבון חינמי
            </Link>
            <button onClick={onClose} className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              חזרה לדפדוף
            </button>
          </div>
        ) : submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg" style={{ background: "var(--gradient-brand)" }}>
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">ההצעה נשלחה בהצלחה!</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              המפרסם יקבל את ההצעה שלך ויחזור אליך בהקדם.
              <br />תוכלו לעקוב אחר הסטטוס בעמוד ההצעות שלי.
            </p>
            <button
              onClick={() => { onDone(); onClose(); }}
              className="px-8 py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              לעמוד ההצעות שלי
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600">מחיר מוצע</label>
                {hasSavedPricing && suggested && (
                  <span className="flex items-center gap-1 text-[10px] text-purple-600 font-semibold">
                    <Info className="w-3 h-3" />
                    לפי המחירון שלך
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₪</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="800"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-8 pl-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors"
                />
              </div>
              {hasSavedPricing && formats.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {formats.map(fmt => {
                    const key = FORMAT_TO_KEY[fmt];
                    const p = key ? parseInt(savedPricing[key] || "0", 10) : 0;
                    if (!p) return null;
                    return (
                      <span key={fmt} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                        {fmt}: ₪{p.toLocaleString()}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">הודעה למפרסם</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="ספרו איך תבצעו את שיתוף הפעולה ולמה אתם מתאימים"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Deliverables */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">מה כלול בהצעה</label>
              <textarea
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                rows={2}
                placeholder="לדוגמה: רילס × 1, סטורי × 2"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors resize-none"
              />
            </div>

            {/* Delivery time */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">זמן ביצוע</label>
              <div className="grid grid-cols-4 gap-2">
                {deliveryOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDelivery(opt)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      delivery === opt
                        ? "border-transparent text-white shadow-md"
                        : "border-gray-200 text-gray-600 hover:border-primary/30"
                    }`}
                    style={delivery === opt ? { background: "var(--gradient-brand)" } : undefined}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          </div>
        )}

        {!submitted && !isDemo && (
          <div className="px-5 py-4 border-t border-gray-100 shrink-0 safe-bottom">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              style={{ background: "var(--gradient-brand)" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "שולח..." : "שליחת הצעה"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────── Main Page ────────────────
export default function BrowseCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [categories, setCategories] = useState<string[]>([ALL]);
  const [cat, setCat] = useState(ALL);
  const [q, setQ] = useState("");
  const [modalCampaign, setModalCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("id, advertiser_id, title, business_name, business_type, goal, description, platform, content_format, content_count, budget_min, budget_max, target_location, deadline, requirements, status, created_at, updated_at")
        .eq("status", "receiving_proposals")
        .order("created_at", { ascending: false });
      const list = ((data as Campaign[]) ?? []);
      const final = list.length > 0 ? list : MOCK_CAMPAIGNS;
      setCampaigns(final);
      const niches = [...new Set(final.map(c => c.business_type).filter(Boolean))];
      setCategories([ALL, ...niches]);
      setLoadingCampaigns(false);
    })();
  }, []);

  const list = campaigns.filter(
    (c) =>
      (cat === ALL || c.business_type === cat) &&
      (q === "" || c.title.includes(q) || c.business_name.includes(q))
  );

  return (
    <>
      <PageHeader title="דפדוף בקמפיינים" subtitle="הזדמנויות פתוחות שמחכות לכם" />

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם קמפיין או מותג..."
            className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                cat === c ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loadingCampaigns ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
              onClick={() => setModalCampaign(c)}
            >
              {/* Image hero */}
              <div className="relative shrink-0 overflow-hidden" style={{ height: 190 }}>
                <img
                  src={`https://images.unsplash.com/${getCampaignPhoto(c)}?auto=format&fit=crop&w=600&q=80`}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Category badge — top right */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {c.business_type}
                  </span>
                </div>

                {/* Title + brand overlaid at bottom */}
                <div className="absolute bottom-0 right-0 left-0 px-4 pb-3.5 pt-8">
                  <p className="font-extrabold text-white text-[15px] leading-tight line-clamp-2 mb-0.5">
                    {c.title}
                  </p>
                  <p className="text-white/65 text-[12px] font-medium">{c.business_name}</p>
                </div>
              </div>

              {/* Budget + Views row */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{getFakeViews(c).toLocaleString()}</span>
                </div>
                <div className="font-extrabold text-gray-900 text-[14px]">
                  ₪{c.budget_min.toLocaleString()} - ₪{c.budget_max.toLocaleString()}
                </div>
              </div>

              {/* Format tags + action */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                  {c.content_format?.map(fmt => (
                    <span key={fmt} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-semibold">
                      {fmt}
                    </span>
                  ))}
                  {c.deadline && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-medium flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(c.deadline).toLocaleDateString("he-IL")}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setModalCampaign(c); }}
                  className="shrink-0 px-4 py-2 rounded-2xl text-white font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Send className="w-3 h-3" /> הגשת הצעה
                </button>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold text-sm mb-1">לא נמצאו קמפיינים</p>
              <p className="text-gray-400 text-xs">נסו לשנות את הפילטר או החיפוש</p>
            </div>
          )}
        </div>
      )}

      {modalCampaign && (
        <ProposalModal
          campaign={modalCampaign}
          onClose={() => setModalCampaign(null)}
          onDone={() => navigate("/app/creator/proposals")}
        />
      )}
    </>
  );
}
