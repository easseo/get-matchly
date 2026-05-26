import { useState } from "react";
import { Instagram, Megaphone, Users, Zap, Target, TrendingUp, ChevronRight, ChevronLeft, Briefcase, Star } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import heroImage from "@/assets/hero.png";

interface DesktopLandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

const SCREENS = ["intro", "benefits", "cta"] as const;
type Screen = (typeof SCREENS)[number];

export default function DesktopLanding({ onStart, onCreatorJoin }: DesktopLandingProps) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [dir, setDir] = useState<"forward" | "back">("forward");

  const go = (next: Screen, direction: "forward" | "back" = "forward") => {
    setDir(direction);
    setScreen(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background" dir="rtl">
      {/* Progress dots */}
      <div className="absolute top-6 left-0 right-0 flex justify-center gap-2 z-20">
        {SCREENS.map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === screen ? "w-10 bg-brand" : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div
        key={screen}
        className="min-h-screen w-full flex"
        style={{
          animation: `${dir === "forward" ? "slideInRight" : "slideInLeft"} 0.35s cubic-bezier(0.4,0,0.2,1)`,
        }}
      >
        {screen === "intro" && <IntroScreen onContinue={() => go("benefits")} onCreatorJoin={onCreatorJoin} />}
        {screen === "benefits" && <BenefitsScreen onBack={() => go("intro", "back")} onContinue={() => go("cta")} />}
        {screen === "cta" && <CtaScreen onBack={() => go("benefits", "back")} onStart={onStart} onCreatorJoin={onCreatorJoin} />}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Screen 1: Intro ─────────────────────────────────────────────── */
function IntroScreen({ onContinue, onCreatorJoin }: { onContinue: () => void; onCreatorJoin?: () => void }) {
  return (
    <div className="flex w-full min-h-screen" dir="rtl">
      {/* Left: hero */}
      <div
        className="flex-1 flex flex-col px-12 py-10 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0533 0%, #2d0a4e 45%, #1c0a3a 100%)" }}
      >
        {/* Ambient blobs */}
        <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-25" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-purple))" }} />

        {/* Logo row */}
        <div className="relative z-10 flex items-center gap-3 mb-8">
          <img src={matchlyIcon} alt="Matchly" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-black text-white tracking-tight">Matchly</span>
        </div>

        {/* Middle: text + woman photo */}
        <div className="relative z-10 flex items-center gap-8 flex-1 mb-6">
          {/* Text column */}
          <div className="flex-1 min-w-0">
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              ברוכים הבאים ל-Matchly
            </h1>
            <p className="text-lg text-white/85 font-semibold leading-snug mb-4">
              הדרך הפשוטה לחבר בין בעלי עסקים,<br />
              מפרסמים ויוצרי תוכן{" "}
              <span style={{ color: "#f472b6", fontWeight: 800 }}>באינסטגרם</span>
            </p>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              Matchly עוזרת לבעלי עסקים ולמפרסמים למצוא יוצרי תוכן מתאימים לקמפיינים באינסטגרם, וליוצרי תוכן לקבל הזדמנויות לשיתופי פעולה בתשלום.
            </p>
          </div>

          {/* Woman photo */}
          <div className="relative shrink-0 w-72 h-80 flex items-end justify-center">
            {/* Glow behind photo */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-75" style={{ background: "radial-gradient(circle, hsl(var(--brand-purple)), transparent 70%)" }} />
            <img
              src={heroImage}
              alt="creator"
              className="relative z-10 h-full w-full object-contain object-bottom"
            />
            {/* Floating Instagram badge */}
            <div
              className="absolute top-6 left-2 z-20 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            >
              <Instagram size={28} className="text-white" />
            </div>
          </div>
        </div>

        {/* Value cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {/* Advertisers */}
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}>
                <Briefcase size={14} className="text-white" />
              </div>
              <span className="text-sm font-extrabold text-white">לבעלי עסקים ומפרסמים</span>
            </div>
            <ul className="space-y-1.5">
              {["למצוא יוצרי תוכן רלוונטיים מהר יותר", "לחסוך זמן בחיפוש ידני", "לקבל התאמות מדויקות יותר", "להתמקד בתוצאות ו-ROI"].map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-white/65 leading-snug">
                  <span className="text-pink-400 shrink-0 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>
                <Star size={14} className="text-white" />
              </div>
              <span className="text-sm font-extrabold text-white">ליוצרי תוכן</span>
            </div>
            <ul className="space-y-1.5">
              {["לקבל הזדמנויות לשיתופי פעולה בתשלום", "להיחשף לבעלי עסקים ומפרסמים", "לבחור קמפיינים מתאימים", "לגדול דרך שיתופי פעולה"].map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-white/65 leading-snug">
                  <span className="text-cyan-400 shrink-0 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right: actions panel — unchanged */}
      <div className="w-[380px] flex flex-col justify-center px-12 py-16 bg-white shadow-2xl gap-4">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-2">מוכן להתחיל?</h2>
          <p className="text-gray-400 text-sm leading-relaxed">בחר את הסוג שלך וגלה את ההזדמנויות המתאימות לך</p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          המשך
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onCreatorJoin}
          className="w-full py-3.5 rounded-2xl text-gray-500 font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          אני יוצר תוכן — כניסה
        </button>
      </div>
    </div>
  );
}

