import { useEffect } from "react";
import { Sparkles, Megaphone, Users, Zap, Target, Lightbulb, Heart, ArrowLeft, Check } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

/* ─── Scroll animation hook (inline, no extra file needed) ─── */
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.classList.contains("steps-section")) {
            el.querySelectorAll<HTMLElement>(".step-card").forEach((card, i) => {
              card.style.animationDelay = `${i * 0.13}s`;
              card.classList.add("is-visible");
            });
          } else {
            el.classList.add("is-visible");
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".animate-on-scroll, .steps-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Injected CSS (no separate file needed) ─── */
const ANIMATION_CSS = `
@keyframes fadeInUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInDown  { from{opacity:0;transform:translateY(-24px)} to{opacity:1;transform:translateY(0)} }
@keyframes springIn    { 0%{opacity:0;transform:scale(.72) translateY(24px)} 60%{opacity:1;transform:scale(1.06) translateY(-6px)} 80%{transform:scale(.97) translateY(2px)} 100%{transform:scale(1) translateY(0)} }
@keyframes bounceIn    { 0%{opacity:0;transform:scale(.3)} 50%{opacity:1;transform:scale(1.08)} 70%{transform:scale(.95)} 85%{transform:scale(1.03)} 100%{transform:scale(1)} }
@keyframes slideInRight{ from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }
@keyframes stepSlideIn { from{opacity:0;transform:translateX(28px) scale(.96)} to{opacity:1;transform:scale(1) translateX(0)} }
@keyframes badgePop    { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.15) rotate(3deg);opacity:1} 80%{transform:scale(.95) rotate(-1deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes barFill     { from{width:0 !important} }
@keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes pulseRing   { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(1.55);opacity:0} }
@keyframes floatBlob   { 0%,100%{transform:translateY(0) scale(1);opacity:.4} 50%{transform:translateY(-12px) scale(1.07);opacity:.6} }

/* scroll-reveal base */
.animate-on-scroll { opacity:0; will-change:transform,opacity; }
.animate-on-scroll.is-visible { animation-fill-mode:both; animation-duration:.65s; animation-timing-function:cubic-bezier(.34,1.56,.64,1); }
.anim-fade-up.is-visible       { animation-name:fadeInUp; }
.anim-spring.is-visible        { animation-name:springIn; }
.anim-bounce.is-visible        { animation-name:bounceIn; animation-timing-function:cubic-bezier(.68,-.55,.265,1.55); }
.anim-slide-right.is-visible   { animation-name:slideInRight; }
.anim-delay-1 { animation-delay:.08s; }
.anim-delay-2 { animation-delay:.16s; }
.anim-delay-3 { animation-delay:.24s; }
.anim-delay-4 { animation-delay:.32s; }

/* hero */
.matchly-header        { animation:fadeInDown .5s cubic-bezier(.34,1.56,.64,1) both; }
.hero-badge            { animation:fadeInDown .55s cubic-bezier(.34,1.56,.64,1) both; }
.hero-word             { display:inline-block; animation:fadeInUp .6s cubic-bezier(.34,1.56,.64,1) both; }
.hero-word:nth-child(1){ animation-delay:.06s; }
.hero-word:nth-child(2){ animation-delay:.17s; }
.hero-word:nth-child(3){ animation-delay:.28s; }
.hero-card             { animation:springIn .85s cubic-bezier(.34,1.56,.64,1) .32s both; }
.hero-cta              { animation:fadeInUp .55s cubic-bezier(.34,1.56,.64,1) .55s both; }
.hero-creator-row      { animation:slideInRight .5s cubic-bezier(.34,1.56,.64,1) both; }
.hero-creator-row:nth-child(1){ animation-delay:.65s; }
.hero-creator-row:nth-child(2){ animation-delay:.78s; }
.hero-creator-row:nth-child(3){ animation-delay:.91s; }
.score-bar             { animation:barFill .9s cubic-bezier(.34,1.56,.64,1) both; }
.score-bar:nth-child(1){ animation-delay:.75s; }
.score-bar:nth-child(2){ animation-delay:.88s; }
.score-bar:nth-child(3){ animation-delay:1.01s; }
.score-num             { animation:bounceIn .6s cubic-bezier(.68,-.55,.265,1.55) both; }
.score-num:nth-child(1){ animation-delay:.80s; }
.score-num:nth-child(2){ animation-delay:.93s; }
.score-num:nth-child(3){ animation-delay:1.06s; }
.timing-badge          { animation:badgePop .7s cubic-bezier(.68,-.55,.265,1.55) 1.1s both; }
.animate-float         { animation:floatBlob 4s ease-in-out infinite; }

/* buttons */
button,.tap-scale { transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease; }
button:hover      { transform:scale(1.045) translateY(-1px); }
button:active     { transform:scale(.94) translateY(1px) !important; transition-duration:.08s; }

/* CTA pulse ring */
.cta-primary            { position:relative; overflow:visible; }
.cta-primary::after     { content:''; position:absolute; inset:0; border-radius:inherit; border:2px solid currentColor; opacity:0; animation:pulseRing 2.2s ease-out 1.8s infinite; pointer-events:none; }

/* cards hover */
.audience-card,.match-card,.feature-card { transition:transform .22s cubic-bezier(.34,1.56,.64,1); }
.audience-card:hover  { transform:translateY(-5px) scale(1.015); }
.match-card:hover     { transform:translateY(-4px); }
.feature-card:hover   { transform:translateY(-6px) scale(1.03); }

/* step card */
.step-card              { opacity:0; animation-fill-mode:both; animation-duration:.55s; animation-timing-function:cubic-bezier(.34,1.56,.64,1); animation-name:stepSlideIn; }
.step-card.is-visible   { opacity:1; }
.step-number            { transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.step-card:hover .step-number { transform:scale(1.2) rotate(-7deg); }

/* feature icon */
.feature-icon { transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.feature-card:hover .feature-icon { transform:scale(1.22) rotate(-8deg); }

/* avatar */
.creator-avatar { transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.match-card:hover .creator-avatar { transform:scale(1.1) rotate(-4deg); }

/* score shimmer */
.score-shimmer {
  background:linear-gradient(90deg,hsl(var(--brand-pink)) 0%,hsl(var(--brand-yellow)) 50%,hsl(var(--brand-pink)) 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation:shimmer 2.5s linear 1.5s infinite;
}

@media (prefers-reduced-motion:reduce) {
  *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
}
`;

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  useScrollAnimations();

  // Inject CSS once
  useEffect(() => {
    const id = "matchly-anim-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = ANIMATION_CSS;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  const goCreator = () => onCreatorJoin?.();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="matchly-header sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={matchlyIcon} alt="" className="h-[46px] w-[46px] object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-[23px] font-extrabold tracking-tight text-foreground">Matchly</span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-wider" dir="ltr">
                INFLUENCE TODAY. MATCH NOW.
              </span>
            </div>
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
      <section className="relative px-5 pt-7 pb-12 overflow-hidden bg-foreground">
        <div
          className="absolute inset-0 opacity-95 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 0%, hsl(var(--brand-yellow) / 0.55), transparent 45%), radial-gradient(circle at 85% 10%, hsl(var(--brand-pink) / 0.7), transparent 50%), radial-gradient(circle at 50% 100%, hsl(var(--brand-purple) / 0.8), transparent 55%), linear-gradient(180deg, hsl(var(--brand-orange) / 0.35), hsl(var(--brand-purple) / 0.6))",
          }}
        />
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl animate-float pointer-events-none"
          style={{ background: "hsl(var(--brand-pink))" }}
        />
        <div
          className="absolute bottom-0 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-float"
          style={{ background: "hsl(var(--brand-purple))", animationDelay: "1.5s" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.35) 100%)" }}
        />

        <div className="relative z-10 text-primary-foreground">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-semibold text-white/95">
              פלטפורמה לחיבור יוצרי תוכן לבעלי עסקים ב-60 שניות
            </span>
          </div>

          {/* Title — each line is a hero-word */}
          <h1 className="font-black tracking-tight mb-3 text-[34px] sm:text-5xl leading-[1.05]">
            <span className="hero-word block">3 יוצרי תוכן</span>
            <span className="hero-word block">
              שמתאימים{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-pink)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                בדיוק
              </span>
            </span>
            <span className="hero-word block">לקמפיין שלך</span>
          </h1>

          <p
            className="text-[15px] text-white/85 font-medium mb-6 leading-relaxed max-w-md"
            style={{ animation: "fadeInUp .55s cubic-bezier(.34,1.56,.64,1) .35s both" }}
          >
            פותחים קמפיין ומקבלים 3 התאמות חכמות תוך פחות מדקה.
          </p>

          {/* Product preview card */}
          <div className="hero-card relative mb-7">
            <div
              className="absolute -inset-1 rounded-[2rem] opacity-60 blur-xl"
              style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
            />
            <div className="relative bg-card text-foreground rounded-[1.75rem] p-4 shadow-cta-lg border border-white/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-brand grid place-items-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground leading-none">
                      קמפיין פעיל
                    </div>
                    <div className="text-[12px] font-extrabold leading-tight mt-0.5">השקת סרום פנים</div>
                  </div>
                </div>
                <span className="timing-badge text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 ltr-num">
                  3/3 התאמות
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    name: "נועה לוי",
                    meta: "Instagram · 124K",
                    score: 94,
                    gradient: "from-pink-400 to-purple-500",
                    avatar: "נ",
                  },
                  {
                    name: "איתי כהן",
                    meta: "Instagram · 86K",
                    score: 91,
                    gradient: "from-orange-400 to-pink-500",
                    avatar: "א",
                  },
                  {
                    name: "שירה ברק",
                    meta: "Instagram · 85K",
                    score: 89,
                    gradient: "from-yellow-400 to-orange-500",
                    avatar: "ש",
                  },
                ].map((c, i) => (
                  <div
                    key={c.name}
                    className="hero-creator-row flex items-center gap-2.5 p-2 rounded-2xl bg-muted/50 border border-border/60"
                  >
                    <div
                      className={`creator-avatar shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${c.gradient} grid place-items-center text-primary-foreground font-black text-xs shadow-soft`}
                    >
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-[12px] font-extrabold leading-tight">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground font-semibold ltr-num leading-tight mt-0.5">
                        {c.meta}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="score-bar h-full rounded-full"
                          style={{
                            width: `${Math.max(8, Math.min(100, ((c.score - 85) / 15) * 100))}%`,
                            background: "linear-gradient(90deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))",
                            animationDelay: `${0.75 + i * 0.13}s`,
                          }}
                        />
                      </div>
                      <span
                        className="score-num text-[11px] font-black ltr-num score-shimmer"
                        style={{ animationDelay: `${0.8 + i * 0.13}s` }}
                      >
                        {c.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-semibold">הותאם תוך</span>
                <span className="timing-badge text-[11px] font-black ltr-num text-brand">47 שניות</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-cta flex flex-col gap-2.5">
            <button
              onClick={onStart}
              className="cta-primary w-full inline-flex items-center justify-center gap-2 py-4 text-base font-extrabold text-foreground bg-card rounded-full shadow-cta-lg tap-scale"
            >
              <Megaphone className="w-5 h-5" />
              אני מפרסם
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goCreator}
              className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-bold text-white/90 tap-scale"
            >
              <span>אני יוצר תוכן</span>
              <span className="opacity-70">- הצטרפו לבטא</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Audience cards */}
      <section className="px-5 py-10 space-y-10">
        <AudienceCard
          gradient="linear-gradient(135deg, hsl(var(--brand-purple)) 0%, hsl(var(--brand-pink)) 100%)"
          icon={<Heart className="w-6 h-6" />}
          title="ליוצרי תוכן"
          text="קבלו הזדמנויות לשיתופי פעולה עם עסקים שמתאימים לקהל שלכם."
          cta="הצטרפו כיוצרים"
          onClick={goCreator}
          animDelay="anim-delay-1"
        />
        <AudienceCard
          gradient="linear-gradient(135deg, hsl(var(--brand-orange)) 0%, hsl(var(--brand-pink)) 100%)"
          icon={<Megaphone className="w-6 h-6" />}
          title="למפרסמים"
          text="פתחו קמפיין וקבלו 3 יוצרים שמתאימים בדיוק למטרה, לתקציב ולקהל שלכם."
          cta="התחילו קמפיין"
          onClick={onStart}
          animDelay="anim-delay-2"
        />
      </section>

      {/* 3. How it works */}
      <section
        className="steps-section px-5 py-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--brand-pink) / 0.10) 0%, hsl(var(--brand-purple) / 0.12) 100%)",
        }}
      >
        <h2 className="text-3xl font-black text-center mb-2">איך זה עובד?</h2>
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">ארבעה צעדים פשוטים</p>
        <div className="space-y-3">
          {[
            { n: "1", t: "פותחים קמפיין", d: "מגדירים מטרה, תקציב, פלטפורמה וקהל יעד." },
            { n: "2", t: "אנחנו מנתחים", d: "המערכת מדרגת יוצרים לפי התאמה אמיתית לקמפיין." },
            { n: "3", t: "מקבלים 3 התאמות", d: "במקום לחפש שעות - מקבלים 3 יוצרים מדויקים." },
            { n: "4", t: "מתחילים שיתוף פעולה", d: "שולחים הצעה ליוצר ומתקדמים לקמפיין." },
          ].map((s) => (
            <div key={s.n} className="step-card flex gap-4 bg-card rounded-3xl p-4 shadow-soft border border-border">
              <div className="step-number shrink-0 w-12 h-12 rounded-2xl bg-brand text-primary-foreground grid place-items-center font-black text-lg shadow-glow">
                <span className="leading-none tabular-nums" style={{ direction: "ltr" }}>
                  {s.n}
                </span>
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
      <section
        className="px-5 py-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--brand-yellow) / 0.06) 0%, hsl(var(--brand-pink) / 0.10) 50%, hsl(var(--brand-purple) / 0.08) 100%)",
        }}
      >
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--brand-pink))" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--brand-purple))" }}
        />
        <div className="relative">
          <div className="text-center mb-7 animate-on-scroll anim-fade-up">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-brand mb-2">
              למה Matchly
            </span>
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
                delay: "anim-delay-1",
              },
              {
                i: <Sparkles className="w-[18px] h-[18px]" strokeWidth={2.5} />,
                t: "בחירה חכמה",
                d: "התאמות לפי תחום, תקציב, מיקום ופלטפורמה.",
                badge: "AI Matching",
                accent: "linear-gradient(135deg, hsl(var(--brand-purple)), hsl(var(--brand-pink)))",
                delay: "anim-delay-2",
              },
              {
                i: <Target className="w-[18px] h-[18px]" strokeWidth={2.5} />,
                t: "פחות ניחושים",
                d: "כל התאמה עם ציון התאמה והסבר.",
                badge: "Smart Scoring",
                accent: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))",
                delay: "anim-delay-3",
              },
              {
                i: <Users className="w-[18px] h-[18px]" strokeWidth={2.5} />,
                t: "גם ליוצרים",
                d: "יוצרים מצטרפים לבטא ומקבלים פניות.",
                badge: "Creator Beta",
                accent: "linear-gradient(135deg, hsl(var(--brand-yellow)), hsl(var(--brand-orange)))",
                delay: "anim-delay-4",
              },
            ].map((f) => (
              <div
                key={f.t}
                className={`feature-card animate-on-scroll anim-spring ${f.delay} group relative bg-card rounded-2xl p-3.5 shadow-soft border border-border/70 overflow-hidden`}
              >
                <div
                  className="absolute -top-8 -left-8 w-20 h-20 rounded-full opacity-10 blur-2xl pointer-events-none"
                  style={{ background: f.accent }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className="feature-icon w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground shadow-soft"
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
        </div>
      </section>

      {/* 5. Match previews */}
      <section
        className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--brand-purple) / 0.08) 0%, hsl(var(--brand-orange) / 0.06) 100%)",
        }}
      >
        <div
          className="absolute top-1/3 -left-20 w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--brand-orange))" }}
        />
        <div className="text-center mb-8 relative animate-on-scroll anim-fade-up">
          <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-brand mb-2">
            דוגמאות התאמה
          </span>
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
              delay: "anim-delay-1",
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
              delay: "anim-delay-2",
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
              delay: "anim-delay-3",
            },
          ].map((m) => (
            <article
              key={m.campaign}
              className={`match-card animate-on-scroll anim-fade-up ${m.delay} bg-card rounded-3xl border border-border shadow-soft overflow-hidden`}
            >
              <div className="px-5 pt-5 pb-4 border-b border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">קמפיין</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                    {m.niche}
                  </span>
                </div>
                <h3 className="font-extrabold text-base leading-tight">{m.campaign}</h3>
              </div>

              <div className="px-5 py-4 flex items-center gap-3">
                <div
                  className={`creator-avatar shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-primary-foreground font-black text-lg shadow-soft`}
                >
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-0.5">
                    היוצר המומלץ
                  </div>
                  <div className="font-extrabold text-base leading-tight">{m.creator}</div>
                  <div className="text-[11px] text-muted-foreground font-semibold mt-0.5 ltr-num">
                    {m.platform} · {m.budget}
                  </div>
                </div>
                <div className="shrink-0 text-center">
                  <div className="text-2xl font-black ltr-num leading-none score-shimmer">{m.score}%</div>
                  <div className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
                    התאמה
                  </div>
                </div>
              </div>

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
      <section className="px-5 pt-4 pb-10 text-center animate-on-scroll anim-spring">
        <div className="bg-brand rounded-[2rem] p-7 shadow-cta-lg text-primary-foreground">
          <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">מוכנים למצוא את שיתוף הפעולה הבא שלכם?</h2>
          <p className="text-sm font-medium mb-6 opacity-95 leading-relaxed">
            בין אם אתם עסק שמחפש יוצרים או יוצרים שמחפשים קמפיינים - Matchly מחברת אתכם נכון.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onStart}
              className="cta-primary w-full py-3.5 rounded-full bg-card text-foreground font-extrabold text-sm tap-scale shadow-soft inline-flex items-center justify-center gap-2"
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
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <img src={matchlyIcon} alt="" className="h-5 w-5 object-contain" loading="lazy" />
          <span className="text-sm font-extrabold tracking-tight text-foreground">Matchly</span>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium tracking-wider" dir="ltr">
          INFLUENCE TODAY. MATCH NOW.
        </p>
      </footer>
    </div>
  );
}

function AudienceCard({
  gradient,
  icon,
  title,
  text,
  cta,
  onClick,
  animDelay,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
  animDelay?: string;
}) {
  return (
    <div
      className={`audience-card animate-on-scroll anim-spring ${animDelay ?? ""} rounded-[2rem] p-6 shadow-card relative overflow-hidden`}
      style={{ background: gradient }}
    >
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
