import { ShieldCheck, Clock, TrendingUp, Download, CreditCard, ChevronRight } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { mockPayments } from "@/data/mockApp";

const escrowStatusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  "ממתין להפקדה": { label: "ממתין להפקדה", color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-100" },
  "כסף מוגן":     { label: "כסף מוגן",      color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-100" },
  "ממתין לאישור": { label: "ממתין לאישור",  color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-100" },
  "שוחרר ליוצר":  { label: "שוחרר ליוצר",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  "הושלם":        { label: "הושלם",          color: "text-gray-600",   bg: "bg-gray-100",   border: "border-gray-200" },
  "ממתין":        { label: "ממתין להפקדה",  color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-100" },
};

function EscrowStatusPill({ status }: { status: string }) {
  const cfg = escrowStatusConfig[status] ?? { label: status, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

const escrowPayments = [
  { id: "ep1", title: "קמפיין מסעדה — רילסים × 2", date: "12 במרץ 2026",    amount: 1200, status: "הושלם",        creator: "שרה יונסון" },
  { id: "ep2", title: "קמפיין אפליקציית כושר",      date: "20 במאי 2026",    amount: 950,  status: "כסף מוגן",    creator: "מיכל חן" },
  { id: "ep3", title: "ביקורת מוצרי טיפוח",         date: "28 במאי 2026",    amount: 880,  status: "ממתין לאישור", creator: "נועה לוי" },
  { id: "ep4", title: "קמפיין השקת קולקציה",         date: "25 בפברואר 2026", amount: 720,  status: "שוחרר ליוצר", creator: "אמה רודריגז" },
];

export default function Payments() {
  const total = escrowPayments.reduce((s, p) => s + p.amount, 0);
  const protected_ = escrowPayments.filter(p => p.status === "כסף מוגן").reduce((s, p) => s + p.amount, 0);
  const pending = escrowPayments.filter(p => p.status === "ממתין להפקדה" || p.status === "ממתין").reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="תשלומים"
        subtitle="ניהול תשלומים מוגנים לקמפיינים"
        action={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> ייצוא היסטוריה
          </button>
        }
      />

      {/* Protected payment explainer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-extrabold text-blue-900 text-sm">תשלום מוגן — Matchly Escrow</p>
          <p className="text-xs text-blue-600 font-medium mt-0.5 leading-relaxed">
            הכסף יישאר מוגן עד אישור הקמפיין. אתם מאשרים שחרור רק לאחר שהתוצרים התקבלו לשביעות רצונכם.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <KpiCard label="כספים בקמפיינים" value={`₪${protected_.toLocaleString()}`}  icon={ShieldCheck}  tone="violet" hint="מוגן" />
        <KpiCard label="ממתין להפקדה"    value={`₪${pending.toLocaleString()}`}      icon={Clock}        tone="amber" />
        <KpiCard label="סך ההוצאות"      value={`₪${total.toLocaleString()}`}        icon={TrendingUp}   tone="emerald" />
      </div>

      {/* Payment flow steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-3">מסלול תשלום מוגן</h3>
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {["הפקדה", "כסף מוגן", "ביצוע", "אישורכם", "שחרור"].map((step, i, arr) => (
            <div key={step} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  i <= 1 ? "text-white" : "bg-gray-100 text-gray-400"
                }`} style={i <= 1 ? { background: "var(--gradient-brand)" } : undefined}>
                  {i + 1}
                </div>
                <span className="text-[9px] font-bold text-gray-500 mt-1 whitespace-nowrap">{step}</span>
              </div>
              {i < arr.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-300 mx-1 shrink-0 mb-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900 text-sm">היסטוריית תשלומים</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {escrowPayments.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-gray-900 truncate">{p.title}</div>
                  <div className="text-[11px] text-gray-400 font-semibold">{p.creator} · {p.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <EscrowStatusPill status={p.status} />
                <span className="font-black text-gray-900 text-sm">₪{p.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
