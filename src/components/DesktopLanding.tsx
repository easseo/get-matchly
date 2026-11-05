import { useState, type ReactNode } from "react";
import {
  Instagram, Megaphone, Zap, Target, ChevronRight, ChevronLeft, Briefcase, Star,
  Handshake, MessageCircle, Wallet, Search, Send, UserRound, Rocket, Sparkles, Check,
  type LucideIcon,
} from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface DesktopLandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

const ADVERTISER_SCREENS = ["intro", "benefits", "cta"] as const;
const CREATOR_SCREENS = ["creator-benefits", "creator-how"] as const;
type Screen = (typeof ADVERTISER_SCREENS)[number] | (typeof CREATOR_SCREENS)[number];

export default function DesktopLanding({ onStart, onCreatorJoin }: DesktopLandingProps) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [dir, setDir] = useState<"forward" | "back">("forward");

  const go = (next: Screen, direction: "forward" | "back" = "forward") => {
    setDir(direction);
    setScreen(next);
  };

  const isCreatorFlow = screen === "creator-benefits" || screen === "creator-how";
  const dots = isCreatorFlow ? CREATOR_SCREENS : ADVERTISER_SCREENS;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink grain text-white" dir="rtl">
      <Ambient />

      {/* Top bar */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="mx-auto max-w-[1240px] px-10 h-20 flex items-center justify-between">
          <button onClick={() => go("intro", "back")} className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/30">
              <img src={matchlyIcon} alt="" className="w-6 h-6 object-contain" />
            </span>
            <span className="text-lg font-bold tracking-tight">Matchly</span>
          </button>

          <div className="flex items-center gap-2" aria-hidden>
            {dots.map((s) => (
              <span
                key={s}
                className={`h-1 rounded-full transition-all duration-500 ${
                  s === screen ? "w-10 bg-gold" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* spacer for the floating login button rendered by Index */}
          <span className="w-28" />
        </div>
      </header>

      <div
        key={screen}
        className="relative z-10 min-h-screen w-full flex"
        style={{ animation: `${dir === "forward" ? "dlSlideIn" : "dlSlideBack"} 0.6s cubic-bezier(0.22,1,0.36,1)` }}
      >
        {screen === "intro" && <IntroScreen onContinue={() => go("benefits")} onCreatorJoin={() => go("creator-benefits")} />}
        {screen === "benefits" && <BenefitsScreen onBack={() => go("intro", "back")} onContinue={() => go("cta")} />}
        {screen === "cta" && <CtaScreen onBack={() => go("benefits", "back")} onStart={onStart} onCreatorJoin={() => go("creator-benefits")} />}
        {screen === "creator-benefits" && <CreatorBenefitsScreen onBack={() => go("intro", "back")} onContinue={() => go("creator-how")} />}
        {screen === "creator-how" && <CreatorHowScreen onBack={() => go("creator-benefits", "back")} onContinue={() => onCreatorJoin?.()} />}
      </div>

      <style>{`
        @keyframes dlSlideIn {
          from { transform: translateX(40px); opacity: 0; filter: blur(4px); }
          to   { transform: translateX(0);    opacity: 1; filter: blur(0); }
        }
        @keyframes dlSlideBack {
          from { transform: translateX(-40px); opacity: 0; filter: blur(4px); }
          to   { transform: translateX(0);     opacity: 1; filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared building blocks ─────────────────────────────────────── */

function Ambient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-40 right-[10%] w-[640px] h-[640px] rounded-full blur-[140px] opacity-30 animate-aurora"
        style={{ background: "hsl(var(--brand-pink))" }} />
      <div className="absolute -bottom-48 left-[-10%] w-[620px] h-[620px] rounded-full blur-[150px] opacity-25 animate-aurora"
        style={{ background: "hsl(var(--brand-purple))", animationDelay: "-6s" }} />
      {/* fine grid */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
        }} />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/70">
      <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_hsl(var(--gold))]" />
      {children}
    </span>
  );
}

function PrimaryButton({ onClick, children, className = "" }: { onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2.5 h-14 px-7 rounded-full bg-white text-ink font-bold text-[15px]
        shadow-[0_20px_40px_-16px_hsl(var(--brand-pink)/0.6),inset_0_-2px_0_hsl(268_30%_10%/0.06)]
        transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_50px_-16px_hsl(var(--brand-pink)/0.75)] active:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children, className = "" }: { onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full border border-white/15 bg-white/[0.04] text-white/85 font-semibold text-[15px]
        backdrop-blur transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}

function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-gold/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02]">
      <Icon className="w-5 h-5 text-gold" strokeWidth={1.6} />
    </span>
  );
}

