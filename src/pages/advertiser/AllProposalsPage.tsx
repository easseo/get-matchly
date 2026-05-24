import { useState } from "react";
import { Users, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, TrendingUp, Instagram } from "lucide-react";

const proposals = [
  {
    id: 1,
    campaign: "קמפיין אופנה קיץ 2026",
    creator: "נועה לוי",
    handle: "@noa_levy",
    avatar: "נ",
    reach: "124K",
    price: "₪1,800",
    date: "10 מרץ 2025",
    status: "pending",
    idea: "אני רוצה ליצור סדרת ריילס שמציגה את הקולקציה בסגנון יומיומי — בבית קפה, בפארק, בים. כל וידאו יסתיים עם קריאה לפעולה ברורה.",
    timeline: "3 ימי עבודה לאחר קבלת המוצרים",
  },
  {
    id: 2,
    campaign: "קולקציית יופי בר-קיימא",
    creator: "איתי כהן",
    handle: "@itay.cohen",
    avatar: "א",
    reach: "86K",
    price: "₪1,200",
    date: "12 מרץ 2025",
    status: "accepted",
    idea: "ביקורת מוצר אותנטית עם לפני ואחרי. אשתמש ב-Instagram Stories + פוסט קרוסל.",
    timeline: "שבוע",
  },
  {
    id: 3,
    campaign: "ביקורת גאדג'טים טק",
    creator: "שירה ברק",
    handle: "@shira_barak",
    avatar: "ש",
    reach: "85K",
    price: "₪2,100",
    date: "13 מרץ 2025",
    status: "pending",
    idea: "סקירה מעמיקה של 5 דקות עם השוואה למתחרים. אפרסם גם ב-YouTube Shorts.",
    timeline: "5 ימים",
  },
  {
    id: 4,
    campaign: "השקת אפליקציית כושר",
    creator: "דניאל מזרחי",
    handle: "@daniel_fit",
    avatar: "ד",
    reach: "210K",
    price: "₪3,500",
    date: "14 מרץ 2025",
    status: "declined",
    idea: "30 יום challenge עם האפליקציה. כל יום פוסט קצר.",
    timeline: "חודש",
  },
  {
    id: 5,
    campaign: "קידום ציוד טיולים",
    creator: "מיכל גולן",
    handle: "@michal.outdoors",
    avatar: "מ",
    reach: "67K",
    price: "₪1,500",
    date: "15 מרץ 2025",
    status: "pending",
    idea: "טיול בוקר עם הציוד — ריל אסתטי + Stories מאחורי הקלעים.",
    timeline: "3 ימים",
  },
];

const tabs = [
  { key: "all", label: "כל ההצעות" },
  { key: "pending", label: "ממתינות" },
  { key: "accepted", label: "התקבלו" },
  { key: "declined", label: "נדחו" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: "ממתין", color: "text-orange-600", bg: "bg-orange-50 border-orange-100", icon: Clock },
  accepted: { label: "התקבל", color: "text-green-600", bg: "bg-green-50 border-green-100", icon: CheckCircle },
  declined: { label: "נדחה", color: "text-red-500", bg: "bg-red-50 border-red-100", icon: XCircle },
};

export default function AllProposalsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = activeTab === "all" ? proposals : proposals.filter((p) => p.status === activeTab);

  const counts = {
    pending: proposals.filter((p) => p.status === "pending").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    declined: proposals.filter((p) => p.status === "declined").length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">כל ההצעות</h1>
        <p className="text-sm text-gray-500 mt-0.5">סקור הצעות שהגישו יוצרי תוכן לקמפיינים שלך</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
          <div className="text-2xl font-black text-gray-900">{counts.pending}</div>
          <div className="text-sm font-bold text-orange-500 mt-0.5">ממתינות לבדיקה</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm">
          <div className="text-2xl font-black text-gray-900">{counts.accepted}</div>
          <div className="text-sm font-bold text-green-500 mt-0.5">הצעות שאושרו</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm">
          <div className="text-2xl font-black text-gray-900">{counts.declined}</div>
          <div className="text-sm font-bold text-red-400 mt-0.5">הצעות שנדחו</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const s = statusConfig[p.status];
          const isOpen = expanded === p.id;
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : p.id)}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
                  {p.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-900">{p.creator}</span>
                    <span className="text-xs text-gray-400">{p.handle}</span>
                    <Instagram size={11} className="text-pink-400" />
                  </div>
                  <div className="text-xs text-gray-500 truncate">{p.campaign}</div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-5 text-xs text-gray-500 shrink-0">
                  <span className="flex items-center gap-1"><TrendingUp size={11} />{p.reach}</span>
                  <span className="font-bold text-gray-900 text-sm">{p.price}</span>
                  <span className="text-gray-400">{p.date}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${s.bg} ${s.color}`}>{s.label}</span>
                </div>

                {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
              </div>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs font-bold text-gray-500 mb-1">רעיון תוכן</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.idea}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs font-bold text-gray-500 mb-1">לוח זמנים</div>
                      <p className="text-sm text-gray-700">{p.timeline}</p>
                    </div>
                  </div>
                  {p.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
                        <CheckCircle size={14} className="inline-block ml-1" />
                        אשר הצעה
                      </button>
                      <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors">
                        <XCircle size={14} className="inline-block ml-1" />
                        דחה
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">אין הצעות בקטגוריה זו</p>
          </div>
        )}
      </div>
    </div>
  );
}
