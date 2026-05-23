import { useState } from "react";
import { PageHeader } from "@/components/app/KpiCard";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { toast } from "@/hooks/use-toast";
import { Instagram, Check } from "lucide-react";

const tabs = ["פרטים אישיים", "סושיאל", "אבטחה", "התראות", "תשלום"] as const;
type Tab = (typeof tabs)[number];

export default function CreatorProfile() {
  const { user } = useDemoAuth();
  const [tab, setTab] = useState<Tab>("פרטים אישיים");

  return (
    <>
      <PageHeader title="הגדרות פרופיל" subtitle="ניהול הפרופיל שלך כיוצר תוכן" />

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
          {tab === "פרטים אישיים" && (
            <form onSubmit={(e) => { e.preventDefault(); toast({ title: "הפרופיל עודכן" }); }} className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">פרטים אישיים</h2>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground font-black text-xl shadow-cta" style={{ background: "var(--gradient-brand)" }}>
                  {(user?.fullName || "U").slice(0, 1)}
                </div>
                <div>
                  <div className="font-bold">תמונת פרופיל</div>
                  <button type="button" className="text-xs font-bold text-primary mt-1">העלאת תמונה חדשה</button>
                </div>
              </div>
              <Field label="שם מלא" defaultValue={user?.fullName || ""} />
              <Field label="אימייל" type="email" defaultValue={user?.email || ""} />
              <Field label="טלפון" placeholder="050-1234567" />
              <label className="block">
                <span className="text-xs font-bold text-muted-foreground mb-1.5 block">קצת עליי</span>
                <textarea rows={3} placeholder="ספרו על עצמכם, התחום שלכם וסגנון התוכן" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </label>
              <button type="submit" className="px-5 py-2.5 rounded-xl text-primary-foreground font-bold shadow-cta" style={{ background: "var(--gradient-brand)" }}>שמירת שינויים</button>
            </form>
          )}
          {tab === "סושיאל" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">חשבונות סושיאל</h2>
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border">
                <Instagram className="w-6 h-6 text-pink-500" />
                <div className="flex-1">
                  <input defaultValue="@sarah.style" className="w-full bg-transparent text-sm font-bold focus:outline-none" />
                  <div className="text-[11px] text-muted-foreground font-semibold">125K עוקבים • 5.5% מעורבות</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" /> מאומת
                </span>
              </div>
              <button className="px-4 py-2 rounded-xl border border-border font-bold text-sm hover:bg-muted">+ חיבור פלטפורמה</button>
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
          {tab === "התראות" && (
            <div className="space-y-3 max-w-xl">
              <h2 className="text-lg font-bold mb-2">העדפות התראה</h2>
              {[
                ["התאמת קמפיין חדש", "מייל על קמפיינים שמתאימים לפרופיל"],
                ["עדכוני הצעות", "סטטוס ההצעות שהגשתם"],
                ["תזכורות תשלום", "התראות כשמשיכה זמינה"],
                ["טיפים שבועיים", "טיפים מאוצרים ליוצרים"],
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
          {tab === "תשלום" && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-lg font-bold">אמצעי תשלום</h2>
              <div className="border border-border rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold">PayPal</div>
                  <div className="text-[11px] text-muted-foreground font-semibold">demo@paypal.com</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">מחובר</span>
              </div>
              <h2 className="text-lg font-bold pt-2">מינימום משיכה</h2>
              <Field label="סכום מינימלי (₪)" type="number" defaultValue="50" />
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
