import { Instagram, Briefcase, ChevronLeft, Sparkles, Check, Star } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

const MINI_CREATORS = [
  { initials: "נל", hue: 336, match: 98 },
  { initials: "יכ", hue: 290, match: 94 },
  { initials: "מב", hue: 264, match: 91 },
];

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-ink grain text-white" dir="rtl">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full blur-[90px] opacity-35 animate-aurora" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute top-1/2 -left-28 w-72 h-72 rounded-full blur-[100px] opacity-25 animate-aurora" style={{ background: "hsl(var(--brand-purple))", animationDelay: "-6s" }} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-8 pb-2">
        <span className="w-8 h-8 rounded-[10px] bg-white flex items-center justify-center shadow-lg shadow-black/30">
          <img src={matchlyIcon} alt="" className="w-5 h-5 object-contain" />
        </span>
        <span className="text-base font-bold tracking-tight">Matchly</span>
      </div>

      {/* Hero */}
      <div className="px-6 pt-8 pb-6 animate-fade-in-up">
        <span className="eyebrow px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/65 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          שיתופי פעולה באינסטגרם
        </span>
        <h1 className="font-display text-[44px] leading-[1.04] font-bold mt-5 mb-4">
          היוצרים הנכונים.
          <br />
          <span className="text-brand">לעסק הנכון.</span>
        </h1>
        <p className="text-[15px] text-white/60 leading-relaxed">
          Matchly מחברת בין בעלי עסקים ומפרסמים ליוצרי תוכן — עם 3 התאמות מדויקות, תוך פחות מדקה.
        </p>
      </div>

      {/* Mini product preview */}
      <div className="px-6 mb-7 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <div className="glass-ink rounded-2xl p-4 flex items-center gap-4">
          <div className="flex -space-x-3 space-x-reverse">
            {MINI_CREATORS.map((c) => (
              <span key={c.initials} className="w-10 h-10 rounded-full p-[2px]" style={{ background: "var(--gradient-brand)" }}>
                <span className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, hsl(${c.hue} 45% 28%), hsl(${c.hue} 40% 16%))` }}>
                  {c.initials}
                </span>
              </span>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">3 התאמות מושלמות</p>
            <p className="text-[11px] text-white/45 mt-0.5">התאמה ממוצעת <span className="text-gold font-bold ltr-num">94%</span></p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="ltr-num">4.9</span>
          </div>
        </div>
      </div>

      {/* Role choices */}
      <div className="flex-1 px-6 pb-8 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "220ms" }}>
        <RoleCard
          onClick={onStart}
          primary
          icon={<Briefcase size={18} />}
          title="אני בעל עסק / מפרסם"
          items={["יוצרים רלוונטיים, בלי חיפוש ידני", "התאמות מבוססות נתונים"]}
        />
        <RoleCard
          onClick={onCreatorJoin}
          icon={<Instagram size={18} />}
          title="אני יוצר/ת תוכן"
          items={["הצעות בתשלום מעסקים", "בחירה בקמפיינים שמתאימים לך"]}
        />

        <p className="mt-2 text-center text-[11px] text-white/40 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-gold" />
          ההצטרפות חינם לחלוטין
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  onClick, primary, icon, title, items,
}: {
  onClick?: () => void; primary?: boolean; icon: React.ReactNode; title: string; items: string[];
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-right rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 active:scale-[0.98] ${
        primary
          ? "bg-white text-ink shadow-[0_20px_40px_-18px_hsl(var(--brand-pink)/0.7)]"
          : "glass-ink text-white"
      }`}
    >
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
        primary ? "bg-brand text-white shadow-cta" : "border border-gold/30 bg-white/[0.04] text-gold"
      }`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-[15px] leading-tight">{title}</span>
        <span className="mt-1.5 flex flex-col gap-0.5">
          {items.map((it) => (
            <span key={it} className={`flex items-center gap-1.5 text-[11.5px] ${primary ? "text-ink/55" : "text-white/50"}`}>
              <Check className={`w-3 h-3 shrink-0 ${primary ? "text-primary" : "text-gold"}`} strokeWidth={2.5} />
              {it}
            </span>
          ))}
        </span>
      </span>
      <ChevronLeft className={`w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-1 ${primary ? "text-ink/40" : "text-white/40"}`} />
    </button>
  );
}
