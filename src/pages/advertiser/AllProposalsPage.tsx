import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Proposal } from "@/lib/supabase";

type ProposalWithDetails = Proposal & {
  campaigns: { title: string; id: string } | null;
  profiles: { full_name: string } | null;
  creator_profiles: { instagram_username: string; followers: number } | null;
};

const statusConfig = {
  pending:   { label: "ממתין",   color: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: Clock },
  accepted:  { label: "התקבל",  color: "text-green-600",  bg: "bg-green-50 border-green-100",   icon: CheckCircle },
  rejected:  { label: "נדחה",   color: "text-red-500",    bg: "bg-red-50 border-red-100",       icon: XCircle },
  withdrawn: { label: "בוטל",   color: "text-gray-500",   bg: "bg-gray-50 border-gray-200",     icon: XCircle },
};

export default function AllProposalsPage() {
  const { user } = useUser();
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("proposals")
      .select("*, campaigns!inner(title, id, advertiser_id), profiles(full_name), creator_profiles(instagram_username, followers)")
      .eq("campaigns.advertiser_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProposals((data as ProposalWithDetails[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const filtered = filter === "all" ? proposals : proposals.filter(p => p.status === filter);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">כל ההצעות</h1>
        <p className="text-sm text-gray-500 mt-0.5">{proposals.length} הצעות סה"כ</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
            style={filter === f ? { background: "var(--gradient-brand)" } : {}}>
            {f === "all" ? `הכל (${proposals.length})` :
             f === "pending" ? `ממתינות (${proposals.filter(p => p.status === "pending").length})` :
             f === "accepted" ? `התקבלו (${proposals.filter(p => p.status === "accepted").length})` :
             `נדחו (${proposals.filter(p => p.status === "rejected").length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">אין הצעות בקטגוריה זו</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const s = statusConfig[p.status] ?? statusConfig.pending;
            const Icon = s.icon;
            const name = p.profiles?.full_name ?? "יוצר תוכן";
            const handle = p.creator_profiles?.instagram_username ? `@${p.creator_profiles.instagram_username}` : "";
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ background: "var(--gradient-brand)" }}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{name}</div>
                      {handle && <div className="text-xs text-gray-400">{handle}</div>}
                      {p.creator_profiles?.followers && (
                        <div className="text-xs text-gray-400">{p.creator_profiles.followers.toLocaleString()} עוקבים</div>
                      )}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 ${s.bg} ${s.color}`}>
                    <Icon size={12} /> {s.label}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">קמפיין</p>
                    <p className="text-sm font-bold text-gray-900">{p.campaigns?.title}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">מחיר</p>
                    <p className="font-extrabold text-gray-900">₪{p.price.toLocaleString()}</p>
                  </div>
                  <Link to={`/advertiser/campaigns/${p.campaign_id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background: "var(--gradient-brand)" }}>
                    צפה בקמפיין
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
