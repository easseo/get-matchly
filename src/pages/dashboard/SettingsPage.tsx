import { useState } from "react";
import { User, Share2, Shield, Bell, CreditCard, Upload, Eye, EyeOff, CheckCircle2, Twitter, Plus } from "lucide-react";

const subNav = [
  { id: "profile", label: "מידע אישי", icon: User },
  { id: "social", label: "רשתות חברתיות", icon: Share2 },
  { id: "security", label: "אבטחה", icon: Shield },
  { id: "notifications", label: "התראות", icon: Bell },
  { id: "payments", label: "שיטות תשלום", icon: CreditCard },
];

function ProfileInfo() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-extrabold text-gray-900">מידע אישי</h2>
        <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <Upload size={13} /> עריכה
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: "var(--gradient-brand)" }}>א</div>
        <div>
          <button className="text-sm font-semibold text-primary hover:underline block mb-0.5">העלה תמונה חדשה</button>
          <div className="text-xs text-gray-400">JPG, PNG עד 5MB</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "שם פרטי", value: "אייל", placeholder: "שם פרטי" },
          { label: "שם משפחה", value: "אסיאו", placeholder: "שם משפחה" },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
            <input
              defaultValue={f.value}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary transition-colors bg-gray-50"
            />
          </div>
        ))}
      </div>
      {[
        { label: "כתובת אימייל", value: "eyal@matchly.com", type: "email" },
        { label: "מספר טלפון", value: "+972 50-123-4567", type: "tel" },
        { label: "עיר / מדינה", value: "תל אביב, ישראל", type: "text" },
      ].map((f) => (
        <div key={f.label}>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
          <input
            defaultValue={f.value}
            type={f.type}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary transition-colors bg-gray-50"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">ביו</label>
        <textarea
          rows={3}
          placeholder="ספר למפרסמים על עצמך..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-primary transition-colors bg-gray-50 resize-none"
        />
      </div>

      <button
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--gradient-brand)" }}
      >
        שמור שינויים
      </button>
    </div>
  );
}

function SocialMedia() {
  return (
    <div className="space-y-5">
      <h2 className="font-extrabold text-gray-900">חשבונות רשתות חברתיות</h2>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Instagram</label>
        <div className="flex gap-3">
          <input
            defaultValue="@example.user"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary transition-colors bg-gray-50"
          />
          <button className="px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            אמת
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
          <CheckCircle2 size={12} className="text-green-500" />
          17K עוקבים · engagement 5.5%
        </div>
      </div>
      <button
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--gradient-brand)" }}
      >
        שמור שינויים
      </button>
    </div>
  );
}

