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

      {/* ── Influencer illustration banner ── */}
      <div className="relative z-10 px-5 pb-8">
        <div
          className="relative rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            height: 220,
            background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 30%, #e1bee7 70%, #d1c4e9 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-4 left-6 w-16 h-16 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #f48fb1, transparent)" }} />
          <div className="absolute bottom-6 right-8 w-20 h-20 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #ce93d8, transparent)" }} />

          {/* SVG illustration — content creator with phone */}
          <svg viewBox="0 0 220 200" className="h-full w-auto relative z-10 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tripod leg left */}
            <line x1="138" y1="170" x2="118" y2="198" stroke="#37474f" strokeWidth="4" strokeLinecap="round"/>
            {/* Tripod leg right */}
            <line x1="138" y1="170" x2="158" y2="198" stroke="#37474f" strokeWidth="4" strokeLinecap="round"/>
            {/* Tripod stem */}
            <line x1="138" y1="130" x2="138" y2="172" stroke="#37474f" strokeWidth="4" strokeLinecap="round"/>
            {/* Phone body */}
            <rect x="120" y="90" width="36" height="56" rx="6" fill="#90caf9" stroke="#37474f" strokeWidth="2"/>
            {/* Phone screen */}
            <rect x="124" y="95" width="28" height="42" rx="3" fill="#1565c0" opacity="0.6"/>
            {/* Camera dot */}
            <circle cx="138" cy="93" r="2.5" fill="#37474f"/>
            {/* Tripod clamp */}
            <rect x="130" y="125" width="16" height="8" rx="3" fill="#546e7a"/>

            {/* Body — red sweater */}
            <ellipse cx="82" cy="148" rx="28" ry="32" fill="#e53935"/>
            {/* Neck */}
            <rect x="76" y="105" width="12" height="16" rx="4" fill="#ffccbc"/>
            {/* Head */}
            <circle cx="82" cy="88" r="22" fill="#ffccbc"/>
            {/* Hair */}
            <path d="M60 82 Q62 58 82 56 Q102 58 104 82 Q100 65 82 63 Q64 65 60 82Z" fill="#1a237e"/>
            {/* Hair sides */}
            <path d="M60 82 Q55 95 60 108 Q63 95 62 88Z" fill="#1a237e"/>
            <path d="M104 82 Q109 95 104 108 Q101 95 102 88Z" fill="#1a237e"/>
            {/* Eyes */}
            <ellipse cx="75" cy="89" rx="3" ry="3.5" fill="#37474f"/>
            <ellipse cx="89" cy="89" rx="3" ry="3.5" fill="#37474f"/>
            {/* Eye shine */}
            <circle cx="76" cy="88" r="1" fill="white"/>
            <circle cx="90" cy="88" r="1" fill="white"/>
            {/* Smile */}
            <path d="M75 96 Q82 102 89 96" stroke="#37474f" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Lips */}
            <path d="M77 98 Q82 101 87 98" stroke="#e91e63" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

            {/* Left arm raised — making heart */}
            <path d="M54 140 Q40 120 38 95 Q36 80 50 78 Q58 76 62 88" stroke="#e53935" strokeWidth="14" strokeLinecap="round" fill="none"/>
            {/* Left hand */}
            <ellipse cx="50" cy="72" rx="9" ry="8" fill="#ffccbc"/>

            {/* Right arm raised — making heart */}
            <path d="M110 140 Q124 120 126 95 Q128 80 114 78 Q106 76 102 88" stroke="#e53935" strokeWidth="14" strokeLinecap="round" fill="none"/>
            {/* Right hand */}
            <ellipse cx="128" cy="68" rx="8" ry="8" fill="#ffccbc"/>

            {/* Heart shape between hands */}
            <path d="M70 68 Q72 58 80 62 Q82 64 82 64 Q82 64 84 62 Q92 58 94 68 Q96 76 82 84 Q68 76 70 68Z" fill="#e91e63" opacity="0.85"/>

            {/* Floating hearts */}
            <path d="M152 70 Q153 66 157 68 Q158 69 158 69 Q158 69 159 68 Q163 66 164 70 Q165 73 158 77 Q151 73 152 70Z" fill="#ec407a"/>
            <path d="M162 52 Q163 49 166 50 Q167 51 167 51 Q167 51 168 50 Q171 49 172 52 Q173 55 167 58 Q161 55 162 52Z" fill="#f06292" opacity="0.7"/>
            <path d="M170 36 Q171 34 173 35 Q174 35 174 35 Q174 35 175 35 Q177 34 178 36 Q179 38 174 40 Q169 38 170 36Z" fill="#f48fb1" opacity="0.5"/>
          </svg>

          {/* Instagram badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-2xl px-2.5 py-1.5 border border-white/70">
            <Instagram size={13} className="text-pink-600" />
            <span className="text-pink-700 text-[11px] font-extrabold">Instagram</span>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-3 right-4 left-4">
            <p className="font-extrabold text-sm leading-tight" style={{ color: "#6a1b9a" }}>יוצרי תוכן × בעלי עסקים</p>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#9c4dcc" }}>שיתופי פעולה שמייצרים תוצאות אמיתיות</p>
          </div>
        </div>
      </div>

    </div>
  );
}
