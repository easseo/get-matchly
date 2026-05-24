import { useState } from "react";
import { Star, Instagram, Clock, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const proposals = [
  {
    id: 1, avatar: "נ", name: "נועה לוי", handle: "@noa_levy",
    campaign: "קמפיין קידום מוצרי יופי", rating: 4.9, followers: "35.4K", engagement: "5.5%",
    price: "₪200", days: 5, status: "pending",
    message: "שלום! אני יוצרת תוכן ביוטי עם קהל נשי רלוונטי. הרילס שלי מגיעים לממוצע של 50K צפיות. שמחה לשתף פעולה!",
    pastWork: ["קמפיין סרום פנים EcoGlow", "השקת קולקציית אופנה StyleCo"],
  },
  {
    id: 2, avatar: "א", name: "איתי כהן", handle: "@itay.cohen",
    campaign: "קמפיין קידום מוצרי יופי", rating: 4.7, followers: "86K", engagement: "4.2%",
    price: "₪350", days: 7, status: "pending",
    message: "מצאתי את הקמפיין שלכם מרתק מאוד. יש לי ניסיון עשיר בתוכן ביוטי ואני בטוח שאוכל להביא תוצאות מצוינות.",
    pastWork: ["קמפיין FitLife", "השקת TechNova"],
  },
  {
    id: 3, avatar: "ש", name: "שירה ברק", handle: "@shira_barak",
    campaign: "קמפיין כושר ובריאות", rating: 4.8, followers: "52K", engagement: "6.1%",
    price: "₪280", days: 5, status: "accepted",
    message: "אני מאמנת כושר עם קהל מאוד מעורב. מוכנה להתחיל מיד!",
    pastWork: ["קמפיין Fitness Pro", "השקת NutriLife"],
  },
  {
    id: 4, avatar: "ד", name: "דן גולדברג", handle: "@dan.goldberg",
    campaign: "קמפיין גיימינג טק", rating: 4.5, followers: "28K", engagement: "3.8%",
    price: "₪150", days: 10, status: "declined",
    message: "גיימר ומנהל תוכן טכנולוגי עם קהל צעיר ומעורב.",
    pastWork: ["קמפיין GamePro", "ביקורת אביזרים"],
  },
];

const tabs = ["כל ההצעות", "ממתינות", "התקבלו", "נדחו"];
const statusMap: Record<string, string> = { pending: "ממתינות", accepted: "התקבלו", declined: "נדחו" };

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState("כל ההצעות");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = proposals.filter((p) => {
    if (activeTab === "כל ההצעות") return true;
    return statusMap[p.status] === activeTab;
  });

  const accepted = proposals.filter((p) => p.status === "accepted").length;
  const declined = proposals.filter((p) => p.status === "declined").length;
  const pending = proposals.filter((p) => p.status === "pending").length;

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-gray-900">ההצעות שלי</h1>
        <p className="text-sm text-gray-500 mt-0.5">עיינו בהצעות שהגשתם למותגים שונים</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "להחלטה", value: `₪${pending * 200}`, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
          { label: "התקבלו", value: String(accepted), color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "נדחו", value: String(declined), color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-4 border ${s.border} shadow-sm`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {p.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{p.name}</span>
                    <span className="text-xs text-gray-400">{p.handle}</span>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 mr-1">
                      <Star size={11} className="fill-amber-400" /> {p.rating}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.campaign}</div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Instagram size={11} /> {p.followers}
                    </span>
                    <span className="text-xs text-gray-400">Engagement: {p.engagement}</span>
                    <span className="text-xs font-bold text-gray-800">₪ {p.price}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {p.days} ימים
                    </span>
                  </div>
                </div>

                {/* Status + Expand */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      p.status === "pending" ? "bg-orange-50 text-orange-500 border border-orange-100" :
                      p.status === "accepted" ? "bg-green-50 text-green-600 border border-green-100" :
                      "bg-red-50 text-red-500 border border-red-100"
                    }`}
                  >
                    {statusMap[p.status]}
                  </span>
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    {expanded === p.id ? "סגור" : "פרטים"}
                    <ChevronDown size={12} className={`transition-transform ${expanded === p.id ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded */}
            {expanded === p.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-1">הודעת הצעה</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{p.message}</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-1.5">עבודות קודמות</div>
                  <div className="flex gap-2 flex-wrap">
                    {p.pastWork.map((w) => (
                      <span key={w} className="text-xs font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-600">{w}</span>
                    ))}
                  </div>
                </div>
                {p.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
                      <CheckCircle2 size={14} /> אישור
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                      <XCircle size={14} /> דחייה
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
