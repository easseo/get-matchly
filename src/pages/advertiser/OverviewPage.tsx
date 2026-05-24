import { Megaphone, Users, CheckCircle, TrendingUp, MoreVertical, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const stats = [
  { label: "קמפיינים פעילים", value: "6", sub: "פעיל כעת", icon: Megaphone, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-100" },
  { label: "סה\"כ הצעות", value: "35", sub: "ממתינות לאישור", icon: Users, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { label: "קמפיינים הושלמו", value: "12", sub: "42 ב-30 יום", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
  { label: "סה\"כ חשיפה", value: "1.62M", sub: "אושרו", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" },
];

const campaigns = [
  { name: "קולקציית אופנה קיץ 2026", budget: "₪3,200", deadline: "15 יוני 2026", proposals: 12 },
  { name: "מוצרי יופי בר-קיימא", budget: "₪1,800", deadline: "30 מאי 2026", proposals: 8 },
  { name: "ביקורת גאדג'טים טק", budget: "₪2,500", deadline: "20 יוני 2026", proposals: 15 },
];

const recentApplications = [
  { name: "נועה לוי", handle: "@noa_levy", reach: "124K", total: "₪1,800", date: "10 מרץ 2025", avatar: "נ" },
  { name: "איתי כהן", handle: "@itay.cohen", reach: "86K", total: "₪1,200", date: "12 מרץ 2025", avatar: "א" },
  { name: "שירה ברק", handle: "@shira_barak", reach: "85K", total: "₪2,100", date: "13 מרץ 2025", avatar: "ש" },
];

export default function AdvertiserOverviewPage() {
  const { name } = useUser();

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">סקירת קמפיינים</h1>
          <p className="text-sm text-gray-500 mt-0.5">שלום, {name} — הנה מה שקורה בעסק שלך</p>
        </div>
        <Link
          to="/advertiser/campaigns/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Megaphone size={15} /> קמפיין חדש
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border shadow-sm ${s.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={18} className={s.color} />
              </div>
              <span className="text-[11px] font-semibold text-gray-400">{s.sub}</span>
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Campaigns */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900">קמפיינים פעילים</h2>
          <Link to="/advertiser/campaigns" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            הצג הכל <ArrowLeft size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {campaigns.map((c) => (
            <div key={c.name} className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)" }}>
                <Megaphone size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">{c.name}</div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><DollarSign size={11} />{c.budget}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} />{c.deadline}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} />{c.proposals} הצעות</span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">פעיל</span>
              <button className="p-1 rounded-lg hover:bg-gray-100"><MoreVertical size={14} className="text-gray-400" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Creator Applications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900">בקשות יוצרים אחרונות</h2>
          <Link to="/advertiser/proposals" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            הצג הכל <ArrowLeft size={12} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs font-bold text-gray-400 border-b border-gray-50">
              <th className="text-right px-5 py-2.5">יוצר</th>
              <th className="text-right px-5 py-2.5">חשיפה</th>
              <th className="text-right px-5 py-2.5">הצעה</th>
              <th className="text-right px-5 py-2.5">תאריך</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentApplications.map((a) => (
              <tr key={a.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "var(--gradient-brand)" }}>{a.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{a.name}</div>
                      <div className="text-xs text-gray-400">{a.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-gray-700">{a.reach}</td>
                <td className="px-5 py-3 text-sm font-bold text-gray-900">{a.total}</td>
                <td className="px-5 py-3 text-xs text-gray-400">{a.date}</td>
                <td className="px-5 py-3">
                  <Link to="/advertiser/proposals" className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
                    צפה
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
