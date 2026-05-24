import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Users, Calendar, DollarSign, CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Campaign, Proposal } from "@/lib/supabase";

type ProposalWithCreator = Proposal & {
  profiles: { full_name: string; email: string } | null;
  creator_profiles: { instagram_username: string; followers: number; engagement_rate: number } | null;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: "ממתין",    color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  accepted: { label: "התקבל",   color: "text-green-600",  bg: "bg-green-50 border-green-100" },
  rejected: { label: "נדחה",    color: "text-red-500",    bg: "bg-red-50 border-red-100" },
  withdrawn:{ label: "בוטל",    color: "text-gray-500",   bg: "bg-gray-50 border-gray-200" },
};

const campaignStatusLabels: Record<string, string> = {
  draft: "טיוטה", published: "פורסם", receiving_proposals: "מקבל הצעות",
  creator_selected: "יוצר נבחר", payment_pending: "ממתין לתשלום",
  payment_deposited: "תשלום הופקד", in_progress: "בביצוע",
  content_submitted: "תוכן הוגש", waiting_approval: "ממתין לאישור",
  approved: "מאושר", completed: "הושלם", cancelled: "בוטל", disputed: "במחלוקת",
};

export default function AdvertiserCampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [proposals, setProposals] = useState<ProposalWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
    setCampaign(c as Campaign);

    const { data: p } = await supabase
      .from("proposals")
      .select("*, profiles(full_name, email), creator_profiles(instagram_username, followers, engagement_rate)")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });
    setProposals((p as ProposalWithCreator[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const updateProposalStatus = async (proposal: ProposalWithCreator, status: "accepted" | "rejected") => {
    setUpdating(proposal.id);
    await supabase.from("proposals").update({ status }).eq("id", proposal.id);

    // When accepting — create a conversation if not exists
    if (status === "accepted") {
      await supabase.from("conversations").upsert({
        campaign_id: proposal.campaign_id,
        advertiser_id: campaign!.advertiser_id,
        creator_id: proposal.creator_id,
      }, { onConflict: "campaign_id,creator_id" });
    }

    // Notify creator
    await supabase.from("notifications").insert({
      user_id: proposal.creator_id,
      type: status === "accepted" ? "proposal_accepted" : "proposal_rejected",
      data: {
        message: status === "accepted"
          ? `ההצעה שלך על "${campaign!.title}" התקבלה!`
          : `ההצעה שלך על "${campaign!.title}" נדחתה`,
        campaign_id: proposal.campaign_id,
      },
    });

    await fetchData();
    setUpdating(null);
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!campaign) return (
    <div className="p-6 text-center text-gray-500">הקמפיין לא נמצא</div>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl" dir="rtl">
      <Link to="/advertiser/campaigns" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4 w-fit transition-colors" dir="ltr">
        <ChevronRight size={15} /> חזרה לקמפיינים
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 mb-2 inline-block">{campaign.business_type}</span>
            <h1 className="text-xl font-extrabold text-gray-900">{campaign.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{campaign.business_name}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${
            campaign.status === "receiving_proposals" ? "bg-green-50 border-green-100 text-green-700" :
            campaign.status === "draft" ? "bg-gray-50 border-gray-200 text-gray-600" :
            "bg-blue-50 border-blue-100 text-blue-700"
          }`}>
            {campaignStatusLabels[campaign.status] ?? campaign.status}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: DollarSign, label: "תקציב", value: `₪${campaign.budget_min.toLocaleString()}–₪${campaign.budget_max.toLocaleString()}` },
          { icon: Calendar,   label: "דדליין", value: campaign.deadline ? new Date(campaign.deadline).toLocaleDateString("he-IL") : "ללא" },
          { icon: Users,      label: "הצעות",  value: String(proposals.length) },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <item.icon size={16} className="mx-auto mb-1 text-primary" />
            <div className="font-extrabold text-gray-900 text-sm">{item.value}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Campaign info */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-extrabold text-sm text-gray-900 mb-2">מטרה</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{campaign.goal}</p>
          </div>
          {campaign.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-extrabold text-sm text-gray-900 mb-2">תיאור</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-extrabold text-sm text-gray-900 mb-2">תוצרים</h3>
            <p className="text-sm text-gray-600">{campaign.content_count} × {campaign.content_format.join(", ")}</p>
          </div>
        </div>

        {/* Proposals */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-extrabold text-gray-900">הצעות ({proposals.length})</h2>
            </div>

            {proposals.length === 0 ? (
              <div className="py-12 text-center">
                <Clock size={28} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">אין הצעות עדיין</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {proposals.map((p) => {
                  const s = statusConfig[p.status] ?? statusConfig.pending;
                  const isOpen = expanded === p.id;
                  const name = p.profiles?.full_name ?? "יוצר תוכן";
                  const handle = p.creator_profiles?.instagram_username ? `@${p.creator_profiles.instagram_username}` : "";
                  const followers = p.creator_profiles?.followers;

                  return (
                    <div key={p.id}>
                      <div
                        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpanded(isOpen ? null : p.id)}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-gray-900">{name}</span>
                            {handle && <span className="text-xs text-gray-400">{handle}</span>}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            {followers && <span>{followers.toLocaleString()} עוקבים</span>}
                            <span>{new Date(p.created_at).toLocaleDateString("he-IL")}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 text-sm shrink-0">₪{p.price.toLocaleString()}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${s.bg} ${s.color}`}>{s.label}</span>
                        {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                      </div>

                      {isOpen && (
                        <div className="px-4 pb-4 bg-gray-50">
                          <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                            <div className="text-xs font-bold text-gray-500 mb-1">הצעת התוכן</div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.message}</p>
                          </div>
                          {p.estimated_delivery && (
                            <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                              <div className="text-xs font-bold text-gray-500 mb-1">לוח זמנים</div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.estimated_delivery}</p>
                            </div>
                          )}
                          {p.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateProposalStatus(p, "accepted")}
                                disabled={updating === p.id}
                                className="flex-1 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-60"
                                style={{ background: "var(--gradient-brand)" }}
                              >
                                {updating === p.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                אשר
                              </button>
                              <button
                                onClick={() => updateProposalStatus(p, "rejected")}
                                disabled={updating === p.id}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center gap-1.5"
                              >
                                <XCircle size={13} />
                                דחה
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
