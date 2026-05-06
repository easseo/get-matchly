import { Sparkles, Megaphone, Users, Zap, Target, Heart, ArrowLeft, Check } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface DesktopLandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

export default function DesktopLanding({ onStart, onCreatorJoin }: DesktopLandingProps) {
  const goCreator = () => onCreatorJoin?.();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={matchlyIcon} alt="" className="h-12 w-12 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">Matchly</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider" dir="ltr">
                INFLUENCE TODAY. MATCH NOW.
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <a href="#how" className="px-4 py-2 text-sm font-bold text-foreground/70 hover:text-foreground transition-smooth">איך זה עובד</a>
            <a href="#features" className="px-4 py-2 text-sm font-bold text-foreground/70 hover:text-foreground transition-smooth">למה Matchly</a>
            <a href="#examples" className="px-4 py-2 text-sm font-bold text-foreground/70 hover:text-foreground transition-smooth">דוגמאות</a>
            <button
              onClick={goCreator}
              className="text-sm font-bold text-foreground/80 px-4 py-2 rounded-full border border-border tap-scale hover:bg-muted"
            >
              כניסת יוצרים
            </button>
            <button
              onClick={onStart}
              className="text-sm font-bold text-primary-foreground px-5 py-2.5 rounded-full bg-brand shadow-cta tap-scale"
            >
              התחילו קמפיין
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground">
        <div
          className="absolute inset-0 opacity-95 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 0%, hsl(var(--brand-yellow) / 0.55), transparent 45%), radial-gradient(circle at 85% 10%, hsl(var(--brand-pink) / 0.7), transparent 50%), radial-gradient(circle at 50% 100%, hsl(var(--brand-purple) / 0.8), transparent 55%), linear-gradient(180deg, hsl(var(--brand-orange) / 0.35), hsl(var(--brand-purple) / 0.6))",
          }}
        />
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full opacity-40 blur-3xl animate-float pointer-events-none" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full opacity-40 blur-3xl animate-float pointer-events-none" style={{ background: "hsl(var(--brand-purple))", animationDelay: "1.5s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 grid grid-cols-2 gap-12 items-center text-primary-foreground">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 mb-6 animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-semibold text-white/95">פלטפורמה לחיבור יוצרי תוכן לבעלי עסקים ב-60 שניות</span>
            </div>

            <h1 className="font-black tracking-tight mb-5 animate-fade-in-up text-6xl leading-[1.05]" style={{ animationDelay: "0.1s" }}>
              <span className="block">3 יוצרי תוכן</span>
              <span className="block">
                שמתאימים{" "}
                <span style={{ background: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-pink)))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  בדיוק
                </span>
              </span>
              <span className="block">לקמפיין שלך</span>
            </h1>

            <p className="text-lg text-white/85 font-medium mb-8 animate-fade-in-up leading-relaxed max-w-lg" style={{ animationDelay: "0.2s" }}>
              פותחים קמפיין ומקבלים 3 התאמות חכמות תוך פחות מדקה. בלי לחפש שעות, בלי לנחש - רק התאמות מדויקות.
            </p>

            <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-extrabold text-foreground bg-card rounded-full shadow-cta-lg tap-scale"
              >
                <Megaphone className="w-5 h-5" />
                אני מפרסם
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goCreator}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-extrabold text-primary-foreground bg-white/15 backdrop-blur border border-white/30 rounded-full tap-scale"
              >
                <Heart className="w-5 h-5" />
                אני יוצר תוכן
              </button>
            </div>
          </div>

          {/* Product preview card */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="absolute -inset-2 rounded-[2.5rem] opacity-60 blur-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }} />
            <div className="relative bg-card text-foreground rounded-[2rem] p-6 shadow-cta-lg border border-white/40">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand grid place-items-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground leading-none">קמפיין פעיל</div>
                    <div className="text-base font-extrabold leading-tight mt-1">השקת סרום פנים</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 ltr-num">3/3 התאמות</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "נועה לוי", meta: "Instagram · 124K", score: 94, gradient: "from-pink-400 to-purple-500", avatar: "נ" },
                  { name: "איתי כהן", meta: "Instagram · 86K", score: 91, gradient: "from-orange-400 to-pink-500", avatar: "א" },
                  { name: "שירה ברק", meta: "Instagram · 85K", score: 89, gradient: "from-yellow-400 to-orange-500", avatar: "ש" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border/60">
                    <div className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} grid place-items-center text-primary-foreground font-black shadow-soft`}>
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-sm font-extrabold leading-tight">{c.name}</div>
                      <div className="text-xs text-muted-foreground font-semibold ltr-num leading-tight mt-0.5">{c.meta}</div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: "linear-gradient(90deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }} />
                      </div>
                      <span className="text-sm font-black ltr-num" style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        {c.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold">הותאם תוך</span>
                <span className="text-sm font-black ltr-num text-brand">47 שניות</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-brand-soft">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">איך זה עובד?</h2>
            <p className="text-base text-muted-foreground font-medium">ארבעה צעדים פשוטים מקמפיין להתאמה</p>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {[
              { n: "1", t: "פותחים קמפיין", d: "מגדירים מטרה, תקציב, פלטפורמה וקהל יעד." },
              { n: "2", t: "אנחנו מנתחים", d: "המערכת מדרגת יוצרים לפי התאמה אמיתית לקמפיין." },
              { n: "3", t: "מקבלים 3 התאמות", d: "במקום לחפש שעות - מקבלים 3 יוצרים מדויקים." },
              { n: "4", t: "מתחילים שיתוף פעולה", d: "שולחים הצעה ליוצר ומתקדמים לקמפיין." },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-3xl p-6 shadow-soft border border-border hover:shadow-card hover:-translate-y-1 transition-smooth">
                <div className="w-14 h-14 rounded-2xl bg-brand text-primary-foreground grid place-items-center font-black text-xl shadow-glow mb-4">
                  <span className="leading-none tabular-nums" style={{ direction: "ltr" }}>{s.n}</span>
                </div>
                <h3 className="font-extrabold text-lg mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-wider uppercase text-brand mb-2">למה Matchly</span>
            <h2 className="text-4xl font-black mb-3 leading-tight">היתרונות שעושים את ההבדל</h2>
            <p className="text-base text-muted-foreground font-medium">טכנולוגיה שמייצרת התאמות מדויקות</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { i: <Zap className="w-6 h-6" strokeWidth={2.5} />, t: "חוסך זמן", d: "בלי לעבור ידנית על מאות פרופילים.", badge: "Fast Setup", accent: "linear-gradient(135deg, hsl(var(--brand-orange)), hsl(var(--brand-pink)))" },
              { i: <Sparkles className="w-6 h-6" strokeWidth={2.5} />, t: "בחירה חכמה", d: "התאמות לפי תחום, תקציב, מיקום ופלטפורמה.", badge: "AI Matching", accent: "linear-gradient(135deg, hsl(var(--brand-purple)), hsl(var(--brand-pink)))" },
              { i: <Target className="w-6 h-6" strokeWidth={2.5} />, t: "פחות ניחושים", d: "כל התאמה עם ציון התאמה והסבר.", badge: "Smart Scoring", accent: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" },
              { i: <Users className="w-6 h-6" strokeWidth={2.5} />, t: "גם ליוצרים", d: "יוצרים מצטרפים לבטא ומקבלים פניות.", badge: "Creator Beta", accent: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))" },
            ].map((f) => (
              <div key={f.t} className="group relative bg-card rounded-3xl p-6 shadow-soft border border-border/70 transition-smooth hover:shadow-card hover:-translate-y-1 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none" style={{ background: f.accent }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground shadow-soft" style={{ background: f.accent }}>
                      {f.i}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full bg-muted text-foreground/70 ltr-num">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg mb-1.5 text-foreground leading-tight">{f.t}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-snug">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Match examples */}
      <section id="examples" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-wider uppercase text-brand mb-2">דוגמאות התאמה</span>
            <h2 className="text-4xl font-black mb-3 leading-tight">ככה נראית התאמה אמיתית</h2>
            <p className="text-base text-muted-foreground font-medium">תוצאות לדוגמה מקמפיינים שרצו ב-Matchly</p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              { campaign: "השקת סרום פנים חדש", niche: "ביוטי", creator: "נועה לוי", avatar: "נ", gradient: "from-pink-400 to-purple-500", accent: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))", score: 94, platform: "Instagram", budget: "₪1,500 - ₪3,000", reasons: ["קהל נשי 25-34 בישראל", "תוכן ביוטי עם 6.2% engagement", "ניסיון עם 12 מותגי קוסמטיקה"] },
              { campaign: "פתיחת מסעדה בתל אביב", niche: "מסעדנות", creator: "איתי כהן", avatar: "א", gradient: "from-orange-400 to-pink-500", accent: "linear-gradient(135deg, hsl(var(--brand-orange)), hsl(var(--brand-pink)))", score: 91, platform: "Instagram", budget: "₪800 - ₪1,800", reasons: ["פוד בלוגר מתל אביב", "קהל מקומי רלוונטי", "שיתופי פעולה קודמים עם מסעדות"] },
              { campaign: "קידום אפליקציית כושר", niche: "כושר", creator: "שירה ברק", avatar: "ש", gradient: "from-yellow-400 to-orange-500", accent: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))", score: 89, platform: "Instagram", budget: "₪2,000 - ₪4,000", reasons: ["מאמנת כושר עם 85K עוקבים", "engagement גבוה בסרטוני אימון", "התאמה לקהל היעד 22-40"] },
            ].map((m) => (
              <article key={m.campaign} className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden flex flex-col hover:shadow-card hover:-translate-y-1 transition-smooth">
                <div className="px-6 pt-6 pb-4 border-b border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">קמפיין</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground/70">{m.niche}</span>
                  </div>
                  <h3 className="font-extrabold text-lg leading-tight">{m.campaign}</h3>
                </div>

                <div className="px-6 py-5 flex items-center gap-3">
                  <div className={`shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-primary-foreground font-black text-xl shadow-soft`}>
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">היוצר המומלץ</div>
                    <div className="font-extrabold text-base leading-tight">{m.creator}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-0.5 ltr-num">{m.platform} · {m.budget}</div>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className="text-2xl font-black ltr-num leading-none" style={{ background: m.accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {m.score}%
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">התאמה</div>
                  </div>
                </div>

                <div className="px-6 pb-4 flex-1">
                  <ul className="space-y-2">
                    {m.reasons.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                        <span className="text-foreground/80 font-medium leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={onStart}
                    className="w-full py-3 rounded-full bg-foreground text-background font-extrabold text-sm tap-scale inline-flex items-center justify-center gap-2"
                  >
                    פתחו קמפיין דומה
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-brand rounded-[2.5rem] p-12 shadow-cta-lg text-primary-foreground text-center">
            <h2 className="text-4xl font-black mb-4 leading-tight">
              מוכנים למצוא את שיתוף הפעולה הבא שלכם?
            </h2>
            <p className="text-base font-medium mb-8 opacity-95 leading-relaxed max-w-2xl mx-auto">
              בין אם אתם עסק שמחפש יוצרים או יוצרים שמחפשים קמפיינים - Matchly מחברת אתכם נכון.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-card text-foreground font-extrabold text-base tap-scale shadow-soft"
              >
                <Megaphone className="w-5 h-5" />
                אני מפרסם
              </button>
              <button
                onClick={goCreator}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-transparent border-2 border-white/70 text-primary-foreground font-extrabold text-base tap-scale"
              >
                <Heart className="w-5 h-5" />
                אני יוצר תוכן
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src={matchlyIcon} alt="" className="h-6 w-6 object-contain" loading="lazy" />
          <span className="text-base font-extrabold tracking-tight text-foreground">Matchly</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium tracking-wider" dir="ltr">
          INFLUENCE TODAY. MATCH NOW.
        </p>
      </footer>
    </div>
  );
}
