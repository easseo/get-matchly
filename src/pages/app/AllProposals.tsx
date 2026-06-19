import { useState, useEffect } from "react";
import { Check, X, Instagram, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { FileText, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ProposalStatus } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

type ProposalRow = {
  id: string;
  campaign_id: string;
  creator_id: string;
  price: number;
  message: string;
  status: ProposalStatus;
  created_at: string;
  profiles: { full_name: string } | null;
  creator_profiles: {
    instagram_username: string | null;
    followers: number | null;
    engagement_rate: number | null;
  } | null;
  campaign_title: string;
};

const STATUS_LABEL: Record<ProposalStatus, string> = {
  pending:   "ממתין",
  accepted:  "אושר",
  rejected:  "נדחה",
  withdrawn: "בוטל",
};

const STATUS_STYLE: Record<ProposalStatus, string> = {
  pending:   "bg-orange-50 text-orange-600 border-orange-100",
  accepted:  "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected:  "bg-red-50 text-red-500 border-red-100",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const tabs = ["הכל", "ממתין", "אושר", "נדחה"] as const;
type Tab = typeof tabs[number];

const FILTER_TO_STATUS: Record<Tab, ProposalStatus | null> = {
  "הכל":  null,
  "ממתין": "pending",
  "אושר":  "accepted",
  "נדחה":  "rejected",
};

const creatorAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
];
function getAvatar(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return creatorAvatars[hash % creatorAvatars.length];
}

export default function AllProposals() {
  const [tab, setTab] = useState<Tab>("הכל");
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data: myCampaigns } = await supabase
        .from("campaigns")
        .select("id, title")
        .eq("advertiser_id", session.user.id);

      const campaignMap = Object.fromEntries((myCampaigns ?? []).map(c => [c.id, c.title as string]));
      const campaignIds = Object.keys(campaignMap);
      if (campaignIds.length === 0) { setLoading(false); return; }

      const { data } = await supabase
        .from("proposals")
        .select("id, campaign_id, creator_id, price, message, status, created_at, profiles(full_name), creator_profiles(instagram_username, followers, engagement_rate)")
        .in("campaign_id", campaignIds)
        .order("created_at", { ascending: false });

      const rows = (data ?? []) as Omit<ProposalRow, "campaign_title">[];
      setProposals(
        rows.map(p => ({
          ...p,
          campaign_title: campaignMap[p.campaign_id] ?? "",
        }))
      );
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: ProposalStatus) => {
    setUpdating(id);
    await supabase.from("proposals").update({ status }).eq("id", id);
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast({ title: status === "accepted" ? "ההצעה אושרה!" : "ההצעה נדחתה" });
    setUpdating(null);
  };

  const statusFilter = FILTER_TO_STATUS[tab];
  const filtered = statusFilter ? proposals.filter(p => p.status === statusFilter) : proposals;
  const totalValue = proposals.reduce((s, p) => s + p.price, 0);
  const pendingCount = proposals.filter(p => p.status === "pending").length;

  return (
    <>
      <PageHeader title="כל ההצעות" subtitle="הצעות שיוצרי תוכן הגישו לקמפיינים שלכם" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="סך ההצעות"  value={proposals.length}                                       icon={FileText}     tone="violet" />
        <KpiCard label="ממתינות"     value={pendingCount}                                            icon={Clock}        tone="amber" />
        <KpiCard label="אושרו"       value={proposals.filter(p => p.status === "accepted").length}  icon={CheckCircle2} tone="emerald" />
        <KpiCard label="ערך כולל"    value={`₪${totalValue.toLocaleString()}`}                      icon={DollarSign}   tone="pink" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-5 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t === "ממתין" && pendingCount > 0 && (
              <span className="mr-1.5 bg-orange-400 text-white rounded-full text-[9px] px-1.5 py-0.5 font-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-semibold">אין הצעות בקטגוריה זו</p>
            </div>
          )}
          {filtered.map(p => {
            const name = p.profiles?.full_name ?? "יוצר תוכן";
            const handle = p.creator_profiles?.instagram_username;
            const followers = p.creator_profiles?.followers;
            const engagement = p.creator_profiles?.engagement_rate;
            const style = STATUS_STYLE[p.status] ?? STATUS_STYLE.pending;

            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={getAvatar(p.creator_id)}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-extrabold text-gray-900 text-sm">{name}</div>
                        <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                          {handle && <><Instagram className="w-3 h-3" />@{handle} · </>}
                          {new Date(p.created_at).toLocaleDateString("he-IL")}
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${style}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-primary mt-1.5 bg-primary/5 px-2.5 py-1 rounded-full w-fit">
                      {p.campaign_title}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
                  {p.message}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2.5 pt-3 border-t border-gray-100">
                  <div className="flex gap-1.5 flex-wrap">
                    {followers != null && (
                      <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {followers >= 1000 ? `${(followers / 1000).toFixed(0)}K` : followers} עוקבים
                      </span>
                    )}
                    {engagement != null && (
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" /> {engagement}%
                      </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      ₪{p.price.toLocaleString()}
                    </span>
                  </div>
                  {p.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(p.id, "rejected")}
                        disabled={!!updating}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px] disabled:opacity-60"
                      >
                        <X className="w-3.5 h-3.5" /> דחייה
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, "accepted")}
                        disabled={!!updating}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity min-h-[44px] disabled:opacity-60"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        {updating === p.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Check className="w-3.5 h-3.5" />
                        }
                        אישור
                      </button>
                    </div>
                  )}
                  {p.status === "accepted" && (
                    <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]">
                      <MessageSquare className="w-3.5 h-3.5" /> פתח צ׳אט
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
