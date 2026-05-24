import { useEffect, useState } from "react";
import { DollarSign, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Proposal } from "@/lib/supabase";

type ProposalWithCampaign = Proposal & {
  campaigns: { title: string; business_name: string } | null;
};

export default function EarningsPage() {
  const { user } = useUser();
  const [proposals, setProposals] = useState<ProposalWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("proposals")
      .select("*, campaigns(title, business_name)")
      .eq("creator_id", user.id)
      .in("status", ["accepted", "pending"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProposals((data as ProposalWithCampaign[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const earned  = proposals.filter(p => p.status === "accepted").reduce((s, p) => s + p.price, 0);
  const pending = proposals.filter(p => p.status === "pending").reduce((s, p) => s + p.price, 0);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">הכנסות</h1>
        <p className="text-sm text-gray-500 mt-0.5">סיכום ההכנסות מקמפיינים</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { label: "הכנסות מאושרות", value: `₪${earned.toLocaleString()}`,  icon: CheckCircle, bg: "bg-green-50",  color: "text-green-500"  },
          { label: "בהמתנה",         value: `₪${pending.toLocaleString()}`, icon: Clock,       bg: "bg-orange-50", color: "text-orange-500" },
          { label: "סה\"כ פוטנציאל", value: `₪${(earned + pending).toLocaleString()}`, icon: TrendingUp, bg: "bg-purple-50", color: "text-purple-500" },
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

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">פירוט עסקאות</h2>
        </div>
        {proposals.length === 0 ? (
          <div className="py-12 text-center">
            <DollarSign size={28} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">עדיין אין הכנסות — הגש הצעות לקמפיינים</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{p.campaigns?.title}</p>
                  <p className="text-xs text-gray-400">{p.campaigns?.business_name} · {new Date(p.created_at).toLocaleDateString("he-IL")}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold text-gray-900">₪{p.price.toLocaleString()}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.status === "accepted" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {p.status === "accepted" ? "אושר" : "ממתין"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
