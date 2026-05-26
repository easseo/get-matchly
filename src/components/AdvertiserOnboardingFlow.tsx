import { useState } from "react";
import { ChevronRight, ChevronLeft, Megaphone } from "lucide-react";

interface Props {
  onBack: () => void;
  onContinue: () => void;
}

type Step = "benefits" | "how";

export default function AdvertiserOnboardingFlow({ onBack, onContinue }: Props) {
  const [step, setStep] = useState<Step>("benefits");
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
        style={{ animation: `${dir === "forward" ? "afSlideIn" : "afSlideBack"} 0.32s cubic-bezier(0.4,0,0.2,1) both` }}
      >
        {step === "benefits" && <BenefitsStep onBack={onBack} onContinue={() => go("how")} />}
        {step === "how" && <HowItWorksStep onBack={() => go("benefits", "back")} onContinue={onContinue} />}
      </div>
      <style>{`
        @keyframes afSlideIn   { from { transform: translateX(48px);  opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes afSlideBack { from { transform: translateX(-48px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
      `}</style>
    </div>
  );
}

/* ─── Step 1: Benefits ────────────────────────────────────────────── */
function BenefitsStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const cards = [
    { emoji: "⚡", title: "מצא יוצרי תוכן מהר יותר", desc: "קבל התאמות במקום חיפוש ידני ממושך" },
    { emoji: "🎯", title: "התאמות מדויקות יותר", desc: "מצא יוצרי תוכן רלוונטיים לקמפיין שלך" },
    { emoji: "🤝", title: "שיתופי פעולה פשוטים", desc: "התחבר והתחל לעבוד במקום אחד" },
    { emoji: "💬", title: "תהליך מהיר ונוח", desc: "פחות חיפוש, יותר חיבורים רלוונטיים" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(170deg, #1a0533 0%, #2d0a4e 45%, #1c0a3a 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-25" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute bottom-0 -left-16 w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-purple))" }} />
      </div>

      <div className="relative z-10 pt-14 pb-5 px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-2 leading-tight">למה לבחור ב-Matchly?</h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
          חיבור פשוט ומהיר בין בעלי עסקים/מפרסמים ויוצרי תוכן
        </p>
      </div>

      <div className="relative z-10 flex-1 px-5 pb-4 grid grid-cols-2 gap-3 content-center">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex flex-col rounded-2xl p-4 border border-white/10 transition-transform hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 shrink-0" style={{ background: "rgba(255,255,255,0.10)" }}>
              {c.emoji}
            </div>
            <p className="font-extrabold text-sm text-white leading-tight mb-1">{c.title}</p>
            <p className="text-xs text-white/55 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 px-5 pt-3 pb-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1 px-5 py-4 rounded-2xl font-semibold text-sm text-white/70 border border-white/15 hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={16} />
          חזרה
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
        >
          המשך
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: How it works ────────────────────────────────────────── */
function HowItWorksStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const steps = [
    { emoji: "📋", num: "1", title: "צור קמפיין", desc: "הגדר מטרה, תקציב וקהל יעד" },
    { emoji: "🔍", num: "2", title: "אנחנו מנתחים", desc: "המערכת מדרגת יוצרים לפי התאמה" },
    { emoji: "✅", num: "3", title: "קבל 3 התאמות", desc: "יוצרי תוכן מדויקים לקמפיין שלך" },
    { emoji: "🚀", num: "4", title: "התחל לעבוד", desc: "שלח הצעה ותתחיל שיתוף פעולה" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(170deg, #1a0533 0%, #2d0a4e 45%, #1c0a3a 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute bottom-10 -right-16 w-56 h-56 rounded-full blur-3xl opacity-15" style={{ background: "hsl(var(--brand-purple))" }} />
      </div>

      <div className="relative z-10 pt-14 pb-5 px-6 text-center">
        <h2 className="text-2xl font-black text-white mb-2 leading-tight">איך זה עובד?</h2>
        <p className="text-white/60 text-sm leading-relaxed">
          4 צעדים פשוטים מקמפיין להתאמה
        </p>
      </div>

      <div className="relative z-10 flex-1 px-5 pb-4 flex flex-col gap-3 justify-center">
        {steps.map((s) => (
          <div
            key={s.num}
            className="flex items-center gap-4 rounded-2xl px-4 py-3.5 border border-white/10"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-base"
              style={{ background: "linear-gradient(135deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)))" }}
            >
              {s.num}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm text-white leading-tight">{s.title}</p>
              <p className="text-xs text-white/55 mt-0.5">{s.desc}</p>
            </div>
            <div className="text-xl shrink-0">{s.emoji}</div>
          </div>
        ))}
      </div>

      <div className="relative z-10 px-5 pt-3 pb-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1 px-5 py-4 rounded-2xl font-semibold text-sm text-white/70 border border-white/15 hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={16} />
          חזרה
        </button>
        <button
          onClick={onContinue}
          className="flex-1 py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
        >
          <Megaphone size={15} />
          יצירת חשבון
        </button>
      </div>
    </div>
  );
}