function Security() {
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-gray-900 mb-4">שינוי סיסמה</h2>
        <div className="space-y-3">
          {[
            { label: "סיסמה נוכחית", key: "current" as const },
            { label: "סיסמה חדשה", key: "newP" as const },
            { label: "אישור סיסמה חדשה", key: "confirm" as const },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{f.label}</label>
              <div className="relative">
                <input
                  type={show[f.key] ? "text" : "password"}
                  placeholder="הזן סיסמה..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-primary transition-colors bg-gray-50 pl-10"
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShow((p) => ({ ...p, [f.key]: !p[f.key] }))}
                >
                  {show[f.key] ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-gray-400" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-brand)" }}
        >
          עדכן סיסמה
        </button>
      </div>

      <div className="pt-5 border-t border-gray-100">
        <h2 className="font-extrabold text-gray-900 mb-1">אימות דו-שלבי</h2>
        <p className="text-sm text-gray-400 mb-3">נהל את שכבות האבטחה הנוספות</p>
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div>
            <div className="font-semibold text-sm text-gray-800">הפעל אימות דו-שלבי</div>
            <div className="text-xs text-gray-400">הגן על חשבונך עם 2FA</div>
          </div>
          <button
            onClick={() => setTwoFA(!twoFA)}
            className={`w-11 h-6 rounded-full transition-colors relative ${twoFA ? "bg-primary" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${twoFA ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-100">
        <h2 className="font-extrabold text-gray-900 mb-3">סשנים פעילים</h2>
        <div className="space-y-2">
          {[
            { device: "MacBook Pro – Chrome", location: "תל אביב, ישראל", time: "פעיל עכשיו", current: true },
            { device: "iPhone – Safari", location: "תל אביב, ישראל", time: "לפני שנה", current: false },
          ].map((s) => (
            <div key={s.device} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <div className="font-semibold text-sm text-gray-800">{s.device}</div>
                <div className="text-xs text-gray-400">{s.location} · {s.time}</div>
              </div>
              <button className="text-xs font-bold text-red-500 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
                בטל
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const [toggles, setToggles] = useState({
    newCampaigns: true, transactions: true, meetings: true, updates: true,
    opportunities: false, tips: false,
  });

  const items: { key: keyof typeof toggles; label: string; desc: string }[] = [
    { key: "newCampaigns", label: "התאמות קמפיינים חדשות", desc: "קבל עדכונים על קמפיינים מתאימים לפרופיל שלך" },
    { key: "transactions", label: "התראות עסקאות", desc: "פעילות תשלומים ועדכוני עסקאות" },
    { key: "meetings", label: "פגישות", desc: "תזכורות ואישורי פגישות" },
    { key: "updates", label: "חדשות ועדכונים", desc: "עדכוני פלטפורמה ותכונות חדשות" },
    { key: "opportunities", label: "הזדמנויות שבועיות", desc: "הזדמנויות קמפיינים נבחרות נשלחות שבועית" },
    { key: "tips", label: "טיפים ומשאבים", desc: "טיפים ליוצרים ועדכוני פלטפורמה" },
  ];

  return (
    <div>
      <h2 className="font-extrabold text-gray-900 mb-1">התראות אימייל</h2>
      <p className="text-sm text-gray-400 mb-5">בחר אילו אימיילים תרצה לקבל</p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div>
              <div className="font-semibold text-sm text-gray-800">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
            </div>
            <button
              onClick={() => setToggles((p) => ({ ...p, [item.key]: !p[item.key] }))}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${toggles[item.key] ? "bg-primary" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${toggles[item.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-gray-900 mb-1">שיטות תשלום</h2>
        <p className="text-sm text-gray-400 mb-4">נהל כיצד לקבל תשלומים</p>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Twitter size={16} className="text-blue-500" />
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-800">PayPal</div>
              <div className="text-xs text-gray-400">john@example.com</div>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">מחובר</span>
        </div>
        <button className="flex items-center gap-2 mt-3 text-sm font-bold text-primary hover:underline">
          <Plus size={14} /> הוסף שיטת תשלום
        </button>
      </div>

      <div className="pt-5 border-t border-gray-100">
        <h2 className="font-extrabold text-gray-900 mb-1">מידע מס</h2>
        <p className="text-sm text-gray-400 mb-4">נהל את פרטי המס שלך להכנסות</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">מספר עוסק / ח.פ.</label>
            <input
              placeholder="הזן מספר..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">שם עסק (אופציונלי)</label>
            <input
              placeholder="שם עסק..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-gray-50"
            />
          </div>
        </div>
        <button
          className="mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--gradient-brand)" }}
        >
          שמור מידע מס
        </button>
      </div>

      <div className="pt-5 border-t border-gray-100">
        <h2 className="font-extrabold text-gray-900 mb-1">הגדרות משיכה</h2>
        <p className="text-sm text-gray-400 mb-3">הגדר את העדפות התשלום שלך</p>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">סכום משיכה מינימלי (₪)</label>
          <input
            defaultValue="50"
            type="number"
            className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-gray-50"
          />
          <div className="text-xs text-gray-400 mt-1">משיכה אוטומטית כשהיתרה מגיעה לסכום זה</div>
        </div>
      </div>
    </div>
  );
}

const sections: Record<string, React.ReactNode> = {
  profile: <ProfileInfo />,
  social: <SocialMedia />,
  security: <Security />,
  notifications: <Notifications />,
  payments: <Payments />,
};

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-gray-900">הגדרות פרופיל</h1>
      </div>

      <div className="flex gap-6">
        {/* Sub nav */}
        <div className="w-48 shrink-0 space-y-0.5">
          {subNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-right ${
                active === item.id ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={active === item.id ? { background: "var(--gradient-brand)" } : {}}
            >
              <item.icon size={15} className="shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {sections[active]}
        </div>
      </div>
    </div>
  );
}