function StepLayout({
  eyebrow, title, accent, subtitle, children, onBack, onContinue, continueLabel = "המשך",
}: {
  eyebrow: string; title: string; accent?: string; subtitle: string; children: ReactNode;
  onBack: () => void; onContinue: () => void; continueLabel?: string;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-10 pt-28 pb-14">
      <div className="text-center mb-12 max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display text-[56px] leading-[1.05] font-bold mt-6 mb-4">
          {title}{accent && <> <span className="text-brand">{accent}</span></>}
        </h2>
        <p className="text-white/55 text-lg leading-relaxed">{subtitle}</p>
      </div>

      <div className="w-full max-w-4xl">{children}</div>

      <div className="w-full max-w-4xl flex items-center justify-between mt-12">
        <GhostButton onClick={onBack}>
          <ChevronRight size={18} />
          חזרה
        </GhostButton>
        <PrimaryButton onClick={onContinue} className="min-w-[220px]">
          {continueLabel}
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        </PrimaryButton>
      </div>
    </div>
  );
}

function FeatureGrid({ cards }: { cards: { icon: LucideIcon; title: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {cards.map((c, i) => (
        <div
          key={c.title}
          className="glass-ink rounded-3xl p-7 flex items-start gap-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 animate-fade-in-up"
          style={{ animationDelay: `${120 + i * 80}ms` }}
        >
          <IconTile icon={c.icon} />
          <div>
            <p className="font-bold text-lg text-white leading-tight mb-2">{c.title}</p>
            <p className="text-[15px] text-white/50 leading-relaxed">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Product mockup (replaces stock photo) ──────────────────────── */

const MOCK_CREATORS = [
  { name: "נועה לוי", handle: "@noa.lifestyle", niche: "לייפסטייל · 84K", match: 98, hue: 336 },
  { name: "יואב כהן", handle: "@yoav.fit", niche: "כושר · 52K", match: 94, hue: 290 },
  { name: "מאיה בר", handle: "@maya.eats", niche: "אוכל · 120K", match: 91, hue: 264 },
];

function MatchMockup() {
  return (
    <div className="relative w-full max-w-[460px] mr-auto">
      {/* glow */}
      <div className="absolute inset-8 rounded-[40px] blur-3xl opacity-60" style={{ background: "var(--gradient-brand)" }} />

      <div className="relative glass-ink rounded-[28px] p-6 float-slow">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] text-white/45 font-medium tracking-wide">קמפיין · השקת קולקציית קיץ</p>
            <p className="text-lg font-bold mt-0.5">3 התאמות מושלמות</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-300/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            הושלם תוך 42 שנ׳
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_CREATORS.map((c, i) => (
            <div key={c.handle}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] animate-fade-in-up"
              style={{ animationDelay: `${300 + i * 120}ms` }}>
              <span className="w-11 h-11 rounded-full p-[2px] shrink-0" style={{ background: "var(--gradient-brand)" }}>
                <span className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, hsl(${c.hue} 45% 28%), hsl(${c.hue} 40% 16%))` }}>
                  {c.name.split(" ").map(s => s[0]).join("")}
                </span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold truncate">{c.name}</p>
                  <Instagram className="w-3.5 h-3.5 text-white/40" />
                </div>
                <p className="text-[11px] text-white/45 mt-0.5"><span className="ltr-num">{c.handle}</span> · {c.niche}</p>
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.match}%`, background: "var(--gradient-brand)" }} />
                </div>
              </div>
              <span className="text-sm font-bold text-gold ltr-num">{c.match}%</span>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full h-11 rounded-xl text-sm font-bold bg-brand shadow-cta pointer-events-none">
          שליחת הצעה ליוצרים
        </button>
      </div>

      {/* floating chips */}
      <div className="absolute -top-5 -left-6 glass-ink rounded-2xl px-4 py-3 flex items-center gap-2.5 animate-float" style={{ animationDelay: "-1.5s" }}>
        <span className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)" }}>
          <Instagram size={16} />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] text-white/45">חשיפה משוערת</p>
          <p className="text-sm font-bold ltr-num">256K</p>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-4 glass-ink rounded-2xl px-4 py-3 flex items-center gap-2 animate-float" style={{ animationDelay: "-3s" }}>
        <Star className="w-4 h-4 text-gold fill-gold" />
        <p className="text-sm font-bold"><span className="ltr-num">4.9</span> <span className="text-white/45 font-medium text-xs">דירוג יוצרים</span></p>
      </div>
    </div>
  );
}

/* ─── Screen 1: Intro ─────────────────────────────────────────────── */
function IntroScreen({ onContinue, onCreatorJoin }: { onContinue: () => void; onCreatorJoin?: () => void }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-[1240px] px-10 pt-24 pb-8 grid grid-cols-[1.1fr_1fr] gap-16 items-center">
        {/* Copy */}
        <div>
          <Eyebrow>פלטפורמת שיתופי הפעולה של אינסטגרם</Eyebrow>

          <h1 className="font-display font-bold text-[72px] leading-[1.02] mt-6 mb-5">
            היוצרים הנכונים.
            <br />
            <span className="text-brand">לעסק הנכון.</span>
          </h1>

          <p className="text-xl text-white/60 leading-relaxed max-w-[520px] mb-9">
            Matchly מחברת בין בעלי עסקים ומפרסמים ליוצרי תוכן באינסטגרם — עם התאמות מדויקות, תוך פחות מדקה.
          </p>

          <div className="flex items-center gap-3 mb-12">
            <PrimaryButton onClick={onContinue}>
              <Briefcase size={17} />
              אני בעל עסק / מפרסם
              <ChevronLeft size={17} className="transition-transform group-hover:-translate-x-1" />
            </PrimaryButton>
            <GhostButton onClick={onCreatorJoin}>
              <Sparkles size={17} className="text-gold" />
              אני יוצר/ת תוכן
            </GhostButton>
          </div>

          <div className="flex items-center divide-x divide-x-reverse divide-white/10">
            {[
              { val: "< 60s", label: "זמן התאמה" },
              { val: "3", label: "התאמות מדויקות לכל קמפיין" },
              { val: "₪0", label: "דמי הצטרפות" },
            ].map((s, i) => (
              <div key={s.label} className={i === 0 ? "pl-8" : "px-8"}>
                <div className="font-display text-3xl font-bold ltr-num text-white">{s.val}</div>
                <div className="text-xs text-white/45 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <MatchMockup />
      </div>

      {/* Audience strip */}
      <div className="mx-auto w-full max-w-[1240px] px-10 pb-10">
        <div className="hairline mb-7 opacity-30" />
        <div className="grid grid-cols-2 gap-10">
          {[
            { icon: Briefcase, title: "לבעלי עסקים ומפרסמים", items: ["יוצרים רלוונטיים, בלי חיפוש ידני", "התאמות מבוססות נתונים", "ניהול שיתופי פעולה במקום אחד"] },
            { icon: Star, title: "ליוצרי תוכן", items: ["הצעות בתשלום מעסקים אמיתיים", "בחירה בקמפיינים שמתאימים לך", "צמיחה דרך שיתופי פעולה"] },
          ].map((col) => (
            <div key={col.title} className="flex items-start gap-4">
              <IconTile icon={col.icon} />
              <div>
                <p className="font-bold mb-2">{col.title}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {col.items.map((it) => (
                    <li key={it} className="flex items-center gap-1.5 text-sm text-white/50">
                      <Check className="w-3.5 h-3.5 text-gold" strokeWidth={2.5} />{it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 2: Benefits ──────────────────────────────────────────── */
function BenefitsScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <StepLayout
      eyebrow="לבעלי עסקים ומפרסמים"
      title="למה לבחור"
      accent="ב-Matchly?"
      subtitle="חיבור פשוט ומהיר בין בעלי עסקים ומפרסמים ליוצרי תוכן — בלי ניחושים."
      onBack={onBack}
      onContinue={onContinue}
    >
      <FeatureGrid cards={[
        { icon: Zap, title: "מצא יוצרי תוכן מהר יותר", desc: "קבל התאמות במקום חיפוש ידני ממושך" },
        { icon: Target, title: "התאמות מדויקות יותר", desc: "יוצרי תוכן רלוונטיים לקהל ולמטרות הקמפיין שלך" },
        { icon: Handshake, title: "שיתופי פעולה פשוטים", desc: "התחבר, סגור ונהל — הכול במקום אחד" },
        { icon: MessageCircle, title: "תהליך מהיר ונוח", desc: "פחות חיפוש, יותר חיבורים שמביאים תוצאות" },
      ]} />
    </StepLayout>
  );
}

/* ─── Screen 3: CTA ───────────────────────────────────────────────── */
function CtaScreen({ onBack, onStart, onCreatorJoin }: { onBack: () => void; onStart: () => void; onCreatorJoin?: () => void }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-10 pt-24 pb-14">
      <div className="relative w-full max-w-3xl text-center">
        <div className="mx-auto mb-10 w-24 h-24 rounded-[28px] flex items-center justify-center bg-brand shadow-glow animate-pulse-glow">
          <Megaphone size={40} strokeWidth={1.6} />
        </div>

        <Eyebrow>הצעד הראשון</Eyebrow>
        <h2 className="font-display text-[68px] leading-[1.04] font-bold mt-6 mb-5">
          מוכנים להתחיל <span className="text-brand">לפרסם?</span>
        </h2>
        <p className="text-white/55 text-xl leading-relaxed max-w-xl mx-auto mb-10">
          תארו את הקמפיין — ונמצא לכם 3 יוצרי תוכן מתאימים תוך פחות מדקה.
        </p>

        <div className="flex items-center justify-center gap-3 mb-14">
          <PrimaryButton onClick={onStart} className="min-w-[260px]">
            <Megaphone size={18} />
            צרו קמפיין עכשיו
          </PrimaryButton>
          <GhostButton onClick={onCreatorJoin}>אני יוצר/ת תוכן</GhostButton>
        </div>

        <div className="glass-ink rounded-3xl grid grid-cols-3 divide-x divide-x-reverse divide-white/10 py-6">
          {[
            { val: "15+", label: "יוצרי תוכן מאומתים" },
            { val: "< 60s", label: "זמן התאמה" },
            { val: "Instagram", label: "פלטפורמה" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-bold ltr-num">{s.val}</div>
              <div className="text-xs text-white/45 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onBack} className="mt-10 inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors">
          <ChevronRight size={16} />
          חזרה
        </button>
      </div>
    </div>
  );
}

/* ─── Creator Screen 1: Benefits ─────────────────────────────────── */
function CreatorBenefitsScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <StepLayout
      eyebrow="ליוצרי תוכן"
      title="התוכן שלך."
      accent="שווה יותר."
      subtitle="הרוויחו משיתופי פעולה עם בעלי עסקים ומפרסמים באינסטגרם."
      onBack={onBack}
      onContinue={onContinue}
    >
      <FeatureGrid cards={[
        { icon: Wallet, title: "להרוויח משיתופי פעולה", desc: "קבלו הזדמנויות בתשלום מבעלי עסקים ומפרסמים" },
        { icon: Handshake, title: "להתחבר למותגים", desc: "היחשפו לעסקים שמחפשים בדיוק אתכם" },
        { icon: Target, title: "התאמות רלוונטיות", desc: "קמפיינים שמתאימים לתוכן ולקהל שלכם" },
        { icon: Rocket, title: "לצמוח", desc: "פתחו קשרים והרחיבו את הפעילות שלכם" },
      ]} />
    </StepLayout>
  );
}

/* ─── Creator Screen 2: How it works ─────────────────────────────── */
function CreatorHowScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const steps = [
    { icon: UserRound, title: "צרו פרופיל", desc: "הוסיפו את פרטי האינסטגרם שלכם" },
    { icon: Search, title: "גלו התאמות", desc: "ראו קמפיינים רלוונטיים" },
    { icon: Send, title: "שלחו הצעה", desc: "בחרו קמפיינים שמתאימים לכם" },
    { icon: Handshake, title: "התחילו לשתף פעולה", desc: "עבדו עם בעלי עסקים ומפרסמים" },
  ];

  return (
    <StepLayout
      eyebrow="איך זה עובד"
      title="ארבעה צעדים."
      accent="זה הכול."
      subtitle="מהפרופיל הראשון ועד שיתוף הפעולה הראשון בתשלום."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="יצירת חשבון"
    >
      <div className="grid grid-cols-4 gap-4 relative">
        <div className="absolute top-[42px] right-[12%] left-[12%] h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        {steps.map((s, i) => (
          <div key={s.title}
            className="glass-ink rounded-3xl p-6 text-center flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: `${120 + i * 90}ms` }}>
            <span className="relative w-14 h-14 rounded-2xl bg-ink-2 border border-gold/30 flex items-center justify-center mb-5">
              <s.icon className="w-6 h-6 text-gold" strokeWidth={1.6} />
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-brand text-[11px] font-bold flex items-center justify-center ltr-num">{i + 1}</span>
            </span>
            <p className="font-bold text-base mb-1.5">{s.title}</p>
            <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </StepLayout>
  );
}
