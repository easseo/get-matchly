import { Link, useNavigate } from "react-router-dom";
import { Megaphone, FileText, CheckCircle2, Plus, ArrowLeft, Calendar, Target, Trash2, Eye, Loader2, Sparkles, ChevronLeft } from "lucide-react";
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
  const receiving = campaigns.filter(c => c.status === "receiving_proposals");
  const completed = campaigns.filter(c => c.status === "completed").length;

  // Determine next action
  const nextAction = (() => {
    if (campaigns.length === 0) return null;
    if (receiving.length > 0) return { type: "proposals", campaign: receiving[0] };
    if (active.length > 0) return { type: "active", campaign: active[0] };
    return null;
  })();

  return (
    <>
      <PageHeader
        title={`שלום, ${user?.fullName?.split(" ")[0] || "מפרסם"}`}
        subtitle="נהלו את הקמפיינים שלכם ופתחו הזדמנויות חדשות"
        action={
          <Link
            to="/app/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Plus className="w-4 h-4" /> קמפיין חדש
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KpiCard label="פעילים" value={active.length} icon={Megaphone} tone="pink" hint="קמפיינים" />
        <KpiCard label="סה״כ" value={campaigns.length} icon={FileText} tone="violet" hint="קמפיינים" />
        <KpiCard label="הושלמו" value={completed} icon={CheckCircle2} tone="emerald" hint="קמפיינים" />
      </div>

      {/* Next Action Banner */}
      {!loading && (
        <div className="mb-5">
          {campaigns.length === 0 ? (
            <div className="rounded-3xl p-5 flex items-center gap-4" style={{ background: "var(--gradient-brand)" }}>
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white text-sm">צרו קמפיין חדש וקבלו התאמות</p>
                <p className="text-white/75 text-xs mt-0.5">AI ימצא לכם את יוצרי התוכן המתאימים ביותר</p>
              </div>
              <Link
                to="/app/create"
                className="shrink-0 bg-white rounded-xl px-4 py-2 text-xs font-extrabold"
                style={{ color: "hsl(322, 85%, 58%)" }}
              >
                התחילו
              </Link>
            </div>
          ) : nextAction?.type === "proposals" ? (
            <div className="rounded-3xl p-5 bg-blue-50 border border-blue-100 flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-blue-900 text-sm">יש קמפיינים שמקבלים הצעות</p>
                <p className="text-blue-600 text-xs mt-0.5 truncate">{nextAction.campaign.title}</p>
              </div>
              <Link
                to={`/app/campaigns/${nextAction.campaign.id}`}
                className="shrink-0 bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-extrabold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                צפה בהתאמות <ChevronLeft className="w-3 h-3" />
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {/* My Campaigns */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">הקמפיינים שלי</h2>
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
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-6 h-6 text-purple-300" />
            </div>
            <p className="font-extrabold text-gray-700 mb-1 text-sm">אין קמפיינים עדיין</p>
            <p className="text-xs text-gray-400 mb-4">צור קמפיין ראשון וקבל הצעות מיוצרי תוכן</p>
            <Link
              to="/app/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Plus className="w-4 h-4" /> צור קמפיין ראשון
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {campaigns.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/app/campaigns/${c.id}`)}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)", opacity: 0.85 }}>
                  <Megaphone className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-sm text-gray-900 truncate">{c.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {statusLabel[c.status] ?? c.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Target className="w-2.5 h-2.5" />{c.goal}
                    </span>
                    <span className="font-semibold text-gray-600">
                      ₪{c.budget_min.toLocaleString()}–₪{c.budget_max.toLocaleString()}
                    </span>
                    {c.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />{new Date(c.deadline).toLocaleDateString("he-IL")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to={`/app/campaigns/${c.id}`}
                    onClick={e => e.stopPropagation()}
                    className="p-2 rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="צפה בקמפיין"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    disabled={deleting === c.id}
                    className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="מחק קמפיין"
                  >
                    {deleting === c.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
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
