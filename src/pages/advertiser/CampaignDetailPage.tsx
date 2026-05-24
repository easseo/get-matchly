import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight, Users, Calendar, DollarSign, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Loader2, Clock, Sparkles, Instagram,
  TrendingUp, RefreshCw, Star, MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Campaign, Proposal } from "@/lib/supabase";
import { runMatchingEngine, getExistingMatches } from "@/lib/matching";
import type { MatchResult } from "@/lib/matching";

type ProposalWithCreator = Proposal & {
  profiles: { full_name: string; email: string } | null;
  creator_profiles: { instagram_username: string; followers: number; engagement_rate: number } | null;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "ממתין",  color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
  accepted:  { label: "התקבל", color: "text-green-600",  bg: "bg-green-50 border-green-100" },
  rejected:  { label: "נדחה",  color: "text-red-500",    bg: "bg-red-50 border-red-100" },
  withdrawn: { label: "בוטל",  color: "text-gray-500",   bg: "bg-gray-50 border-gray-200" },
};

const campaignStatusLabels: Record<string, string> = {
  draft: "טיוטה", published: "פורסם", receiving_proposals: "מקבל הצעות",
  creator_selected: "יוצר נבחר", payment_pending: "ממתין לתשלום",
  in_progress: "בביצוע", completed: "הושלם", cancelled: "בוטל",
};

// Unsplash avatar photos for creators
const creatorAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
];

function getAvatar(creatorId: string) {
  const hash = creatorId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return creatorAvatars[hash % creatorAvatars.length];
}

