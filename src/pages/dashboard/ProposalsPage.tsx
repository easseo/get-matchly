import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Proposal } from "@/lib/supabase";

type ProposalWithCampaign = Proposal & {
  campaigns: { title: string; business_name: string; budget_min: number; budget_max: number } | null;
};

const statusConfig = {
  pending:   { label: "ממתין לתשובה", color: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: Clock },
  accepted:  { label: "התקבלה!",      color: "text-green-600",  bg: "bg-green-50 border-green-100",   icon: CheckCircle },
  rejected:  { label: "נדחתה",        color: "text-red-500",    bg: "bg-red-50 border-red-100",       icon: XCircle },
  withdrawn: { label: "בוטלה",        color: "text-gray-500",   bg: "bg-gray-50 border-gray-200",     icon: XCircle },
};

export default function ProposalsPage() {
  const { user } = useUser();
  const [proposals, setProposals] = useState<ProposalWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("proposals")
      .select("*, campaigns(title, business_name, budget_min, budget_max)")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProposals((data as ProposalWithCampaign[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">ההצעות שלי</h1>
        <p className="text-sm text-gray-500 mt-0.5">{proposals.length} הצעות סה"כ</p>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-400" />
          </div>
          <h3 className="font-extrabold text-gray-700 mb-2">עדיין לא הגשת הצעות</h3>
          <p className="text-sm text-gray-500 mb-4">גלוש בקמפיינים והגש הצעה ראשונה</p>
          <Link to="/creator/browse" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            גלוש בקמפיינים
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => {
            const s = statusConfig[p.status] ?? statusConfig.pending;
            const Icon = s.icon;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-gray-900 truncate">{p.campaigns?.title ?? "קמפיין"}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{p.campaigns?.business_name}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(p.created_at).toLocaleDateString("he-IL")}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 ${s.bg} ${s.color}`}>
                    <Icon size={12} />
                    {s.label}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-xs text-gray-400">המחיר שהצעתי</span>
                    <div className="font-extrabold text-gray-900">₪{p.price.toLocaleString()}</div>
                  </div>
                  {p.campaigns && (
                    <div className="text-left">
                      <span className="text-xs text-gray-400">תקציב הקמפיין</span>
                      <div className="text-sm font-bold text-gray-600">₪{p.campaigns.budget_min.toLocaleString()}–₪{p.campaigns.budget_max.toLocaleString()}</div>
                    </div>
                  )}
                  <Link to={`/creator/campaigns/${p.campaign_id}`} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                    צפה בקמפיין <ChevronLeft size={12} />
                  </Link>
                </div>

                {p.message && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-500 line-clamp-2">{p.message}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
