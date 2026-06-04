import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Clock, Image as ImageIcon, Info, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import matchlyIcon from "@/assets/matchly-icon.png";

const contentTypes = [
  {
    key: "reel",
    label: "רילס",
    sublabel: "סרטון קצר עד 90 שניות",
    icon: Film,
    placeholder: "600",
  },
  {
    key: "story",
    label: "סטורי",
    sublabel: "תמונה או סרטון עד 15 שניות",
    icon: Clock,
    placeholder: "200",
  },
  {
    key: "post",
    label: "פוסט",
    sublabel: "תמונה או קרוסלה בפיד",
    icon: ImageIcon,
    placeholder: "400",
  },
];

export default function PricingSetup() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Small delay to simulate save
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "המחירון נשמר!", description: "תוכלו לעדכן אותו בכל עת דרך הגדרות הפרופיל" });
    navigate("/app/creator/dashboard");
  };

  const handleSkip = () => {
    navigate("/app/creator/dashboard");
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-3">
        <img src={matchlyIcon} alt="Matchly" className="w-9 h-9 object-contain rounded-xl shrink-0" />
        <div>
          <div className="font-extrabold text-gray-900 text-base leading-tight">המחירון שלי</div>
          <div className="text-xs text-gray-400 font-medium">שלב 1 מתוך 1</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full w-full" style={{ background: "var(--gradient-brand)" }} />
        </div>
      </div>

      <div className="flex-1 px-5 pb-32 space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">המחירון שלי</h1>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">
            המחירים יוצגו למפרסמים בפרופיל שלך ויסייעו לשיפור ההתאמות
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-purple-50 border border-purple-100 rounded-2xl p-3.5">
          <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
          <p className="text-xs text-purple-700 font-medium leading-relaxed">
            המחירים הם עבור תוצר בודד. מפרסמים יכולים לבקש כמויות שונות ולהתאים את התקציב בהתאם.
          </p>
        </div>

        {/* Price cards */}
        <div className="space-y-3">
          {contentTypes.map(({ key, label, sublabel, icon: Icon, placeholder }) => (
            <div key={key} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0 text-right">
                <div className="font-extrabold text-gray-900 text-base">{label}</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5 leading-snug">{sublabel}</div>
              </div>

              {/* Price input */}
              <div className="relative shrink-0 w-28">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 pointer-events-none">₪</span>
                <input
                  type="number"
                  min={0}
                  placeholder={placeholder}
                  value={prices[key] ?? ""}
                  onChange={e => setPrices(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-7 pl-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-20 backdrop-blur-xl bg-white/85 border-t border-gray-100 px-5 pt-3 pb-6 space-y-2.5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: "var(--gradient-brand)" }}
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : "שמירת מחירון"}
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> דלג לעת עתה
        </button>
      </div>
    </div>
  );
}
