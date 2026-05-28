import { useState } from "react";
import { Wallet, Clock, TrendingUp, Download, CheckCircle2, CreditCard, AlertCircle, ChevronRight } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockPayments } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

const PAYPAL_EMAIL = "demo@paypal.com";
const PAYPAL_CONNECTED = true;

export default function Earnings() {
  const total = mockPayments.reduce((s, p) => s + p.amount, 0);
  const pending = mockPayments.filter((p) => p.status === "ממתין").reduce((s, p) => s + p.amount, 0);
  const available = total - pending;

  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const handleWithdraw = async () => {
    if (available <= 0) return;
    setWithdrawing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setWithdrawing(false);
    setWithdrawn(true);
    toast({ title: `המשיכה נשלחה ל-PayPal`, description: `₪${available.toLocaleString()} יועברו ל-${PAYPAL_EMAIL}` });
  };

  return (
    <>
      <PageHeader title="רווחים" subtitle="עקבו אחר התשלומים ובצעו משיכות" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KpiCard label="זמין למשיכה"  value={`₪${available.toLocaleString()}`} icon={Wallet}      tone="emerald" />
        <KpiCard label="ממתין לתשלום" value={`₪${pending.toLocaleString()}`}   icon={Clock}       tone="amber" />
        <KpiCard label="סך רווחים"    value={`₪${total.toLocaleString()}`}     icon={TrendingUp}  tone="violet" />
      </div>

      {/* PayPal connection */}
      <div className={`rounded-2xl p-4 mb-4 flex items-center justify-between gap-3 border ${
        PAYPAL_CONNECTED ? "bg-emerald-50 border-emerald-100" : "bg-orange-50 border-orange-100"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            PAYPAL_CONNECTED ? "bg-emerald-100" : "bg-orange-100"
          }`}>
            {PAYPAL_CONNECTED
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              : <AlertCircle className="w-5 h-5 text-orange-600" />
            }
          </div>
          <div>
            <p className={`font-bold text-sm ${PAYPAL_CONNECTED ? "text-emerald-800" : "text-orange-800"}`}>
              PayPal {PAYPAL_CONNECTED ? "— מחובר" : "— לא מחובר"}
            </p>
            <p className={`text-[11px] font-medium ${PAYPAL_CONNECTED ? "text-emerald-600" : "text-orange-600"}`}>
              {PAYPAL_CONNECTED ? PAYPAL_EMAIL : "יש לחבר PayPal לביצוע משיכות"}
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
          עריכה <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Withdrawal card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="font-extrabold text-gray-900 text-sm mb-1">משיכת רווחים</h2>
        <p className="text-xs text-gray-400 mb-4">העברה לחשבון ה-PayPal שלכם</p>

        <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: "var(--gradient-brand-soft)" }}>
          <div className="absolute inset-0 opacity-10" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative">
            <p className="text-xs font-bold text-gray-500 mb-1">זמין למשיכה</p>
            <p className="text-4xl font-black text-gray-900 leading-none">₪{available.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">.00</p>
          </div>
        </div>

        {withdrawn ? (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">המשיכה נשלחה ל-PayPal</p>
              <p className="text-xs text-emerald-600 font-medium">{PAYPAL_EMAIL} · עד 3 ימי עסקים</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleWithdraw}
            disabled={available <= 0 || withdrawing || !PAYPAL_CONNECTED}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity min-h-[44px]"
            style={{ background: "var(--gradient-brand)" }}
          >
            {withdrawing ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            {withdrawing ? "מעבד..." : "משיכה ל-PayPal"}
          </button>
        )}
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900 text-sm">היסטוריית תשלומים</h2>
          <button className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors">
            <Download className="w-3.5 h-3.5" /> ייצוא
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {mockPayments.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400 font-semibold">{p.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <StatusPill status={p.status} />
                <span className="font-extrabold text-gray-900 text-sm">₪{p.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
