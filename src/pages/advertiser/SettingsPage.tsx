import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Building2, Bell, CreditCard, Lock, Globe } from "lucide-react";

const subNav = [
  { key: "profile", label: "פרטי העסק", icon: Building2 },
  { key: "notifications", label: "התראות", icon: Bell },
  { key: "security", label: "אבטחה", icon: Lock },
  { key: "billing", label: "חיוב ותשלום", icon: CreditCard },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative transition-colors ${on ? "bg-primary" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-1" : "right-1"}`} />
    </button>
  );
}

export default function AdvertiserSettingsPage() {
  const { name } = useUser();
  const [active, setActive] = useState("profile");
  const [notifs, setNotifs] = useState({ newProposal: true, proposalAccepted: true, messages: true, payments: false });
  const toggle = (k: keyof typeof notifs) => setNotifs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">הגדרות פרופיל</h1>
        <p className="text-sm text-gray-500 mt-0.5">ניהול פרטי החשבון העסקי שלך</p>
      </div>

      <div className="flex gap-5">
        {/* Sub Nav */}
        <div className="w-44 shrink-0 space-y-1">
          {subNav.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-right ${
                active === item.key ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
              style={active === item.key ? { background: "var(--gradient-brand)" } : {}}
            >
              <item.icon size={15} className="shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {active === "profile" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-extrabold text-gray-900 mb-4">פרטי העסק</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">שם העסק</label>
                  <input defaultValue={name} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">שם פרטי</label>
                    <input defaultValue="אייל" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">שם משפחה</label>
                    <input defaultValue="אסיאו" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">אימייל עסקי</label>
                  <input type="email" defaultValue="business@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1"><Globe size={12} />אתר</label>
                  <input defaultValue="https://example.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">תיאור העסק</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none" defaultValue="מותג אופנה ישראלי המתמחה בבגדי קיץ איכותיים." />
                </div>
                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
                  שמור שינויים
                </button>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-extrabold text-gray-900 mb-4">הגדרות התראות</h2>
              <div className="space-y-4">
                {[
                  { key: "newProposal" as const, label: "הצעה חדשה", desc: "כאשר יוצר מגיש הצעה לקמפיין שלך" },
                  { key: "proposalAccepted" as const, label: "אישור הצעה", desc: "כאשר יוצר מקבל את האישור" },
                  { key: "messages" as const, label: "הודעות חדשות", desc: "כאשר יוצר שולח הודעה" },
                  { key: "payments" as const, label: "עדכוני תשלום", desc: "קבלות ועדכוני תשלום" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <Toggle on={notifs[item.key]} onToggle={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "security" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-extrabold text-gray-900 mb-4">אבטחה</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">סיסמה נוכחית</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">סיסמה חדשה</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">אימות סיסמה</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
                  עדכן סיסמה
                </button>
              </div>
            </div>
          )}

          {active === "billing" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-extrabold text-gray-900 mb-4">חיוב ותשלום</h2>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between mb-4">
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
              <button className="text-sm font-bold text-primary hover:underline">+ הוסף כרטיס</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
