import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Calendar, Wallet, Send, X, Check, ChevronLeft,
  Clock, Eye, Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/app/KpiCard";
import { mockCampaigns, type AppCampaign } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

const categories = ["הכל", "אופנה", "ביוטי", "כושר", "אוכל", "מסעדה"];

const deliveryOptions = ["3 ימים", "5 ימים", "שבוע", "שבועיים"];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  "פעיל":  { label: "פעיל",  bg: "bg-emerald-50", text: "text-emerald-700" },
  "ממתין": { label: "ממתין", bg: "bg-orange-50",  text: "text-orange-700" },
  "נסגר":  { label: "נסגר",  bg: "bg-gray-100",   text: "text-gray-500" },
  "הסתיים":{ label: "נסגר",  bg: "bg-gray-100",   text: "text-gray-500" },
};

// ──────────────── Proposal Modal ────────────────
function ProposalModal({
  campaign,
  onClose,
  onSubmit,
}: {
  campaign: AppCampaign;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [delivery, setDelivery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = price && message.trim().length > 10 && deliverables.trim() && delivery;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const handleDone = () => {
    onSubmit();
    onClose();
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
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src={campaign.coverImage} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{campaign.title}</p>
              <p className="text-[11px] text-gray-400">{campaign.brand} · {campaign.budgetRange}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          /* Success state */
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
              onClick={handleDone}
              className="px-8 py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              לעמוד ההצעות שלי
            </button>
          </div>
        ) : (
          /* Form */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">מחיר מוצע</label>
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
          </div>
        )}

        {/* Submit bar */}
        {!submitted && (
          <div className="px-5 py-4 border-t border-gray-100 shrink-0 safe-bottom">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              style={{ background: "var(--gradient-brand)" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
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
  const [cat, setCat] = useState("הכל");
  const [q, setQ] = useState("");
  const [modalCampaign, setModalCampaign] = useState<AppCampaign | null>(null);

  const list = mockCampaigns.filter(
    (c) =>
      c.status !== "הסתיים" &&
      (cat === "הכל" || c.category === cat) &&
      (q === "" || c.title.includes(q) || c.brand.includes(q))
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => {
          const st = statusConfig[c.status] ?? { label: c.status, bg: "bg-gray-100", text: "text-gray-500" };
          return (
            <div key={c.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group flex flex-col">
              {/* Image */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <img
                  src={c.coverImage}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                </div>

                {/* Status badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-current/20 ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 left-0 p-3">
                  <p className="font-extrabold text-white text-sm leading-tight line-clamp-2">{c.title}</p>
                  <p className="text-white/70 text-[11px] font-medium mt-0.5">{c.brand}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1 leading-relaxed">{c.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3.5">
                  <div className="bg-gray-50 rounded-xl px-2.5 py-2 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div>
                      <div className="text-[9px] text-gray-400 font-semibold">תקציב</div>
                      <div className="font-extrabold text-gray-900 text-[11px]">{c.budgetRange}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-2.5 py-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div>
                      <div className="text-[9px] text-gray-400 font-semibold">דדליין</div>
                      <div className="font-extrabold text-gray-900 text-[10px] line-clamp-1">{c.deadline}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalCampaign(c)}
                    className="flex-1 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity min-h-[44px]"
                    style={{ background: "var(--gradient-brand)" }}
                    disabled={c.status === "הסתיים" || c.status === "נסגר"}
                  >
                    <Send className="w-4 h-4" /> הגשת הצעה
                  </button>
                  <button className="w-11 h-11 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors shrink-0">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

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

      {/* Proposal Modal */}
      {modalCampaign && (
        <ProposalModal
          campaign={modalCampaign}
          onClose={() => setModalCampaign(null)}
          onSubmit={() => {
            setModalCampaign(null);
            navigate("/app/creator/proposals");
          }}
        />
      )}
    </>
  );
}
