import { Link } from "react-router-dom";
import { FileText, CheckCircle2, Wallet, Star, ArrowLeft, Eye, TrendingUp } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockCampaigns, mockPayments } from "@/data/mockApp";
import { useDemoAuth } from "@/hooks/useDemoAuth";

export default function CreatorDashboard() {
  const { user } = useDemoAuth();
  const open = mockCampaigns.filter((c) => c.status === "פעיל");
  const earned = mockPayments.filter((p) => p.status === "הושלם").reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter((p) => p.status === "ממתין").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title={`שלום, ${user?.fullName?.split(" ")[0] || "יוצר"} ✨`}
        subtitle="גלו קמפיינים פתוחים ועקבו אחר הביצועים שלכם"
        action={
          <Link
            to="/app/creator/browse"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-brand)" }}
          >
            דפדוף בקמפיינים
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="זמין למשיכה"   value={`₪${earned.toLocaleString()}`}          icon={Wallet}       tone="emerald" />
        <KpiCard label="ממתין לתשלום"  value={`₪${pending.toLocaleString()}`}         icon={FileText}     tone="amber" />
        <KpiCard label="דירוג ממוצע"   value="4.8"                                    icon={Star}         tone="pink"    hint="156 ביקורות" />
        <KpiCard label="סך רווחים"     value={`₪${(earned + pending).toLocaleString()}`} icon={TrendingUp} tone="violet" />
      </div>

      {/* Recommended Campaigns */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-gray-900">קמפיינים מומלצים</h2>
          <Link to="/app/creator/browse" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            עוד <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {open.slice(0, 3).map((c) => (
            <Link
              key={c.id}
              to="/app/creator/browse"
              className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group block"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={c.coverImage}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 left-0 p-3">
                  <div className="font-bold text-white text-sm line-clamp-1 leading-tight">{c.title}</div>
                  <div className="text-white/70 text-[11px] mt-0.5">{c.brand}</div>
                </div>
              </div>
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 text-sm">{c.budgetRange}</span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Eye className="w-3 h-3" />{c.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Payments */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-gray-900">תשלומים אחרונים</h2>
          <Link to="/app/creator/earnings" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            לכל הרווחים <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {mockPayments.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate">{p.title}</div>
                  <div className="text-[11px] text-gray-400 font-semibold">{p.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <StatusPill status={p.status} />
                <span className="font-extrabold text-gray-900 text-sm">₪{p.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
