import { Sparkles } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden flex flex-col">
      {/* Floating decorations */}
      <div className="absolute top-16 right-6 w-40 h-40 rounded-full bg-brand opacity-30 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-24 left-6 w-44 h-44 rounded-full bg-brand opacity-20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <header className="relative z-10 px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-brand flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-extrabold text-brand">Matchly</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-5 pt-8 pb-8 text-center">
        <div className="inline-flex self-center items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border shadow-soft mb-6 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">חכם · מהיר · מדויק</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] mb-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-brand">3 יוצרי תוכן</span>
          <br />
          <span className="text-foreground">שמתאימים בול</span>
          <br />
          <span className="text-foreground">לעסק שלך</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground font-medium mb-10 animate-fade-in-up px-2" style={{ animationDelay: "0.2s" }}>
          תוך 60 שניות — בלי חיפושים, בלי ניחושים.
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { num: "60״", label: "שניות בלבד" },
            { num: "3", label: "יוצרים נבחרים" },
            { num: "92%", label: "דיוק התאמה" },
          ].map((s) => (
            <div key={s.label} className="bg-card/70 backdrop-blur rounded-2xl p-3 shadow-soft border border-border">
              <div className="text-xl font-black text-brand ltr-num">{s.num}</div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto safe-bottom animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={onStart}
            className="group relative w-full inline-flex items-center justify-center gap-3 py-5 text-base font-bold text-primary-foreground bg-brand rounded-full shadow-glow tap-scale animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5" />
            בואו נתחיל
          </button>
          <p className="text-xs text-muted-foreground font-medium mt-3">חינם · בלי הרשמה · בלי כרטיס אשראי</p>
        </div>
      </main>
    </div>
  );
}
