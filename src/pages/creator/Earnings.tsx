import { Wallet, Clock, TrendingUp, Download } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockPayments } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

export default function Earnings() {
  const total = mockPayments.reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter((p) => p.status === "ממתין").reduce((s, p) => s + p.amount, 0);
  const available = total - pending;

  return (
    <>
      <PageHeader title="רווחים" subtitle="עקבו אחר התשלומים ובצעו משיכות" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <KpiCard label="זמין למשיכה" value={`₪${available}`} icon={Wallet} tone="emerald" />
        <KpiCard label="ממתין לתשלום" value={`₪${pending}`} icon={Clock} tone="amber" />
        <KpiCard label="סך רווחים" value={`₪${total.toLocaleString()}`} icon={TrendingUp} tone="violet" />
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-soft p-5 mb-6">
        <h2 className="text-lg font-bold mb-2">משיכת רווחים</h2>
        <p className="text-xs text-muted-foreground font-semibold mb-4">העברה ליתרת ה-PayPal שלכם</p>
        <div className="rounded-2xl p-4 mb-4 border border-border" style={{ background: "var(--gradient-brand-soft)" }}>
          <div className="text-[11px] font-bold text-muted-foreground">זמין למשיכה</div>
          <div className="text-3xl font-black text-brand ltr-num">₪{available}.00</div>
        </div>
        <button
          onClick={() => toast({ title: "הבקשה נשלחה", description: `משיכה של ₪${available} ל-PayPal` })}
          disabled={available <= 0}
          className="px-5 py-2.5 rounded-xl text-primary-foreground font-bold shadow-cta disabled:opacity-50"
          style={{ background: "var(--gradient-brand)" }}
        >
          משיכה ל-PayPal
        </button>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">היסטוריית תשלומים</h2>
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
            <Download className="w-3.5 h-3.5" /> ייצוא
          </button>
        </div>
        <div className="divide-y divide-border">
          {mockPayments.map((p) => (
            <div key={p.id} className="p-4 md:px-5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-sm truncate">{p.title}</div>
                <div className="text-[11px] text-muted-foreground font-semibold">{p.date}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusPill status={p.status} />
                <span className="font-black ltr-num">₪{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
