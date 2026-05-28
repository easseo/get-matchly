import { useState } from "react";
import { PageHeader } from "@/components/app/KpiCard";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { toast } from "@/hooks/use-toast";
import { Building2, CreditCard, Bell, Shield, Eye, Trash2, Edit2, Star, Check } from "lucide-react";

const tabs = [
  { id: "פרטי חברה",   label: "פרטי חברה",   icon: Building2 },
  { id: "תשלומים",     label: "תשלומים",     icon: CreditCard },
  { id: "התראות",      label: "התראות",      icon: Bell },
  { id: "אבטחה",       label: "אבטחה",       icon: Shield },
  { id: "פרטיות",      label: "פרטיות",      icon: Eye },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function ProfileSettings() {
  const { user } = useDemoAuth();
  const [tab, setTab] = useState<TabId>("פרטי חברה");

  return (
    <>
      <PageHeader title="הגדרות פרופיל" subtitle="ניהול החשבון, התשלום וההעדפות" />

      <div className="grid md:grid-cols-[200px_1fr] gap-5">
        <aside className="bg-white rounded-2xl border border-gray-100 p-2 h-fit shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full text-right px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2.5 ${
                tab === id ? "text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
              style={tab === id ? { background: "var(--gradient-brand)" } : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </aside>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          {tab === "פרטי חברה" && (
            <form onSubmit={(e) => { e.preventDefault(); toast({ title: "השינויים נשמרו" }); }} className="space-y-4 max-w-lg">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">פרטי החברה</h2>
                <p className="text-xs text-gray-400 mt-0.5">הפרטים יוצגו ביוצרי תוכן ובקמפיינים</p>
              </div>
              <Field label="שם החברה"  defaultValue={user?.fullName || ""} />
              <Field label="אימייל"    type="email" defaultValue={user?.email || ""} />
              <Field label="טלפון"     placeholder="050-1234567" />
              <Field label="ח.פ / ע.מ" placeholder="123456789" />
              <Field label="כתובת"     placeholder="רחוב, עיר" />
              <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md min-h-[44px]" style={{ background: "var(--gradient-brand)" }}>
                שמירת שינויים
              </button>
            </form>
          )}

          {tab === "תשלומים" && (
            <div className="space-y-5 max-w-lg">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">אמצעי תשלום</h2>
                <p className="text-xs text-gray-400 mt-0.5">כרטיסי האשראי השמורים לתשלום קמפיינים</p>
              </div>

              {/* Saved cards */}
              <div className="space-y-2.5">
                {[
                  { brand: "Visa",       last4: "4242", expiry: "06/28", isDefault: true },
                  { brand: "Mastercard", last4: "9876", expiry: "11/26", isDefault: false },
                ].map((card) => (
                  <div key={card.last4} className={`rounded-2xl p-4 flex items-center justify-between gap-3 border ${card.isDefault ? "border-primary/20 bg-primary/3" : "border-gray-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{card.brand} •••• {card.last4}</div>
                        <div className="text-[11px] text-gray-400 font-semibold">תוקף {card.expiry}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {card.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> ברירת מחדל
                        </span>
                      ) : (
                        <button className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1 px-2 py-1">
                          <Star className="w-3 h-3" /> הגדר כברירת מחדל
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!card.isDefault && (
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-200 font-bold text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors w-full justify-center min-h-[44px]">
                + הוספת כרטיס
              </button>
            </div>
          )}

          {tab === "התראות" && (
            <div className="space-y-3 max-w-lg">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">העדפות התראה</h2>
                <p className="text-xs text-gray-400 mt-0.5">בחרו על מה תרצו לקבל עדכונים</p>
              </div>
              {[
                { t: "הצעות חדשות",    d: "קבלו מייל על כל הצעה חדשה מיוצר תוכן" },
                { t: "הודעות מיוצרים", d: "התראה כשיוצר תוכן שולח הודעה חדשה" },
                { t: "סטטוס קמפיין",   d: "עדכונים על שינויים ואישורים בקמפיין" },
                { t: "ניוזלטר שבועי",  d: "טיפים ועדכוני פלטפורמה מדי שבוע" },
              ].map(({ t, d }, i) => (
                <label key={t} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{t}</div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-0.5">{d}</div>
                  </div>
                  <input type="checkbox" defaultChecked={i < 3} className="w-5 h-5 accent-primary ml-2" />
                </label>
              ))}
            </div>
          )}

          {tab === "אבטחה" && (
            <div className="space-y-5 max-w-lg">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">אבטחת חשבון</h2>
                <p className="text-xs text-gray-400 mt-0.5">עדכון סיסמה ואבטחת הכניסה</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  לאבטחה מקסימלית, מומלץ להשתמש בסיסמה ייחודית ולעדכן אחת ל-3 חודשים
                </p>
              </div>
              <Field label="סיסמה נוכחית" type="password" placeholder="••••••••" />
              <Field label="סיסמה חדשה"   type="password" placeholder="לפחות 8 תווים" />
              <Field label="אישור סיסמה"  type="password" placeholder="הזינו שוב" />
              <button className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md min-h-[44px]" style={{ background: "var(--gradient-brand)" }}>
                עדכון סיסמה
              </button>
            </div>
          )}

          {tab === "פרטיות" && (
            <div className="space-y-4 max-w-lg">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">הגדרות פרטיות</h2>
                <p className="text-xs text-gray-400 mt-0.5">שליטה על מה שמוצג ליוצרי תוכן</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                <p className="text-xs text-purple-800 font-semibold leading-relaxed">
                  פרופיל המפרסם גלוי ליוצרי תוכן בפלטפורמה. שקיפות עוזרת ליוצרים להחליט אם הקמפיין מתאים להם.
                </p>
              </div>
              {[
                { t: "פרופיל ציבורי",          d: "פרופיל החברה מופיע בחיפושים של יוצרי תוכן" },
                { t: "שיתוף נתוני ביצוע",       d: "אפשר לאוסף נתוני ביצועים מצטברים (אנונימי)" },
              ].map(({ t, d }) => (
                <label key={t} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <div className="font-bold text-sm text-gray-900">{t}</div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-0.5">{d}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary ml-2" />
                </label>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-gray-500 mb-1.5 block">{label}</span>
      <input
        {...rest}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors min-h-[44px]"
      />
    </label>
  );
}
