import { DollarSign, Clock, TrendingUp, Download, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const transactions = [
  { name: "Beauty Product Launch Campaign", date: "12 מרץ 2026", amount: "₪350", status: "completed" },
  { name: "Fitness App Promotion", date: "5 מרץ 2026", amount: "₪350", status: "pending" },
  { name: "Tech App Review", date: "5 מרץ 2026", amount: "₪350", status: "completed" },
  { name: "Food Delivery Campaign", date: "26 פברואר 2026", amount: "₪350", status: "completed" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: "הושלם", color: "text-green-600", bg: "bg-green-50 border-green-100", icon: <CheckCircle2 size={13} /> },
  pending: { label: "ממתין", color: "text-orange-500", bg: "bg-orange-50 border-orange-100", icon: <AlertCircle size={13} /> },
  cancelled: { label: "בוטל", color: "text-red-500", bg: "bg-red-50 border-red-100", icon: <XCircle size={13} /> },
};

export default function EarningsPage() {
  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">הכנסות</h1>
        <p className="text-sm text-gray-500 mt-0.5">עקוב אחר התשלומים שלך ונהל משיכות</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "יתרה זמינה", value: "₪540", icon: DollarSign, iconColor: "text-green-500", bg: "bg-green-50", border: "border-green-100", indicator: "● זמין" },
          { label: "תשלום ממתין", value: "₪350", icon: Clock, iconColor: "text-orange-400", bg: "bg-orange-50", border: "border-orange-100", indicator: "● ממתין" },
          { label: "סה\"כ הכנסות", value: "₪1,840", icon: TrendingUp, iconColor: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", indicator: "● כולל" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold ${s.iconColor}`}>{s.indicator}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Withdraw */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-extrabold text-gray-900 mb-1">משיכת הכנסות</h2>
        <p className="text-sm text-gray-400 mb-4">העבר את היתרה הזמינה לחשבון PayPal שלך</p>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">זמין למשיכה</div>
            <div className="font-extrabold text-gray-900">₪540.00</div>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-brand)" }}
          >
            משיכה דרך PayPal
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          המשיכות יגיעו תוך 1-3 ימי עסקים. יתרה מינימלית למשיכה: ₪50.
        </p>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900">היסטוריית תשלומים</h2>
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg">
            <Download size={13} /> ייצוא
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map((t) => {
            const s = statusConfig[t.status];
            return (
              <div key={t.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-semibold text-sm text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.date}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">{t.amount}</span>
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.color}`}>
                    {s.icon} {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-extrabold text-gray-900 mb-1">מידע מס</h2>
        <p className="text-sm text-gray-400 mb-4">מסמכי מס חשובים ומידע</p>
        <p className="text-xs text-gray-400 mb-4">
          תקבל טופס 1099 בתחילת השנה אם ההכנסות שלך עלו על ₪600 בשנה הקלנדרית.
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Download size={15} /> הורד מסמכי מס
        </button>
      </div>
    </div>
  );
}
