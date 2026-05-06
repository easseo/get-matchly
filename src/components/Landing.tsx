import { Sparkles } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-mesh relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand opacity-30 blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-40 h-40 rounded-full bg-brand opacity-20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <header className="relative z-10 px-6 pt-8 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-brand flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold text-brand">Matchly</span>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-soft mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">חכם. מהיר. מדויק.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-brand">3 יוצרי תוכן</span>
          <br />
          <span className="text-foreground">שמתאימים בול</span>
          <br />
          <span className="text-foreground">לעסק שלך</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          ב-60 שניות. בלי חיפוש. בלי ניחוש.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-primary-foreground bg-brand rounded-full shadow-glow hover:scale-105 transition-bounce animate-pulse-glow animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Sparkles className="w-5 h-5" />
          מצא לי יוצרים
        </button>

        <div className="grid grid-cols-3 gap-4 mt-20 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {[
            { num: "60", label: "שניות" },
            { num: "3", label: "יוצרים" },
            { num: "92%", label: "התאמה" },
          ].map((s) => (
            <div key={s.label} className="bg-card/70 backdrop-blur rounded-2xl p-4 shadow-soft border border-border">
              <div className="text-2xl font-black text-brand">{s.num}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
