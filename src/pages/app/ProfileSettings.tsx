import { useState } from "react";
import { PageHeader } from "@/components/app/KpiCard";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { toast } from "@/hooks/use-toast";

const tabs = ["פרטי חברה", "תשלומים", "התראות", "אבטחה", "פרטיות"] as const;
type Tab = (typeof tabs)[number];

export default function ProfileSettings() {
  const { user } = useDemoAuth();
  const [tab, setTab] = useState<Tab>("פרטי חברה");

  return (
    <>
      <PageHeader title="הגדרות פרופיל" subtitle="נהלו את החשבון, התשלום וההתראות" />

      <div className="grid md:grid-cols-[220px_1fr] gap-5">
        <aside className="bg-card rounded-2xl border border-border p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                tab === t ? "text-primary-foreground shadow-cta" : "text-foreground/70 hover:bg-muted"
              }`}
              style={tab === t ? { background: "var(--gradient-brand)" } : undefined}
            >
              {t}
            </button>
          ))}
        </aside>

        <section className="bg-card rounded-3xl border border-border shadow-soft p-6">
          {tab === "פרטי חברה" && (
            <form onSubmit={(e) => { e.preventDefault(); toast({ title: "השינויים נשמרו" }); }} className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">פרטי החברה</h2>
              <Field label="שם החברה" defaultValue={user?.fullName || ""} />
              <Field label="אימייל" type="email" defaultValue={user?.email || ""} />
              <Field label="טלפון" placeholder="050-1234567" />
              <Field label="ח.פ / ע.מ" placeholder="123456789" />
              <Field label="כתובת" placeholder="רחוב, עיר" />
              <button type="submit" className="px-5 py-2.5 rounded-xl text-primary-foreground font-bold shadow-cta" style={{ background: "var(--gradient-brand)" }}>
                שמירת שינויים
              </button>
            </form>
          )}
          {tab === "תשלומים" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">אמצעי תשלום</h2>
              <div className="border border-border rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">Visa •••• 4242</div>
                  <div className="text-[11px] text-muted-foreground font-semibold">תוקף 06/28</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">ברירת מחדל</span>
              </div>
              <button className="px-4 py-2 rounded-xl border border-border font-bold text-sm hover:bg-muted">+ הוספת כרטיס</button>
            </div>
          )}
          {tab === "התראות" && (
            <div className="space-y-3 max-w-xl">
              <h2 className="text-lg font-bold mb-2">העדפות התראה</h2>
              {[
                ["הצעות חדשות", "קבלו מייל על כל הצעה חדשה"],
                ["הודעות מיוצרים", "התראה על הודעות חדשות"],
                ["סטטוס קמפיין", "עדכונים על שינויים בקמפיין"],
                ["ניוזלטר שבועי", "טיפים והצעות מאוצרות"],
              ].map(([t, d], i) => (
                <label key={t} className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/40">
                  <div>
                    <div className="font-bold text-sm">{t}</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">{d}</div>
                  </div>
                  <input type="checkbox" defaultChecked={i < 3} className="w-5 h-5 accent-primary" />
                </label>
              ))}
            </div>
          )}
          {tab === "אבטחה" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">החלפת סיסמה</h2>
              <Field label="סיסמה נוכחית" type="password" />
              <Field label="סיסמה חדשה" type="password" />
              <Field label="אישור סיסמה" type="password" />
              <button className="px-5 py-2.5 rounded-xl text-primary-foreground font-bold shadow-cta" style={{ background: "var(--gradient-brand)" }}>עדכון סיסמה</button>
            </div>
          )}
          {tab === "פרטיות" && (
            <div className="space-y-3 max-w-xl">
              <h2 className="text-lg font-bold mb-2">הגדרות פרטיות</h2>
              {[
                ["פרופיל ציבורי", "פרופיל החברה מופיע בחיפושים"],
                ["שיתוף נתוני קמפיין", "התרת חשיפה לנתוני ביצועים מצטברים"],
              ].map(([t, d]) => (
                <label key={t} className="flex items-center justify-between p-3.5 rounded-xl border border-border">
                  <div>
                    <div className="font-bold text-sm">{t}</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">{d}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
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
      <span className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</span>
      <input
        {...rest}
        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}
