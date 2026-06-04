import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight, Users, Calendar, DollarSign, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Loader2, Clock, Sparkles, Instagram,
  TrendingUp, RefreshCw, MapPin, Tag, Eye, Shield,
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

// Convert raw score to a more realistic display value
function normalizeScore(raw: number): number {
  // Map raw 0–100 to a realistic 62–94 range to avoid extremes
  return Math.round(62 + (raw / 100) * 32);
}

function getScoreConfig(score: number) {
  if (score >= 88) return { label: "התאמה גבוהה", bg: "bg-emerald-500", text: "text-white", ring: "ring-emerald-300" };
  if (score >= 78) return { label: "התאמה טובה",  bg: "bg-blue-500",    text: "text-white", ring: "ring-blue-300" };
  return                 { label: "התאמה חלקית",  bg: "bg-gray-200",    text: "text-gray-700", ring: "ring-gray-200" };
}

function StatChip({ icon, label, highlight = false }: { icon: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold ${
      highlight ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100"
    }`}>
      {icon}{label}
    </span>
  );
}

export default function AdvertiserCampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [proposals, setProposals] = useState<ProposalWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [allMatches, setAllMatches] = useState<MatchResult[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
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

  useEffect(() => { fetchData(); }, [id]);

  useEffect(() => {
    if (!campaign || !id) return;
    (async () => {
      try {
        const existing = await getExistingMatches(id);
        if (existing.length > 0) {
          setAllMatches(existing);
        } else {
          setMatching(true);
          const results = await runMatchingEngine(campaign);
          setAllMatches(results);
          setVisibleCount(3);
          setMatching(false);
        }
      } catch (err: any) {
        setMatchError(err?.message ?? String(err));
        setMatching(false);
      }
    })();
  }, [campaign?.id]);

  const handleRefreshMatching = async () => {
    if (!campaign) return;
    setMatching(true);
    setMatchError(null);
    setVisibleCount(3);
    try {
      const results = await runMatchingEngine(campaign);
      setAllMatches(results);
    } catch (err: any) {
      setMatchError(err?.message ?? String(err));
    }
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
      <Link to="/app/campaigns" className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-gray-800 mb-5 w-fit transition-colors" dir="ltr">
        <ChevronRight size={15} /> חזרה לקמפיינים
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 mb-2.5 inline-block">
              {campaign.business_type}
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{campaign.title}</h1>
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

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {/* Proposals — primary metric in bidding model */}
          <div className={`rounded-2xl p-3 text-center ${
            proposals.length > 0
              ? "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
              : "bg-gray-50"
          }`}>
            <Users size={14} className="mx-auto mb-1 text-primary" />
            <div className="font-extrabold text-gray-900 text-lg leading-none">{proposals.length}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">הצעות שהתקבלו</div>
            {proposals.filter(p => p.status === "pending").length > 0 && (
              <div className="text-[9px] font-bold text-orange-600 mt-1">
                {proposals.filter(p => p.status === "pending").length} ממתינות לבדיקה
              </div>
            )}
          </div>
          {/* Deadline */}
          <div className="bg-gray-50 rounded-2xl p-3 text-center">
            <Calendar size={14} className="mx-auto mb-1 text-primary" />
            <div className="font-extrabold text-gray-900 text-sm">
              {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString("he-IL") : "ללא"}
            </div>
            <div className="text-[10px] text-gray-400">דדליין</div>
          </div>
        </div>
      </div>

      {/* ===== AI MATCHING ===== */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #eff6ff 100%)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-sm">יוצרים מתאימים לקמפיין שלך</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {matching
                  ? "מחפש יוצרי תוכן מתאימים..."
                  : matchError
                  ? `שגיאה: ${matchError}`
                  : allMatches.length > 0
                  ? `נמצאו ${allMatches.length} יוצרי תוכן מתאימים`
                  : "לחץ על חפש שוב"}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshMatching}
            disabled={matching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={12} className={matching ? "animate-spin" : ""} />
            חפש שוב
          </button>
        </div>

        {matching ? (
          <div className="py-14 text-center">
            <div className="w-11 h-11 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-700 mb-1 text-sm">מנתח התאמה עבור הקמפיין שלך</p>
            <p className="text-xs text-gray-400">בודק תחום, מיקום ומעורבות...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-10 text-center px-6">
            {matchError ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 text-right">
                <p className="font-bold text-red-700 text-sm mb-1">שגיאה בחיפוש:</p>
                <p className="text-xs text-red-600 font-mono break-all">{matchError}</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={22} className="text-purple-400" />
                </div>
                <p className="font-bold text-gray-700 mb-1 text-sm">אין הצעות עדיין</p>
                <p className="text-xs text-gray-400 mb-5">יוצרי תוכן עדיין מגישים הצעות לקמפיין שלך</p>
              </>
            )}
            <button
              onClick={handleRefreshMatching}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              מצא לי יוצרי תוכן
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 p-4">
              {matches.map((m, i) => {
                const cp = m.creator.creator_profiles;
                const avatar = getAvatar(m.creator_id);
                const displayScore = normalizeScore(m.score);
                const sc = getScoreConfig(displayScore);
                const isExpanded = expandedReason === m.creator_id;

                return (
                  <div
                    key={m.creator_id}
                    className={`bg-white rounded-2xl border ${displayScore >= 88 ? "border-emerald-100 shadow-md shadow-emerald-50" : "border-gray-100 shadow-sm"} overflow-hidden`}
                  >
                    {/* Main row */}
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-xs font-black text-gray-300 w-4 shrink-0">#{i + 1}</span>

                      <div className={`relative shrink-0 ring-2 ${sc.ring} rounded-full`}>
                        <img
                          src={avatar}
                          alt={m.creator.full_name}
                          loading="lazy"
                          decoding="async"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-sm">
                          <Instagram size={8} className="text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="font-extrabold text-gray-900 text-sm">{m.creator.full_name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-400">
                          {cp?.instagram_username && <span>@{cp.instagram_username}</span>}
                          {cp?.niche && <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">{cp.niche}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {cp?.followers != null && (
                            <StatChip icon={<Users size={9} />} label={`${cp.followers >= 1000 ? `${(cp.followers/1000).toFixed(0)}K` : cp.followers} עוקבים`} />
                          )}
                          {cp?.engagement_rate != null && (
                            <StatChip icon={<TrendingUp size={9} />} label={`${cp.engagement_rate}%`} highlight={cp.engagement_rate >= 3} />
                          )}
                          {cp?.location && <StatChip icon={<MapPin size={9} />} label={cp.location} />}
                          {cp?.price_min != null && cp?.price_max != null && (
                            <StatChip icon={<Tag size={9} />} label={`הערכת מחיר: ₪${cp.price_min.toLocaleString()}–₪${cp.price_max.toLocaleString()}`} highlight />
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className={`shrink-0 flex flex-col items-center justify-center rounded-2xl px-3 py-2 ${sc.bg} ${sc.text} min-w-[60px]`}>
                        <span className="text-lg font-black leading-none">{displayScore}</span>
                        <span className="text-[9px] font-bold mt-0.5 opacity-90 text-center leading-tight">{sc.label}</span>
                      </div>
                    </div>

                    {/* Why matched — expandable */}
                    {m.reasons.length > 0 && (
                      <div className="border-t border-gray-50">
                        <button
                          onClick={() => setExpandedReason(isExpanded ? null : m.creator_id)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <span>למה זה מתאים לך</span>
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-3">
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                              <div className="flex flex-wrap gap-1.5">
                                {m.reasons.map((r) => (
                                  <span key={r} className="text-[10px] px-2 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 font-medium">
                                    ✓ {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="border-t border-gray-50 px-4 py-3 flex gap-2">
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <Tag size={12} /> בקש הצעת מחיר
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Eye size={12} /> ראה פרופיל
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 pb-4">
              {visibleCount < allMatches.length ? (
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="w-full py-3 rounded-2xl text-sm font-bold border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  מצא לי עוד 3 יוצרי תוכן ({allMatches.length - visibleCount} נוספים)
                </button>
              ) : (
                <div className="text-center py-1">
                  <p className="text-xs text-gray-400 mb-2">הוצגו כל {allMatches.length} יוצרי התוכן המתאימים</p>
                  <button onClick={handleRefreshMatching} className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mx-auto">
                    <RefreshCw size={11} /> הרץ חיפוש מחדש
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Proposals — reordered before AI matches when bids exist */}
      <div className={`bg-white rounded-3xl shadow-sm overflow-hidden mb-4 ${
        proposals.length > 0
          ? "border-2 border-purple-100 shadow-purple-50"
          : "border border-gray-100"
      }`}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-gray-900 text-sm">הצעות מחיר שהתקבלו</h2>
            {proposals.length > 0 && (
              <p className="text-[11px] text-gray-400 mt-0.5">{proposals.length} יוצרים הגישו הצעות</p>
            )}
          </div>
          {proposals.filter(p => p.status === "pending").length > 0 && (
            <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 animate-pulse">
              {proposals.filter(p => p.status === "pending").length} ממתינות לבדיקה
            </span>
          )}
        </div>

        {proposals.length === 0 ? (
          <div className="py-12 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3">
              <Clock size={22} className="text-orange-300" />
            </div>
            <p className="text-sm font-bold text-gray-600 mb-1">אין הצעות עדיין</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              יוצרים בוחנים את הקמפיין שלך ויגישו הצעות מחיר בקרוב!
            </p>
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
                    <img src={getAvatar(p.creator_id)} alt={name} loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">{name}</span>
                        {handle && <span className="text-xs text-gray-400">{handle}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        {followers && <span>{followers.toLocaleString()} עוקבים</span>}
                        <span>{new Date(p.created_at).toLocaleDateString("he-IL")}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 text-sm shrink-0">₪{p.price.toLocaleString()}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${s.bg} ${s.color}`}>{s.label}</span>
                    {isOpen ? <ChevronUp size={13} className="text-gray-400 shrink-0" /> : <ChevronDown size={13} className="text-gray-400 shrink-0" />}
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
                            <XCircle size={13} /> דחה
                          </button>
                        </div>
                      )}
                      {p.status === "accepted" && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <Shield size={14} className="text-emerald-600 shrink-0" />
                          <p className="text-xs font-bold text-emerald-700">הצעת המחיר אושרה — ניתן להפקיד את הסכום ולהגן על הכסף</p>
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
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-extrabold text-xs text-gray-500 mb-2 uppercase tracking-wide">מטרה</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{campaign.goal}</p>
        </div>
        {campaign.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-extrabold text-xs text-gray-500 mb-2 uppercase tracking-wide">תיאור</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-extrabold text-xs text-gray-500 mb-2 uppercase tracking-wide">תוצרים</h3>
          <p className="text-sm text-gray-700">{campaign.content_count} × {campaign.content_format.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
