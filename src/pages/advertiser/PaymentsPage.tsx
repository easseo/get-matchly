import { useEffect, useState } from "react";
import { CreditCard, Clock, CheckCircle, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Proposal } from "@/lib/supabase";

type ProposalWithDetails = Proposal & {
  campaigns: { title: string; id: string } | null;
  profiles: { full_name: string } | null;
};

export default function AdvertiserPaymentsPage() {
  const { user } = useUser();
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("proposals")
      .select("*, campaigns!inner(title, id, advertiser_id), profiles(full_name)")
      .eq("campaigns.advertiser_id", user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProposals((data as ProposalWithDetails[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const total = proposals.reduce((s, p) => s + p.price, 0);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">תשלומים</h1>
        <p className="text-sm text-gray-500 mt-0.5">הצעות שאושרו וממתינות לתשלום</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { label: "עסקאות פעילות", value: proposals.length,           icon: CreditCard,  bg: "bg-purple-50", color: "text-purple-500" },
          { label: "ממתין לתשלום",  value: `₪${total.toLocaleString()}`, icon: Clock,     bg: "bg-orange-50", color: "text-orange-500" },
          { label: "שולם",          value: "₪0",                       icon: CheckCircle, bg: "bg-green-50",  color: "text-green-500"  },
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">הצעות שאושרו</h2>
        </div>

        {proposals.length === 0 ? (
          <div className="py-12 text-center">
            <DollarSign size={28} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 mb-2">אין עסקאות פעילות</p>
            <p className="text-xs text-gray-400">אשר הצעות של יוצרי תוכן כדי לראות אותן כאן</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
                    {(p.profiles?.full_name ?? "י")[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.profiles?.full_name ?? "יוצר תוכן"}</p>
                    <p className="text-xs text-gray-400">{p.campaigns?.title}</p>
                    <p className="text-xs text-gray-400">{new Date(p.updated_at).toLocaleDateString("he-IL")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-gray-900">₪{p.price.toLocaleString()}</span>
                  <Link to={`/advertiser/campaigns/${p.campaign_id}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50">
                    פרטים
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
