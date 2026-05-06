import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LoadingProps {
  message?: string;
  onDone: () => void;
  duration?: number;
}

const steps = [
  "מנתחים את הקמפיין שלך...",
  "סורקים מאות יוצרי תוכן...",
  "מחשבים התאמה אופטימלית...",
  "כמעט מוכן ✨",
];

export default function Loading({ message, onDone, duration = 3500 }: LoadingProps) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const stepDuration = duration / steps.length;
    const interval = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, steps.length - 1));
    }, stepDuration);
    const timeout = setTimeout(onDone, duration);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [duration, onDone]);

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60" />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-brand rounded-full blur-2xl opacity-60 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-brand flex items-center justify-center animate-spin-slow shadow-glow">
            <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-brand" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", color: "transparent" } as React.CSSProperties} />
            </div>
          </div>
        </div>

        {message && (
          <p className="text-base font-semibold text-foreground mb-6 leading-relaxed px-2">
            {message}
          </p>
        )}

        <div className="space-y-2.5 w-full">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-2.5 justify-center transition-smooth ${
                i <= stepIdx ? "opacity-100" : "opacity-30"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${i <= stepIdx ? "bg-brand" : "bg-muted"}`} />
              <span className="text-xs font-semibold text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