/* ─── Screen 2: Benefits ──────────────────────────────────────────── */
function BenefitsScreen({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const benefits = [
    {
      icon: <Zap size={24} className="text-white" />,
      bg: "linear-gradient(135deg, #f97316, #ec4899)",
      title: "מצא יוצרי תוכן מהר יותר",
      desc: "במקום חיפוש ידני של שעות — קבל התאמות תוך שניות",
    },
    {
      icon: <Target size={24} className="text-white" />,
      bg: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      title: "חסוך זמן על חיפוש ידני",
      desc: "המערכת מנתחת תחום, תקציב ומיקום ומוצאת את המתאימים ביותר",
    },
    {
      icon: <TrendingUp size={24} className="text-white" />,
      bg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      title: "התאמות טובות יותר לקמפיין",
      desc: "ניקוד התאמה חכם שמסביר למה כל יוצר מתאים לך",
    },
    {
      icon: <Users size={24} className="text-white" />,
      bg: "linear-gradient(135deg, #10b981, #06b6d4)",
      title: "ROI מדיד ותוצאות ברורות",
      desc: "התמקדו בתוצאות עסקיות, לא בחיפוש ופילטור",
    },
  ];

  return (
    <div className="flex w-full min-h-screen">
      {/* Left sidebar */}
      <div
        className="w-80 flex flex-col justify-center px-12 py-20 relative overflow-hidden shrink-0"
        style={{ background: "linear-gradient(160deg, #1a0533 0%, #2d0a4e 60%, #1f0a3d 100%)" }}
      >
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-4">למפרסמים</p>
          <h2 className="text-4xl font-black text-white mb-5 leading-tight">למה Matchly?</h2>
          <p className="text-white/60 text-base leading-relaxed">היתרונות שעושים את ההבדל בין קמפיין בינוני לקמפיין מצוין</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 px-12 py-16 grid grid-cols-2 gap-5 content-center">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: b.bg }}>
                {b.icon}
              </div>
              <div>
                <p className="font-bold text-base text-gray-900 mb-1">{b.title}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="px-12 py-8 bg-white border-t border-gray-100 flex gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} />
            חזרה
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
          >
            המשך
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 3: CTA ───────────────────────────────────────────────── */
function CtaScreen({ onBack, onStart, onCreatorJoin }: { onBack: () => void; onStart: () => void; onCreatorJoin?: () => void }) {
  return (
    <div className="flex w-full min-h-screen">
      {/* Left: dark hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-16 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #1a0533 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--brand-pink)), transparent 60%)" }} />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="w-28 h-28 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}>
            <Megaphone size={52} className="text-white" />
          </div>

          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            מוכן להתחיל<br />
            <span style={{ background: "linear-gradient(135deg, #f9a8d4, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              לפרסם?
            </span>
          </h2>

          <p className="text-white/60 text-lg leading-relaxed max-w-md mx-auto">
            צור קמפיין עכשיו וקבל 3 יוצרי תוכן מתאימים תוך פחות מדקה
          </p>

          <div className="flex items-center justify-center gap-14 mt-14">
            {[
              { val: "15+", label: "יוצרי תוכן" },
              { val: "< 60s", label: "זמן התאמה" },
              { val: "Instagram", label: "פלטפורמה" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.val}</div>
                <div className="text-xs text-white/50 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: actions panel */}
      <div className="w-[420px] flex flex-col justify-center px-14 py-16 bg-white shadow-2xl gap-4">
        <div className="mb-8">
          <h3 className="text-3xl font-black text-gray-900 mb-3">הצעד הראשון</h3>
          <p className="text-gray-400 text-base leading-relaxed">תאר את הקמפיין שלך ואנחנו נמצא את יוצרי התוכן המתאימים</p>
        </div>
        <button
          onClick={onStart}
          className="w-full py-5 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          <Megaphone size={22} />
          צור קמפיין עכשיו
        </button>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} />
            חזרה
          </button>
          <button
            onClick={onCreatorJoin}
            className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            אני יוצר תוכן
          </button>
        </div>
      </div>
    </div>
  );
}
