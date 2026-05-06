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
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-brand text-primary-foreground flex items-center justify-center font-black text-lg shadow-glow ltr-num">
                {s.n}
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
        <h2 className="text-3xl font-black text-center mb-2">למה להשתמש ב־<span className="text-brand">Matchly</span>?</h2>
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">היתרונות שעושים את ההבדל</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { i: <Zap className="w-5 h-5" />, t: "חוסך זמן", d: "בלי לעבור ידנית על מאות פרופילים." },
            { i: <Target className="w-5 h-5" />, t: "בחירה חכמה", d: "התאמות לפי תחום, תקציב, מיקום ופלטפורמה." },
            { i: <Lightbulb className="w-5 h-5" />, t: "פחות ניחושים", d: "כל התאמה מגיעה עם הסבר ברור למה היא מתאימה." },
            { i: <Users className="w-5 h-5" />, t: "מתאים גם ליוצרים", d: "יוצרים יכולים להצטרף לבטא ולקבל פניות רלוונטיות." },
          ].map((f) => (
            <div key={f.t} className="bg-card rounded-2xl p-4 shadow-soft border border-border">
              <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center mb-3 text-foreground">
                <span className="text-brand">{f.i}</span>
              </div>
              <h3 className="font-extrabold text-sm mb-1">{f.t}</h3>
              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Example campaigns */}
      <section className="px-5 py-10 bg-mesh">
        <h2 className="text-3xl font-black text-center mb-2">קמפיינים לדוגמה</h2>
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">ככה נראים קמפיינים שרצים אצלנו</p>
        <div className="space-y-3">
          {[
            { niche: "ביוטי", title: "השקת מוצר ביוטי", budget: "₪1,500 - ₪3,000", platform: "Instagram", color: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" },
            { niche: "מסעדנות", title: "קמפיין למסעדה מקומית", budget: "₪800 - ₪1,800", platform: "Instagram", color: "linear-gradient(135deg, hsl(var(--brand-orange)), hsl(var(--brand-pink)))" },
            { niche: "כושר", title: "קידום אפליקציית כושר", budget: "₪2,000 - ₪4,000", platform: "Instagram", color: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))" },
          ].map((c) => (
            <div key={c.title} className="bg-card rounded-3xl overflow-hidden shadow-card border border-border">
              <div className="h-24 relative" style={{ background: c.color }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white/70" />
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-card/95 text-foreground">
                  {c.niche}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-extrabold text-base mb-2">{c.title}</h3>
                <div className="flex items-center justify-between mb-3 text-[11px] text-muted-foreground font-semibold">
                  <span className="ltr-num">{c.budget}</span>
                  <span>{c.platform}</span>
                </div>
                <button
                  onClick={onStart}
                  className="w-full py-2.5 rounded-full bg-brand-soft text-foreground font-bold text-xs tap-scale border border-border"
                >
                  צפה בפרטים
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="px-5 py-12 text-center">
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
