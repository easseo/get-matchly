import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Megaphone, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Campaign, CampaignStatus } from "@/lib/supabase";

const statusConfig: Record<CampaignStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "טיוטה", color: "bg-gray-100 text-gray-600", icon: <Clock size={12} /> },
  published: { label: "פורסם", color: "bg-blue-100 text-blue-600", icon: <Megaphone size={12} /> },
  receiving_proposals: { label: "מקבל הצעות", color: "bg-purple-100 text-purple-600", icon: <Megaphone size={12} /> },
  creator_selected: { label: "יוצר נבחר", color: "bg-indigo-100 text-indigo-600", icon: <CheckCircle2 size={12} /> },
  payment_pending: { label: "ממתין לתשלום", color: "bg-yellow-100 text-yellow-600", icon: <AlertCircle size={12} /> },
  payment_deposited: { label: "תשלום הופקד", color: "bg-orange-100 text-orange-600", icon: <CheckCircle2 size={12} /> },
  in_progress: { label: "בתהליך", color: "bg-cyan-100 text-cyan-600", icon: <Clock size={12} /> },
  content_submitted: { label: "תוכן הוגש", color: "bg-teal-100 text-teal-600", icon: <CheckCircle2 size={12} /> },
  waiting_approval: { label: "ממתין לאישור", color: "bg-amber-100 text-amber-600", icon: <AlertCircle size={12} /> },
  approved: { label: "אושר", color: "bg-green-100 text-green-600", icon: <CheckCircle2 size={12} /> },
  completed: { label: "הושלם", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={12} /> },
  cancelled: { label: "בוטל", color: "bg-red-100 text-red-600", icon: <XCircle size={12} /> },
  disputed: { label: "בסכסוך", color: "bg-red-100 text-red-700", icon: <AlertCircle size={12} /> },
};

export default function MyCampaignsPage() {
  const { user } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("advertiser_id", user.id)
        .order("created_at", { ascending: false });
      setCampaigns((data as Campaign[]) ?? []);
      setLoading(false);
    };
    fetchCampaigns();
  }, [user]);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">הקמפיינים שלי</h1>
          <p className="text-sm text-gray-500 mt-0.5">{campaigns.length} קמפיינים</p>
        </div>
        <Link to="/advertiser/campaigns/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
          <Plus size={16} /> קמפיין חדש
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Megaphone size={28} className="text-gray-400" />
          </div>
          <h3 className="font-extrabold text-gray-700 mb-2">אין קמפיינים עדיין</h3>
          <p className="text-sm text-gray-500 mb-5">צור את הקמפיין הראשון שלך ותתחיל לקבל הצעות מיוצרים</p>
          <Link to="/advertiser/campaigns/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            <Plus size={16} /> צור קמפיין ראשון
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => {
            const s = statusConfig[c.status];
            return (
              <Link key={c.id} to={`/advertiser/campaigns/${c.id}`} className="block bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${s.color}`}>
                        {s.icon}{s.label}
                      </span>
                      <span className="text-[11px] text-gray-400">{c.business_type}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 leading-tight">{c.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{c.business_name}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="text-sm font-extrabold text-gray-900">₪{c.budget_min.toLocaleString()}–{c.budget_max.toLocaleString()}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{c.content_format.join(", ")}</div>
                  </div>
                </div>
                {c.deadline && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    דדליין: {new Date(c.deadline).toLocaleDateString("he-IL")}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
