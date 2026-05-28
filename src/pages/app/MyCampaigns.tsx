import { Link } from "react-router-dom";
import { Plus, Search, Calendar, FileText, Megaphone, Trash2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader, StatusPill } from "@/components/app/KpiCard";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/supabase";

const coverImages: Record<string, string> = {
  "ביוטי":         "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
  "אופנה":         "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "אוכל ומסעדות":  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  "מסעדה":         "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  "כושר ובריאות":  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  "כושר":          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  "טכנולוגיה":     "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "טיולים":        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
  "גיימינג":       "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
  "בית ועיצוב":    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "חינוך":         "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
};

function getCoverImage(businessType: string) {
  return coverImages[businessType] ?? "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80";
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  draft:               { label: "טיוטה",         bg: "bg-gray-100",   text: "text-gray-500" },
  published:           { label: "פורסם",          bg: "bg-green-50",   text: "text-green-700" },
  receiving_proposals: { label: "מקבל הצעות",     bg: "bg-blue-50",    text: "text-blue-700" },
  creator_selected:    { label: "יוצר נבחר",      bg: "bg-purple-50",  text: "text-purple-700" },
  payment_pending:     { label: "ממתין לתשלום",   bg: "bg-orange-50",  text: "text-orange-700" },
  in_progress:         { label: "בביצוע",          bg: "bg-orange-50",  text: "text-orange-700" },
  completed:           { label: "הושלם",           bg: "bg-emerald-50", text: "text-emerald-700" },
  cancelled:           { label: "בוטל",            bg: "bg-red-50",     text: "text-red-500" },
};

const filterOptions = ["הכל", "פעיל", "טיוטה", "הסתיים"] as const;

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("הכל");
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, campaignId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("למחוק את הקמפיין? כל הנתונים הקשורים אליו יימחקו.")) return;

    setDeleting(campaignId);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      alert("יש להתחבר מחדש כדי למחוק קמפיין");
      setDeleting(null);
      return;
    }

    const { data: deleted, error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId)
      .eq("advertiser_id", session.user.id)
      .select("id");

    if (error) { alert(`שגיאה במחיקה: ${error.message}`); setDeleting(null); return; }
    if (!deleted || deleted.length === 0) { alert("המחיקה נכשלה — אין הרשאה"); setDeleting(null); return; }

    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    setDeleting(null);
    const t = document.createElement("div");
    t.textContent = "✓ הקמפיין נמחק בהצלחה";
    t.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:12px 24px;border-radius:12px;font-weight:bold;z-index:9999;font-size:14px;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const userId = session?.user?.id;
      if (!userId) { setLoading(false); return; }
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("advertiser_id", userId)
        .order("created_at", { ascending: false });
      setCampaigns((data as Campaign[]) ?? []);
      setLoading(false);
    });
  }, []);

  const list = campaigns.filter((c) => {
    const matchesQ = q === "" || c.title.includes(q) || c.business_name.includes(q);
    if (filter === "הכל") return matchesQ;
    if (filter === "פעיל") return matchesQ && (c.status === "published" || c.status === "receiving_proposals" || c.status === "in_progress");
    if (filter === "טיוטה") return matchesQ && c.status === "draft";
    if (filter === "הסתיים") return matchesQ && (c.status === "completed" || c.status === "cancelled");
    return matchesQ;
  });

  return (
    <>
      <PageHeader
        title="הקמפיינים שלי"
        subtitle="נהלו את כל הקמפיינים במקום אחד"
        action={
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Plus className="w-4 h-4" /> קמפיין חדש
          </Link>
        }
      />

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם קמפיין או עסק..."
            className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => {
            const st = statusConfig[c.status] ?? { label: c.status, bg: "bg-gray-100", text: "text-gray-500" };
            return (
              <div key={c.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group flex flex-col">
                {/* Image */}
                <div className="relative h-36 overflow-hidden shrink-0">
                  <img
                    src={getCoverImage(c.business_type)}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                  {/* Status */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.bg} ${st.text} border-current/20`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    disabled={deleting === c.id}
                    className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={11} className="text-white" />
                  </button>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-white font-extrabold text-base leading-tight drop-shadow-md">{c.business_name}</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[10px] font-bold text-white/80 bg-black/30 px-2 py-0.5 rounded-full">{c.business_type}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-gray-900 mb-2.5 line-clamp-2 leading-snug">{c.title}</h3>

                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <div className="bg-gray-50 rounded-xl px-2.5 py-1.5">
                      <div className="text-[10px] text-gray-400 font-semibold mb-0.5">תקציב</div>
                      <div className="font-extrabold text-gray-900 text-[11px]">
                        ₪{c.budget_min.toLocaleString()}–₪{c.budget_max.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-2.5 py-1.5">
                      <div className="text-[10px] text-gray-400 font-semibold mb-0.5 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> דדליין
                      </div>
                      <div className="font-extrabold text-gray-900 text-[11px]">
                        {c.deadline ? new Date(c.deadline).toLocaleDateString("he-IL") : "ללא"}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-2.5 border-t border-gray-100">
                    <Link
                      to={`/app/campaigns/${c.id}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> צפה בהתאמות
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {list.length === 0 && !loading && (
            <div className="col-span-full text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Megaphone className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-semibold text-sm mb-1">
                {q ? `לא נמצאו קמפיינים עבור "${q}"` : "לא נמצאו קמפיינים"}
              </p>
              <p className="text-gray-400 text-xs mb-4">
                {filter !== "הכל" ? `נסו לשנות את הפילטר` : "צרו קמפיין ראשון"}
              </p>
              <Link to="/app/create" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm" style={{ background: "var(--gradient-brand)" }}>
                <Plus className="w-4 h-4" /> צור קמפיין ראשון
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
