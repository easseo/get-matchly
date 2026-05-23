import { Wallet, Clock, TrendingUp, Download } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockPayments } from "@/data/mockApp";

export default function Payments() {
  const total = mockPayments.reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter((p) => p.status === "ממתין").reduce((s, p) => s + p.amount, 0);
  const completed = total - pending;

  return (
    <>
      <PageHeader
        title="תשלומים"
        subtitle="היסטוריית תשלומים וניהול שיטות תשלום"
        action={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border font-bold text-sm hover:bg-muted">
            <Download className="w-4 h-4" /> ייצוא היסטוריה
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <KpiCard label="זמין למשיכה" value={`₪${completed.toLocaleString()}`} icon={Wallet} tone="emerald" />
        <KpiCard label="ממתין לאישור" value={`₪${pending.toLocaleString()}`} icon={Clock} tone="amber" />
        <KpiCard label="סך ההוצאות" value={`₪${total.toLocaleString()}`} icon={TrendingUp} tone="violet" />
        <KpiCard label="החודש" value="₪1,522" icon={Wallet} tone="pink" />
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">היסטוריית תשלומים</h2>
        </div>
        <div className="divide-y divide-border">
          {mockPayments.map((p) => (
            <div key={p.id} className="p-4 md:px-5 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
              <div className="min-w-0">
                <div className="font-bold text-sm truncate">{p.title}</div>
                <div className="text-[11px] text-muted-foreground font-semibold">{p.date}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusPill status={p.status} />
                <span className="text-base font-black ltr-num">₪{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