export default function AdvertiserCampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [proposals, setProposals] = useState<ProposalWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [allMatches, setAllMatches] = useState<MatchResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [matching, setMatching] = useState(false);
  const matches = allMatches.slice(0, visibleCount);

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

  useEffect(() => {
    fetchData();
  }, [id]);

  // Auto-run matching after campaign loads
  useEffect(() => {
    if (!campaign || !id) return;
    getExistingMatches(id).then(async (existing) => {
      if (existing.length > 0) {
        setAllMatches(existing);
      } else {
        // Auto-run matching for new campaigns
        setMatching(true);
        const results = await runMatchingEngine(campaign);
        setAllMatches(results);
        setVisibleCount(3);
        setMatching(false);
      }
    });
  }, [campaign?.id]);

  const handleRefreshMatching = async () => {
    if (!campaign) return;
    setMatching(true);
    setVisibleCount(3);
    const results = await runMatchingEngine(campaign);
    setAllMatches(results);
    setMatching(false);
  };

  const updateProposalStatus = async (proposal: ProposalWithCreator, status: "accepted" | "rejected") => {
    setUpdating(proposal.id);
    await supabase.from("proposals").update({ status }).eq("id", proposal.id);
    if (status === "accepted") {
      await supabase.from("conversations").upsert({
        campaign_id: proposal.campaign_id,
        advertiser_id: campaign!.advertiser_id,
        creator_id: proposal.creator_id,
      }, { onConflict: "campaign_id,creator_id" });
    }
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
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">טוען קמפיין...</p>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="p-6 text-center text-gray-500">הקמפיין לא נמצא</div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl" dir="rtl">
      <Link to="/advertiser/campaigns" className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-gray-800 mb-5 w-fit transition-colors" dir="ltr">
        <ChevronRight size={15} /> חזרה לקמפיינים
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 mb-3 inline-block">
              {campaign.business_type}
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900">{campaign.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{campaign.business_name}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${
            campaign.status === "receiving_proposals" || campaign.status === "published"
              ? "bg-green-50 border-green-100 text-green-700"
              : campaign.status === "draft"
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : "bg-blue-50 border-blue-100 text-blue-700"
          }`}>
            {campaignStatusLabels[campaign.status] ?? campaign.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: DollarSign, label: "תקציב", value: `₪${campaign.budget_min.toLocaleString()}–₪${campaign.budget_max.toLocaleString()}` },
            { icon: Calendar,   label: "דדליין", value: campaign.deadline ? new Date(campaign.deadline).toLocaleDateString("he-IL") : "ללא" },
            { icon: Users,      label: "הצעות",  value: String(proposals.length) },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-2xl p-3 text-center">
              <item.icon size={16} className="mx-auto mb-1 text-primary" />
              <div className="font-extrabold text-gray-900 text-sm">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MATCHING CREATORS ===== */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #eff6ff 100%)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900">יוצרים מומלצים עבורך</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {matching ? "מחפש יוצרים מתאימים..." : allMatches.length > 0 ? `נמצאו ${allMatches.length} יוצרים מתאימים` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshMatching}
            disabled={matching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={12} className={matching ? "animate-spin" : ""} />
            רענן
          </button>
        </div>

        {matching ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-700 mb-1">מחפש את היוצרים המושלמים לקמפיין שלך</p>
            <p className="text-sm text-gray-400">מנתח התאמה לפי תחום, מיקום ותקציב...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-16 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-purple-400" />
            </div>
            <p className="font-extrabold text-gray-700 mb-2">לא נמצאו יוצרים מתאימים</p>
            <p className="text-sm text-gray-400 mb-5">נסה לשנות את הגדרות הקמפיין כדי להרחיב את החיפוש</p>
            <button
              onClick={handleRefreshMatching}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              חפש שוב
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {matches.map((m, i) => {
                const cp = m.creator.creator_profiles;
                const avatar = getAvatar(m.creator_id);
                const scoreColor =
                  m.score >= 80 ? "text-green-600 bg-green-50" :
                  m.score >= 60 ? "text-blue-600 bg-blue-50" :
                  "text-orange-600 bg-orange-50";

                return (
                  <div key={m.creator_id} className="flex items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                    {/* Rank */}
                    <div className="w-6 text-center shrink-0">
                      <span className="text-sm font-extrabold text-gray-300">#{i + 1}</span>
                    </div>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={avatar}
                        alt={m.creator.full_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                        <Instagram size={10} className="text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-extrabold text-gray-900 text-sm">{m.creator.full_name}</span>
                        {cp?.instagram_username && (
                          <span className="text-xs text-gray-400">@{cp.instagram_username}</span>
                        )}
                        {cp?.niche && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold">
                            {cp.niche}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        {cp?.followers && (
                          <span className="flex items-center gap-1">
                            <Users size={10} /> {cp.followers.toLocaleString()}
                          </span>
                        )}
                        {cp?.engagement_rate && (
                          <span className="flex items-center gap-1">
                            <TrendingUp size={10} /> {cp.engagement_rate}%
                          </span>
                        )}
                        {cp?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {cp.location}
                          </span>
                        )}
                        {cp?.price_min && cp?.price_max && (
                          <span className="font-semibold text-gray-600">
                            ₪{cp.price_min.toLocaleString()}–₪{cp.price_max.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {m.reasons.map((r) => (
                          <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-medium">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`shrink-0 text-center px-3 py-2 rounded-2xl ${scoreColor}`}>
                      <div className="text-xl font-black">{m.score}</div>
                      <div className="text-[10px] font-bold">התאמה</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more / no more */}
            <div className="px-6 py-4 border-t border-gray-50">
              {visibleCount < allMatches.length ? (
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="w-full py-3 rounded-2xl text-sm font-bold border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                >
                  מצא לי עוד 3 יוצרים ({allMatches.length - visibleCount} נוספים)
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">הצגת את כל {allMatches.length} היוצרים המתאימים</p>
                  <button
                    onClick={handleRefreshMatching}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw size={11} /> הרץ חיפוש מחדש
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Proposals */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">הצעות שהתקבלו ({proposals.length})</h2>
        </div>

        {proposals.length === 0 ? (
          <div className="py-12 text-center">
            <Clock size={28} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">אין הצעות עדיין — יוצרים יכולים לשלוח הצעות לקמפיין</p>
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
                    <img
                      src={getAvatar(p.creator_id)}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                    />
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
                    <span className="font-extrabold text-gray-900 text-sm shrink-0">₪{p.price.toLocaleString()}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${s.bg} ${s.color}`}>{s.label}</span>
                    {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-4 bg-gray-50/50">
                      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
                        <div className="text-xs font-bold text-gray-400 mb-1.5">הצעת התוכן</div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{p.message}</p>
                      </div>
                      {p.estimated_delivery && (
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
                          <div className="text-xs font-bold text-gray-400 mb-1.5">לוח זמנים</div>
                          <p className="text-sm text-gray-700">{p.estimated_delivery}</p>
                        </div>
                      )}
                      {p.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateProposalStatus(p, "accepted")}
                            disabled={updating === p.id}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-60 shadow-md"
                            style={{ background: "var(--gradient-brand)" }}
                          >
                            {updating === p.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                            אשר הצעה
                          </button>
                          <button
                            onClick={() => updateProposalStatus(p, "rejected")}
                            disabled={updating === p.id}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center gap-1.5"
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

      {/* Campaign Details */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-extrabold text-sm text-gray-900 mb-2">מטרה</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{campaign.goal}</p>
        </div>
        {campaign.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-extrabold text-sm text-gray-900 mb-2">תיאור</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{campaign.description}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-extrabold text-sm text-gray-900 mb-2">תוצרים</h3>
          <p className="text-sm text-gray-500">{campaign.content_count} × {campaign.content_format.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
