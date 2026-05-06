import { Sparkles, Megaphone, Users, Zap, Target, Lightbulb, Heart, ArrowLeft, Check } from "lucide-react";

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  const goCreator = () => onCreatorJoin?.();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-brand flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-brand">Matchly</span>
          </div>
          <button
            onClick={goCreator}
            className="text-xs font-bold text-foreground/70 px-3 py-1.5 rounded-full border border-border tap-scale"
          >
            כניסת יוצרים
          </button>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative bg-mesh px-5 pt-8 pb-10 text-center overflow-hidden">
        <div className="absolute top-10 -right-10 w-44 h-44 rounded-full bg-brand opacity-30 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-44 h-44 rounded-full bg-brand opacity-20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border shadow-soft mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[11px] font-semibold text-muted-foreground">חכם · מהיר · מדויק</span>
          </div>

          <h1 className="font-black tracking-tight mb-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="block text-4xl sm:text-5xl text-foreground leading-[1.05]">מחברים בין</span>
            <span className="block text-4xl sm:text-5xl leading-[1.05] mt-1">
              <span className="text-foreground">עסקים ל</span>
              <span className="text-brand">יוצרי תוכן</span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-medium mb-6 animate-fade-in-up px-2 leading-relaxed" style={{ animationDelay: "0.2s" }}>
            הדרך החכמה למצוא שיתופי פעולה שמתאימים לקמפיין שלך - תוך דקות.
          </p>

          <div className="flex flex-col gap-2.5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={onStart}
              className="w-full inline-flex items-center justify-center gap-2 py-4 text-base font-extrabold text-primary-foreground bg-brand rounded-full shadow-cta-lg tap-scale"
            >
              <Megaphone className="w-5 h-5" />
              אני מפרסם
            </button>
            <button
              onClick={goCreator}
              className="w-full inline-flex items-center justify-center gap-2 py-4 text-base font-extrabold text-foreground bg-card border-2 border-border rounded-full shadow-soft tap-scale"
            >
              <Heart className="w-5 h-5" style={{ color: "hsl(var(--brand-pink))" }} />
              אני יוצר תוכן
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-7 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { num: "60״", label: "שניות בלבד" },
              { num: "3", label: "יוצרים נבחרים" },
              { num: "92%", label: "דיוק התאמה" },
            ].map((s) => (
              <div key={s.label} className="bg-card/80 backdrop-blur rounded-2xl p-2.5 shadow-soft border border-border">
                <div className="text-lg font-black text-brand ltr-num">{s.num}</div>
                <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Audience cards */}
      <section className="px-5 py-10 space-y-4">
        <AudienceCard
          gradient="linear-gradient(135deg, hsl(var(--brand-purple)) 0%, hsl(var(--brand-pink)) 100%)"
          icon={<Heart className="w-6 h-6" />}
          title="ליוצרי תוכן"
          text="קבלו הזדמנויות לשיתופי פעולה עם עסקים שמתאימים לקהל שלכם."
          cta="הצטרפו כיוצרים"
          onClick={goCreator}
        />
        <AudienceCard
          gradient="linear-gradient(135deg, hsl(var(--brand-orange)) 0%, hsl(var(--brand-pink)) 100%)"
          icon={<Megaphone className="w-6 h-6" />}
          title="למפרסמים"
          text="פתחו קמפיין וקבלו 3 יוצרים שמתאימים בדיוק למטרה, לתקציב ולקהל שלכם."
          cta="התחילו קמפיין"
          onClick={onStart}
        />
      </section>

      {/* 3. How it works */}
      <section className="px-5 py-10 bg-brand-soft">
        <h2 className="text-3xl font-black text-center mb-2">איך זה עובד?</h2>
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">ארבעה צעדים פשוטים</p>
        <div className="space-y-3">
          {[
            { n: "1", t: "פותחים קמפיין", d: "מגדירים מטרה, תקציב, פלטפורמה וקהל יעד." },
            { n: "2", t: "אנחנו מנתחים", d: "המערכת מדרגת יוצרים לפי התאמה אמיתית לקמפיין." },
            { n: "3", t: "מקבלים 3 התאמות", d: "במקום לחפש שעות - מקבלים 3 יוצרים מדויקים." },
            { n: "4", t: "מתחילים שיתוף פעולה", d: "שולחים הצעה ליוצר ומתקדמים לקמפיין." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 bg-card rounded-3xl p-4 shadow-soft border border-border">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-brand text-primary-foreground grid place-items-center font-black text-lg shadow-glow">
                <span className="leading-none tabular-nums" style={{ direction: "ltr" }}>{s.n}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-base mb-0.5">{s.t}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features */}
      <section className="px-5 py-10">
        <div className="text-center mb-7">
          <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-brand mb-2">למה Matchly</span>
          <h2 className="text-3xl font-black mb-2 leading-tight">היתרונות שעושים את ההבדל</h2>
          <p className="text-sm text-muted-foreground font-medium">טכנולוגיה שמייצרת התאמות מדויקות</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              i: <Zap className="w-[18px] h-[18px]" strokeWidth={2.5} />,
              t: "חוסך זמן",
              d: "בלי לעבור ידנית על מאות פרופילים.",
              badge: "Fast Setup",
              accent: "linear-gradient(135deg, hsl(var(--brand-orange)), hsl(var(--brand-pink)))",
            },
            {
              i: <Sparkles className="w-[18px] h-[18px]" strokeWidth={2.5} />,
              t: "בחירה חכמה",
              d: "התאמות לפי תחום, תקציב, מיקום ופלטפורמה.",
              badge: "AI Matching",
              accent: "linear-gradient(135deg, hsl(var(--brand-purple)), hsl(var(--brand-pink)))",
            },
            {
              i: <Target className="w-[18px] h-[18px]" strokeWidth={2.5} />,
              t: "פחות ניחושים",
              d: "כל התאמה עם ציון התאמה והסבר.",
              badge: "Smart Scoring",
              accent: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))",
            },
            {
              i: <Users className="w-[18px] h-[18px]" strokeWidth={2.5} />,
              t: "גם ליוצרים",
              d: "יוצרים מצטרפים לבטא ומקבלים פניות.",
              badge: "Creator Beta",
              accent: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="group relative bg-card rounded-2xl p-3.5 shadow-soft border border-border/70 tap-scale transition-all hover:shadow-card hover:-translate-y-0.5 hover:border-border overflow-hidden"
            >
              <div
                className="absolute -top-8 -left-8 w-20 h-20 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: f.accent }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground shadow-soft"
                    style={{ background: f.accent }}
                  >
                    {f.i}
                  </div>
                  <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-full bg-muted text-foreground/70 ltr-num">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-[15px] mb-1 text-foreground leading-tight">{f.t}</h3>
                <p className="text-[11.5px] text-muted-foreground font-medium leading-snug">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Match previews */}
      <section className="px-5 py-12 bg-muted/30">
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-brand mb-2">דוגמאות התאמה</span>
          <h2 className="text-3xl font-black mb-2 leading-tight">ככה נראית התאמה אמיתית</h2>
          <p className="text-sm text-muted-foreground font-medium">תוצאות לדוגמה מקמפיינים שרצו ב-Matchly</p>
        </div>

        <div className="space-y-4">
          {[
            {
              campaign: "השקת סרום פנים חדש",
              niche: "ביוטי",
              creator: "נועה לוי",
              avatar: "נ",
              gradient: "from-pink-400 to-purple-500",
              accent: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))",
              score: 94,
              platform: "Instagram",
              budget: "₪1,500 - ₪3,000",
              reasons: ["קהל נשי 25-34 בישראל", "תוכן ביוטי עם 6.2% engagement", "ניסיון עם 12 מותגי קוסמטיקה"],
            },
            {
              campaign: "פתיחת מסעדה בתל אביב",
              niche: "מסעדנות",
              creator: "איתי כהן",
              avatar: "א",
              gradient: "from-orange-400 to-pink-500",
              accent: "linear-gradient(135deg, hsl(var(--brand-orange)), hsl(var(--brand-pink)))",
              score: 91,
              platform: "Instagram",
              budget: "₪800 - ₪1,800",
              reasons: ["פוד בלוגר מתל אביב", "קהל מקומי רלוונטי", "שיתופי פעולה קודמים עם מסעדות"],
            },
            {
              campaign: "קידום אפליקציית כושר",
              niche: "כושר",
              creator: "שירה ברק",
              avatar: "ש",
              gradient: "from-yellow-400 to-orange-500",
              accent: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))",
              score: 89,
              platform: "Instagram",
              budget: "₪2,000 - ₪4,000",
              reasons: ["מאמנת כושר עם 85K עוקבים", "engagement גבוה בסרטוני אימון", "התאמה לקהל היעד 22-40"],
            },
          ].map((m) => (
            <article key={m.campaign} className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
              {/* Top: campaign */}
              <div className="px-5 pt-5 pb-4 border-b border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">קמפיין</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground/70">{m.niche}</span>
                </div>
                <h3 className="font-extrabold text-base leading-tight">{m.campaign}</h3>
              </div>

              {/* Middle: creator + score */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div
                  className={`shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-primary-foreground font-black text-lg shadow-soft`}
                >
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">היוצר המומלץ</div>
                  <div className="font-extrabold text-base leading-tight">{m.creator}</div>
                  <div className="text-[11px] text-muted-foreground font-semibold mt-0.5 ltr-num">{m.platform} · {m.budget}</div>
                </div>
                <div className="shrink-0 text-center">
                  <div
                    className="text-2xl font-black ltr-num leading-none"
                    style={{ background: m.accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {m.score}%
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">התאמה</div>
                </div>
              </div>

              {/* Reasons */}
              <div className="px-5 pb-4">
                <ul className="space-y-1.5">
                  {m.reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[12px]">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand" />
                      <span className="text-foreground/80 font-medium leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
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
      </section>

      {/* 6. Final CTA */}
      <section className="px-5 pt-4 pb-10 text-center">
        <div className="bg-brand rounded-[2rem] p-7 shadow-cta-lg text-primary-foreground">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
            מוכנים למצוא את שיתוף הפעולה הבא שלכם?
          </h2>
          <p className="text-sm font-medium mb-6 opacity-95 leading-relaxed">
            בין אם אתם עסק שמחפש יוצרים או יוצרים שמחפשים קמפיינים - Matchly מחברת אתכם נכון.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onStart}
              className="w-full py-3.5 rounded-full bg-card text-foreground font-extrabold text-sm tap-scale shadow-soft inline-flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              אני מפרסם
            </button>
            <button
              onClick={goCreator}
              className="w-full py-3.5 rounded-full bg-transparent border-2 border-white/70 text-primary-foreground font-extrabold text-sm tap-scale inline-flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              אני יוצר תוכן
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 text-center border-t border-border">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-brand" style={{ color: "hsl(var(--brand-pink))" }} />
          <span className="text-xs font-extrabold text-brand">Matchly</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium">חכם · מהיר · מדויק</p>
      </footer>
    </div>
  );
}

function AudienceCard({
  gradient, icon, title, text, cta, onClick,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[2rem] p-6 shadow-card relative overflow-hidden" style={{ background: gradient }}>
      <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-white/15 blur-2xl" />
      <div className="relative text-primary-foreground">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="text-2xl font-black mb-2">{title}</h3>
        <p className="text-sm font-medium opacity-95 mb-5 leading-relaxed">{text}</p>
        <button
          onClick={onClick}
          className="w-full py-3 rounded-full bg-card text-foreground font-extrabold text-sm tap-scale inline-flex items-center justify-center gap-2 shadow-soft"
        >
          {cta}
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
