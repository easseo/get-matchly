import { Link, useNavigate } from "react-router-dom";
import { Megaphone, FileText, CheckCircle2, Plus, ArrowLeft, Calendar, Target, Trash2, Eye, Loader2 } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/supabase";
import { useState, useEffect } from "react";

const statusLabel: Record<string, string> = {
  draft: "טיוטה",
  published: "פורסם",
  receiving_proposals: "מקבל הצעות",
  creator_selected: "יוצר נבחר",
  payment_pending: "ממתין לתשלום",
  in_progress: "בביצוע",
  completed: "הושלם",
  cancelled: "בוטל",
};

const statusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-500",
  published: "bg-green-50 text-green-700",
  receiving_proposals: "bg-blue-50 text-blue-700",
  in_progress: "bg-orange-50 text-orange-700",
  completed: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-500",
};

type CampaignWithCount = Campaign & { proposal_count?: number };

export default function AdvertiserDashboard() {
  const { user } = useDemoAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user?.id) { setLoading(false); return; }
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("advertiser_id", session.user.id)
        .order("created_at", { ascending: false });
      setCampaigns((data as CampaignWithCount[]) ?? []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (e: React.MouseEvent, campaignId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("למחוק את הקמפיין? כל הנתונים הקשורים אליו יימחקו.")) return;
    setDeleting(campaignId);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: deleted, error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId)
      .eq("advertiser_id", session?.user?.id ?? "")
      .select("id");
    if (error || !deleted?.length) {
      alert(error ? `שגיאה: ${error.message}` : "המחיקה נכשלה — אין הרשאה");
      setDeleting(null);
      return;
    }
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    setDeleting(null);
  };

  const active = campaigns.filter(c => c.status === "receiving_proposals" || c.status === "in_progress" || c.status === "published");
  const completed = campaigns.filter(c => c.status === "completed").length;

  return (
    <>
      <PageHeader
        title={`שלום, ${user?.fullName?.split(" ")[0] || "מפרסם"} 👋`}
        subtitle="נהלו את הקמפיינים שלכם ופתחו הזדמנויות חדשות"
        action={
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Plus className="w-4 h-4" /> קמפיין חדש
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard label="קמפיינים פעילים" value={active.length} icon={Megaphone} tone="pink" hint="פועלים כרגע" />
        <KpiCard label="סך קמפיינים" value={campaigns.length} icon={FileText} tone="violet" hint="שנוצרו" />
        <KpiCard label="הושלמו" value={completed} icon={CheckCircle2} tone="emerald" hint="קמפיינים" />
      </div>

      {/* My Campaigns */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">הקמפיינים שלי</h2>
            <p className="text-xs text-gray-400 mt-0.5">כל הקמפיינים שיצרת</p>
          </div>
          <Link
            to="/app/campaigns"
            className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            לכולם <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-7 h-7 text-purple-300" />
            </div>
            <p className="font-extrabold text-gray-700 mb-1">אין קמפיינים עדיין</p>
            <p className="text-sm text-gray-400 mb-5">צור קמפיין ראשון וקבל הצעות מיוצרי תוכן</p>
            <Link
              to="/app/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Plus className="w-4 h-4" /> צור קמפיין ראשון
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/app/campaigns/${c.id}`)}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)", opacity: 0.85 }}>
                  <Megaphone className="w-5 h-5 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm text-gray-900 truncate">{c.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />{c.goal}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-gray-600">
                      ₪{c.budget_min.toLocaleString()}–₪{c.budget_max.toLocaleString()}
                    </span>
                    {c.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{new Date(c.deadline).toLocaleDateString("he-IL")}
                      </span>
                    )}
                    <span className="text-gray-300">{new Date(c.created_at).toLocaleDateString("he-IL")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/app/campaigns/${c.id}`}
                    onClick={e => e.stopPropagation()}
                    className="p-2 rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="צפה בקמפיין"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    disabled={deleting === c.id}
                    className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="מחק קמפיין"
                  >
                    {deleting === c.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            ))}

            {campaigns.length > 5 && (
              <Link
                to="/app/campaigns"
                className="block text-center text-xs font-bold text-primary py-2 hover:underline"
              >
                הצג עוד {campaigns.length - 5} קמפיינים
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
