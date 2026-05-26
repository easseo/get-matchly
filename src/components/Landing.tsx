import { useState } from "react";
import { Instagram, Megaphone, Sparkles } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

type Step = "welcome" | "advertiser-next" | "creator-next";

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [dir, setDir] = useState<"forward" | "back">("forward");

  const go = (next: Step, direction: "forward" | "back" = "forward") => {
    setDir(direction);
    setStep(next);
  };

  return (
    <div className="relative h-screen overflow-hidden" dir="rtl">
      <div
        key={step}
        className="h-full"
        style={{
          animation: `${dir === "forward" ? "lSlideIn" : "lSlideBack"} 0.32s cubic-bezier(0.4,0,0.2,1) both`,
        }}
      >
        {step === "welcome" && (
          <WelcomeStep
            onAdvertiser={() => onStart()}
            onCreator={() => onCreatorJoin?.()}
          />
        )}
        {/* Placeholder for future steps */}
      </div>

      <style>{`
        @keyframes lSlideIn {
          from { transform: translateX(48px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes lSlideBack {
          from { transform: translateX(-48px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Step 1: Welcome ─────────────────────────────────────────────── */
function WelcomeStep({
  onAdvertiser,
  onCreator,
}: {
  onAdvertiser: () => void;
  onCreator: () => void;
}) {
  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "linear-gradient(170deg, #1a0533 0%, #2d0a4e 45%, #1c0a3a 100%)" }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-40"
          style={{ background: "hsl(var(--brand-pink))" }}
        />
        <div
          className="absolute bottom-0 -left-20 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "hsl(var(--brand-purple))" }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex flex-col items-center pt-12 pb-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-5">
          <img src={matchlyIcon} alt="Matchly" className="w-9 h-9 object-contain" />
          <span className="text-2xl font-black text-white tracking-tight">Matchly</span>
        </div>

        {/* Instagram badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-7">
          <Instagram size={12} className="text-pink-300" />
          <span className="text-[11px] font-bold text-white/80 tracking-wide">Instagram only</span>
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-black text-white text-center leading-snug mb-3">
          ברוכים הבאים ל-Matchly
        </h1>

        {/* Subtitle */}
        <p className="text-white/65 text-sm text-center leading-relaxed max-w-[280px]">
          הדרך הפשוטה לחבר בין בעלי עסקים, מפרסמים ויוצרי תוכן באינסטגרם
        </p>
      </div>

      {/* ── Value cards ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 gap-3">
        {/* For advertisers */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
            >
              <Megaphone size={14} className="text-white" />
            </div>
            <span className="text-sm font-extrabold text-white">בעלי עסקים ומפרסמים</span>
          </div>
          <ul className="space-y-1.5">
            {[
              "למצוא יוצרי תוכן רלוונטיים מהר יותר",
              "לחסוך זמן בחיפוש ידני",
              "לקבל התאמות מדויקות יותר",
              "להתמקד בתוצאות ו-ROI",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-white/70 font-medium leading-snug">
                <span className="text-pink-400 mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* For creators */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-extrabold text-white">יוצרי תוכן</span>
          </div>
          <ul className="space-y-1.5">
            {[
              "לקבל הזדמנויות לשיתופי פעולה בתשלום",
              "להיחשף לבעלי עסקים ומפרסמים",
              "לבחור קמפיינים מתאימים",
              "לגדול דרך שיתופי פעולה",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-white/70 font-medium leading-snug">
                <span className="text-cyan-400 mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── CTA buttons ── */}
      <div className="relative z-10 px-5 pb-8 pt-4 flex flex-col gap-3">
        <button
          onClick={onAdvertiser}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          אני בעל עסק / מפרסם
        </button>
        <button
          onClick={onCreator}
          className="w-full py-4 rounded-2xl font-extrabold text-sm border border-white/25 text-white/90 active:scale-[0.98] transition-transform"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          אני יוצר תוכן
        </button>
        <p className="text-center text-[11px] text-white/35 font-medium">
          אפשר לשנות את הבחירה בהמשך
        </p>
      </div>
    </div>
  );
}
