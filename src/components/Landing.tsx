import { Instagram, Briefcase, Sparkles } from "lucide-react";
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
          <p className="text-center text-[10px] font-bold text-emerald-400 mt-1.5">✓ חינם לחלוטין</p>
        </div>

        {/* Creators card */}
        <div
          className="flex flex-col rounded-2xl p-4 border"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderColor: "hsl(322 85% 58% / 0.35)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "hsl(322 85% 58% / 0.25)", border: "1px solid hsl(322 85% 58% / 0.4)" }}>
              <Instagram size={14} className="text-pink-300" />
            </div>
            <span className="text-xs font-extrabold text-white leading-tight">ליוצרי תוכן</span>
          </div>
          <ul className="space-y-1.5 flex-1 mb-4">
            {["קבלו הצעות תשלום מעסקים", "בחרו קמפיינים שמתאימים לכם", "הגישו הצעת מחיר בקלות", "גדלו דרך שיתופי פעולה"].map(item => (
              <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/65 leading-snug">
                <span className="text-pink-400 shrink-0 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <button
            onClick={onCreatorJoin}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}
          >
            <Instagram size={12} />
            אני יוצר/ת תוכן
          </button>
          <p className="text-center text-[10px] font-bold text-emerald-400 mt-1.5">✓ חינם לחלוטין</p>
        </div>
      </div>

      {/* ── Influencer image banner ── */}
      <div className="relative z-10 px-5 pb-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 180 }}>

          {/* 4-photo mosaic grid */}
          <div className="grid grid-cols-4 h-full gap-0.5">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80",
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
              "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80",
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ))}
          </div>

          {/* Instagram gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(131,58,180,0.6) 0%, rgba(253,29,29,0.4) 50%, rgba(252,176,69,0.35) 100%)" }}
          />
          {/* Bottom fade to page bg */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,5,51,0.82) 0%, transparent 50%)" }} />

          {/* Instagram badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-2xl px-2.5 py-1.5 border border-white/25">
            <Instagram size={13} className="text-white" />
            <span className="text-white text-[11px] font-extrabold">Instagram</span>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-3 right-4 left-4">
            <p className="text-white font-extrabold text-sm leading-tight">יוצרי תוכן × מותגים</p>
            <p className="text-white/65 text-[11px] mt-0.5 font-medium">שיתופי פעולה שמייצרים תוצאות אמיתיות</p>
          </div>
        </div>
      </div>

    </div>
  );
}
