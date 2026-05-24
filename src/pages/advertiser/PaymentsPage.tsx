import { CreditCard, Download, TrendingUp, CheckCircle, Clock, Plus } from "lucide-react";

const transactions = [
  { id: 1, campaign: "קמפיין אופנה קיץ 2026", creator: "נועה לוי", amount: "₪1,800", date: "10 מרץ 2025", status: "completed" },
  { id: 2, campaign: "קולקציית יופי", creator: "איתי כהן", amount: "₪1,200", date: "12 מרץ 2025", status: "pending" },
  { id: 3, campaign: "ביקורת טק", creator: "שירה ברק", amount: "₪2,100", date: "13 מרץ 2025", status: "completed" },
  { id: 4, campaign: "השקת כושר", creator: "דניאל מזרחי", amount: "₪3,500", date: "14 מרץ 2025", status: "completed" },
  { id: 5, campaign: "ציוד טיולים", creator: "מיכל גולן", amount: "₪1,500", date: "15 מרץ 2025", status: "pending" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: "שולם", color: "text-green-600", bg: "bg-green-50 border-green-100" },
  pending: { label: "ממתין", color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
};

export default function AdvertiserPaymentsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">תשלומים</h1>
          <p className="text-sm text-gray-500 mt-0.5">ניהול תשלומים ליוצרים</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Plus size={15} /> הוסף תשלום
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">₪10,100</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">סה"כ הוצאות</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">₪7,400</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">שולם</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Clock size={18} className="text-orange-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">₪2,700</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">ממתין לתשלום</div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="font-extrabold text-gray-900 mb-4">אמצעי תשלום</h2>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <CreditCard size={14} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">Visa •••• 4242</div>
              <div className="text-xs text-gray-400">פג תוקף: 12/27</div>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">ראשי</span>
        </div>
        <button className="mt-3 text-sm font-bold text-primary hover:underline">+ הוסף כרטיס</button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900">היסטוריית תשלומים</h2>
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
            <Download size={13} /> ייצא PDF
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs font-bold text-gray-400 border-b border-gray-50">
              <th className="text-right px-5 py-2.5">קמפיין</th>
              <th className="text-right px-5 py-2.5">יוצר</th>
              <th className="text-right px-5 py-2.5">סכום</th>
              <th className="text-right px-5 py-2.5">תאריך</th>
              <th className="text-right px-5 py-2.5">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => {
              const s = statusConfig[t.status];
              return (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-gray-800 max-w-[180px] truncate">{t.campaign}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{t.creator}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900">{t.amount}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{t.date}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.color}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
