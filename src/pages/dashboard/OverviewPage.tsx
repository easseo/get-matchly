import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, DollarSign, FileText, CheckCircle, ArrowLeft, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Proposal } from "@/lib/supabase";

type ProposalWithCampaign = Proposal & {
  campaigns: { title: string; business_name: string } | null;
};

export default function CreatorOverviewPage() {
  const { user, name } = useUser();
  const [proposals, setProposals] = useState<ProposalWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("proposals")
      .select("*, campaigns(title, business_name)")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setProposals((data as ProposalWithCampaign[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const pending  = proposals.filter(p => p.status === "pending").length;
  const accepted = proposals.filter(p => p.status === "accepted").length;
  const totalEarned = proposals.filter(p => p.status === "accepted").reduce((s, p) => s + p.price, 0);
  const recent = proposals.slice(0, 5);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">שלום, {name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">הנה סיכום הפעילות שלך</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "הצעות שהגשתי",   value: proposals.length, icon: FileText,   bg: "bg-purple-50", color: "text-purple-500" },
          { label: "ממתינות לתשובה", value: pending,           icon: TrendingUp, bg: "bg-orange-50", color: "text-orange-500" },
          { label: "הצעות שהתקבלו",  value: accepted,          icon: CheckCircle,bg: "bg-green-50",  color: "text-green-500"  },
          { label: "הכנסות (צפוי)",  value: `₪${totalEarned.toLocaleString()}`, icon: DollarSign, bg: "bg-blue-50", color: "text-blue-500" },
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
        {/* Recent Proposals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900">הצעות אחרונות</h2>
            <Link to="/creator/proposals" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              הכל <ArrowLeft size={12} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">עדיין לא הגשת הצעות</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.campaigns?.title}</p>
                    <p className="text-xs text-gray-400">{p.campaigns?.business_name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-sm">₪{p.price.toLocaleString()}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === "accepted" ? "bg-green-50 text-green-600" :
                      p.status === "rejected" ? "bg-red-50 text-red-500" :
                      "bg-orange-50 text-orange-600"
                    }`}>
                      {p.status === "accepted" ? "התקבל" : p.status === "rejected" ? "נדחה" : "ממתין"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link to="/creator/browse" className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)" }}>
              <Compass size={22} className="text-white" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900">גלוש בקמפיינים</div>
              <div className="text-sm text-gray-500">מצא קמפיינים מתאימים לתחום שלך</div>
            </div>
            <ArrowLeft size={16} className="text-gray-400 mr-auto" />
          </Link>

          <Link to="/creator/proposals" className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-100">
              <FileText size={22} className="text-green-600" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900">ההצעות שלי</div>
              <div className="text-sm text-gray-500">{pending} ממתינות לתשובה</div>
            </div>
            <ArrowLeft size={16} className="text-gray-400 mr-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}
