import { Link } from "react-router-dom";
import { FileText, CheckCircle2, Wallet, Star, ArrowLeft } from "lucide-react";
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
          <Link to="/app/creator/browse" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-primary-foreground font-bold text-sm shadow-cta btn-glow" style={{ background: "var(--gradient-brand)" }}>
            דפדוף בקמפיינים
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <KpiCard label="זמין למשיכה" value={`₪${earned}`} icon={Wallet} tone="emerald" />
        <KpiCard label="ממתין לתשלום" value={`₪${pending}`} icon={Wallet} tone="amber" />
        <KpiCard label="סך רווחים" value={`₪${earned + pending}`} icon={CheckCircle2} tone="violet" />
        <KpiCard label="דירוג ממוצע" value="4.8" icon={Star} tone="pink" hint="156 ביקורות" />
      </div>

      <section className="bg-card rounded-3xl border border-border shadow-soft p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">קמפיינים מומלצים</h2>
          <Link to="/app/creator/browse" className="text-xs font-bold text-primary inline-flex items-center gap-1">
            עוד <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {open.slice(0, 3).map((c) => (
            <Link key={c.id} to="/app/creator/browse" className="rounded-2xl border border-border overflow-hidden hover-lift block">
              <div className={`h-24 ${c.cover}`} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-primary">{c.category}</span>
                  <StatusPill status={c.status} />
                </div>
                <div className="font-bold text-sm leading-tight line-clamp-1 mb-1">{c.title}</div>
                <div className="text-[11px] text-muted-foreground font-medium mb-2">{c.brand}</div>
                <div className="text-xs font-black text-foreground ltr-num">{c.budgetRange}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-3xl border border-border shadow-soft p-5 md:p-6">
        <h2 className="text-lg font-bold mb-4">תשלומים אחרונים</h2>
        <div className="divide-y divide-border">
          {mockPayments.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{p.title}</div>
                <div className="text-[11px] text-muted-foreground">{p.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={p.status} />
                <span className="font-black ltr-num">₪{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
