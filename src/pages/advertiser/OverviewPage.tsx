import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Users, CheckCircle, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Campaign, Proposal } from "@/lib/supabase";

export default function AdvertiserOverviewPage() {
  const { user, name } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("campaigns").select("*").eq("advertiser_id", user.id).order("created_at", { ascending: false }),
      supabase.from("proposals").select("*, campaigns!inner(advertiser_id)").eq("campaigns.advertiser_id", user.id),
    ]).then(([{ data: c }, { data: p }]) => {
      setCampaigns((c as Campaign[]) ?? []);
      setProposals((p as Proposal[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  const activeCampaigns = campaigns.filter(c => ["published", "receiving_proposals", "in_progress"].includes(c.status));
  const pendingProposals = proposals.filter(p => p.status === "pending");
  const recentCampaigns = campaigns.slice(0, 4);

  const statusLabels: Record<string, string> = {
    draft: "טיוטה", published: "פורסם", receiving_proposals: "מקבל הצעות",
    in_progress: "בביצוע", completed: "הושלם", cancelled: "בוטל",
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">שלום, {name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">הנה סיכום הפעילות שלך</p>
        </div>
        <Link to="/advertiser/campaigns/new"
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--gradient-brand)" }}>
          <Plus size={15} /> קמפיין חדש
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "סה\"כ קמפיינים", value: campaigns.length,         icon: Megaphone,   bg: "bg-purple-50", color: "text-purple-500" },
          { label: "קמפיינים פעילים", value: activeCampaigns.length,  icon: TrendingUp,  bg: "bg-blue-50",   color: "text-blue-500"   },
          { label: "הצעות חדשות",     value: pendingProposals.length, icon: Users,       bg: "bg-orange-50", color: "text-orange-500" },
          { label: "הצעות שאושרו",    value: proposals.filter(p => p.status === "accepted").length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div className="font-extrabold text-xl text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900">הקמפיינים שלי</h2>
            <Link to="/advertiser/campaigns" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          {recentCampaigns.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400 mb-3">עדיין אין קמפיינים</p>
              <Link to="/advertiser/campaigns/new" className="text-sm font-bold text-primary hover:underline">צור קמפיין ראשון</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentCampaigns.map((c) => (
                <Link key={c.id} to={`/advertiser/campaigns/${c.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.business_type}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    c.status === "receiving_proposals" ? "bg-green-50 text-green-700" :
                    c.status === "draft" ? "bg-gray-100 text-gray-600" :
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {statusLabels[c.status] ?? c.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pending proposals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900">הצעות ממתינות</h2>
            <Link to="/advertiser/proposals" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          {pendingProposals.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">אין הצעות ממתינות</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingProposals.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: "var(--gradient-brand)" }}>
                    י
                  </div>
                  <div className="flex-1 mx-3 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">יוצר תוכן</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString("he-IL")}</p>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">₪{p.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
