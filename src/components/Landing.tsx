import { useState } from "react";
import { Instagram, Megaphone, Users, Zap, Target, TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

const SCREENS = ["intro", "benefits", "cta"] as const;
type Screen = (typeof SCREENS)[number];

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [dir, setDir] = useState<"forward" | "back">("forward");

  const go = (next: Screen, direction: "forward" | "back" = "forward") => {
    setDir(direction);
    setScreen(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background" dir="rtl">
      {/* Progress dots */}
      <div className="absolute top-5 left-0 right-0 flex justify-center gap-2 z-20">
        {SCREENS.map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === screen ? "w-8 bg-brand" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Screens */}
      <div
        key={screen}
        className="min-h-screen w-full flex flex-col"
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
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Left/Top: Gradient hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center relative overflow-hidden lg:min-h-screen"
        style={{ background: "linear-gradient(160deg, #1a0533 0%, #2d0a4e 40%, #1f0a3d 100%)" }}
      >
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-purple))" }} />

        <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <img src={matchlyIcon} alt="Matchly" className="w-14 h-14 lg:w-20 lg:h-20 object-contain" />
            <span className="text-3xl lg:text-5xl font-black text-white tracking-tight">Matchly</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <Instagram size={14} className="text-pink-300" />
            <span className="text-xs font-bold text-white/80">Instagram only</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
            חיבור מפרסמים<br />
            עם יוצרי תוכן<br />
            <span style={{ background: "linear-gradient(135deg, #f9a8d4, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              באינסטגרם
            </span>
          </h1>

          <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-sm lg:max-w-md">
            Matchly מחברת בין מפרסמים לבין יוצרי תוכן מתאימים לשיתופי פעולה בתשלום באינסטגרם.
          </p>

          {/* Stats — visible on desktop inside the hero */}
          <div className="hidden lg:flex items-center justify-center gap-10 mt-12">
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

      {/* Right/Bottom: Actions */}
      <div className="px-6 py-8 bg-white flex flex-col gap-3 lg:w-96 lg:flex-col lg:justify-center lg:px-12 lg:py-0 lg:shadow-2xl">
        <div className="hidden lg:block mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">מוכן להתחיל?</h2>
          <p className="text-gray-400 text-sm">גלה את היתרונות וצור את הקמפיין הראשון שלך</p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          המשך
          <ChevronLeft size={18} />
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
      icon: <Zap size={20} className="text-white" />,
      bg: "linear-gradient(135deg, #f97316, #ec4899)",
      title: "מצא יוצרי תוכן מהר יותר",
      desc: "במקום חיפוש ידני של שעות — קבל התאמות תוך שניות",
    },
    {
      icon: <Target size={20} className="text-white" />,
      bg: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      title: "חסוך זמן על חיפוש ידני",
      desc: "המערכת מנתחת תחום, תקציב ומיקום ומוצאת את המתאימים ביותר",
    },
    {
      icon: <TrendingUp size={20} className="text-white" />,
      bg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
      title: "התאמות טובות יותר לקמפיין",
      desc: "ניקוד התאמה חכם שמסביר למה כל יוצר מתאים לך",
    },
    {
      icon: <Users size={20} className="text-white" />,
      bg: "linear-gradient(135deg, #10b981, #06b6d4)",
      title: "ROI מדיד ותוצאות ברורות",
      desc: "התמקדו בתוצאות עסקיות, לא בחיפוש ופילטור",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      {/* Left sidebar on desktop */}
      <div
        className="hidden lg:flex lg:w-80 lg:flex-col lg:justify-center lg:px-12 lg:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0533 0%, #2d0a4e 60%, #1f0a3d 100%)" }}
      >
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="relative z-10">
          <p className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-3">למפרסמים</p>
          <h2 className="text-3xl font-black text-white mb-4">למה Matchly?</h2>
          <p className="text-white/60 text-sm leading-relaxed">היתרונות שעושים את ההבדל בין קמפיין בינוני לקמפיין מצוין</p>
        </div>
      </div>

      {/* Header — mobile only */}
      <div className="lg:hidden px-6 pt-14 pb-6 bg-white border-b border-gray-100">
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">למפרסמים</p>
        <h2 className="text-2xl font-black text-gray-900">למה Matchly?</h2>
        <p className="text-sm text-gray-400 mt-1">היתרונות שעושים את ההבדל</p>
      </div>

      {/* Benefits */}
      <div className="flex-1 flex flex-col">
        <div className="hidden lg:block px-12 pt-16 pb-6">
          <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">למפרסמים</p>
          <h2 className="text-3xl font-black text-gray-900">למה Matchly?</h2>
          <p className="text-sm text-gray-400 mt-1">היתרונות שעושים את ההבדל</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-12 py-5 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 content-start">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-4 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: b.bg }}>
                {b.icon}
              </div>
              <div>
                <p className="font-bold text-sm lg:text-base text-gray-900 mb-0.5 lg:mb-1">{b.title}</p>
                <p className="text-xs lg:text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom buttons */}
        <div className="px-6 lg:px-12 py-6 bg-white border-t border-gray-100 flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-1 px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
            חזרה
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
          >
            המשך
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Screen 3: CTA ───────────────────────────────────────────────── */
function CtaScreen({ onBack, onStart, onCreatorJoin }: { onBack: () => void; onStart: () => void; onCreatorJoin?: () => void }) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #1a0533 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--brand-pink)), transparent 60%)" }} />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}>
            <Megaphone size={36} className="text-white lg:hidden" />
            <Megaphone size={52} className="text-white hidden lg:block" />
          </div>

          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
            מוכן להתחיל<br />
            <span style={{ background: "linear-gradient(135deg, #f9a8d4, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              לפרסם?
            </span>
          </h2>

          <p className="text-white/60 text-sm lg:text-base leading-relaxed max-w-xs lg:max-w-sm mx-auto">
            צור קמפיין עכשיו וקבל 3 יוצרי תוכן מתאימים תוך פחות מדקה
          </p>

          <div className="flex items-center justify-center gap-8 lg:gap-12 mt-10">
            {[
              { val: "15+", label: "יוצרי תוכן" },
              { val: "< 60s", label: "זמן התאמה" },
              { val: "Instagram", label: "פלטפורמה" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl lg:text-2xl font-black text-white">{s.val}</div>
                <div className="text-[10px] lg:text-xs text-white/50 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-8 bg-white flex flex-col gap-3 lg:w-96 lg:justify-center lg:px-12 lg:py-0 lg:shadow-2xl">
        <div className="hidden lg:block mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-2">הצעד הראשון</h3>
          <p className="text-gray-400 text-sm">תאר את הקמפיין שלך ואנחנו נמצא את יוצרי התוכן המתאימים</p>
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          <Megaphone size={18} />
          צור קמפיין עכשיו
        </button>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
            חזרה
          </button>
          <button
            onClick={onCreatorJoin}
            className="flex-1 py-3.5 rounded-2xl text-gray-600 font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            אני יוצר תוכן
          </button>
        </div>
      </div>
    </div>
  );
}
