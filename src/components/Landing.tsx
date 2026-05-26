import { Instagram, Briefcase, Star } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";

interface LandingProps {
  onStart: () => void;
  onCreatorJoin?: () => void;
}

export default function Landing({ onStart, onCreatorJoin }: LandingProps) {
  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #1a0533 0%, #2d0a4e 45%, #1c0a3a 100%)" }}
      dir="rtl"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: "hsl(var(--brand-pink))" }} />
        <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full blur-3xl opacity-25" style={{ background: "hsl(var(--brand-purple))" }} />
      </div>

      {/* ── Header: logo only ── */}
      <div className="relative z-10 flex items-center px-5 pt-10 pb-4">
        <img src={matchlyIcon} alt="Matchly" className="w-8 h-8 object-contain" />
      </div>

      {/* ── Title ── */}
      <div className="relative z-10 px-5 pb-5 text-right">
        <h1 className="text-3xl font-black text-white leading-tight mb-2">
          ברוכים הבאים ל-Matchly
        </h1>
        <p className="text-base text-white/80 font-semibold leading-snug">
          הדרך הפשוטה לחבר בין בעלי עסקים,<br />
          מפרסמים ויוצרי תוכן{" "}
          <span style={{ color: "#f472b6", fontWeight: 800 }}>באינסטגרם</span>
        </p>
        <p className="text-white/50 text-xs leading-relaxed mt-2">
          Matchly עוזרת לבעלי עסקים ולמפרסמים למצוא יוצרי תוכן מתאימים לקמפיינים באינסטגרם, וליוצרי תוכן לקבל הזדמנויות לשיתופי פעולה בתשלום.
        </p>
      </div>

      {/* ── Value cards ── */}
      <div className="relative z-10 flex-1 px-5 pb-4 grid grid-cols-2 gap-3 content-start">

        {/* Advertisers card */}
        <div
          className="flex flex-col rounded-2xl p-4 border border-white/15"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="text-xs font-extrabold text-white leading-tight">לבעלי עסקים ומפרסמים</span>
          </div>
          <ul className="space-y-1.5 flex-1 mb-4">
            {["למצוא יוצרי תוכן רלוונטיים מהר יותר", "לחסוך זמן בחיפוש ידני", "לקבל התאמות מדויקות יותר", "להתחבר ליוצרים מתאימים במקום אחד"].map(item => (
              <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/65 leading-snug">
                <span className="text-pink-400 shrink-0 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
          >
            <Briefcase size={12} />
            אני בעל עסק / מפרסם
          </button>
        </div>

        {/* Creators card */}
        <div
          className="flex flex-col rounded-2xl p-4 border border-white/15"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Star size={14} className="text-white" />
            </div>
            <span className="text-xs font-extrabold text-white leading-tight">ליוצרי תוכן</span>
          </div>
          <ul className="space-y-1.5 flex-1 mb-4">
            {["לקבל הזדמנויות לשיתופי פעולה בתשלום", "להיחשף לבעלי עסקים ומפרסמים", "לבחור קמפיינים מתאימים", "לגדול דרך שיתופי פעולה"].map(item => (
              <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/65 leading-snug">
                <span className="text-pink-400 shrink-0 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <button
            onClick={onCreatorJoin}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-extrabold text-xs border border-white/25 hover:bg-white/10 transition-colors"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <Star size={12} />
            אני יוצר תוכן
          </button>
        </div>
      </div>

    </div>
  );
}
