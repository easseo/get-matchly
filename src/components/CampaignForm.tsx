import { useState } from "react";
import { ArrowLeft, Utensils, Shirt, Dumbbell, Sparkles as SparkleIcon, MoreHorizontal, Users, Eye, ShoppingBag, MapPin, Instagram, Film, Image as ImageIcon, Clock } from "lucide-react";

export type CampaignData = {
  business: string;
  goal: string;
  budget: number;
  location: string;
  platform: string;
  contentType: string;
};

interface CampaignFormProps {
  onSubmit: (data: CampaignData) => void;
  onBack: () => void;
}

const businesses = [
  { value: "מסעדה", icon: Utensils },
  { value: "אופנה", icon: Shirt },
  { value: "כושר", icon: Dumbbell },
  { value: "ביוטי", icon: SparkleIcon },
  { value: "אחר", icon: MoreHorizontal },
];

const goals = [
  { value: "יותר לקוחות", icon: Users },
  { value: "יותר חשיפה", icon: Eye },
  { value: "יותר מכירות", icon: ShoppingBag },
];

const contentTypes = [
  { value: "רילס", icon: Film },
  { value: "סטורי", icon: Clock },
  { value: "פוסט", icon: ImageIcon },
];

const cities = ["כל הארץ", "תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "פתח תקווה", "אשדוד", "הרצליה", "נתניה"];

export default function CampaignForm({ onSubmit, onBack }: CampaignFormProps) {
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState(2000);
  const [location, setLocation] = useState("כל הארץ");
  const [contentType, setContentType] = useState("");

  const canSubmit = business && goal && contentType;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ business, goal, budget, location, platform: "Instagram", contentType });
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -mr-2 rounded-full hover:bg-muted tap-scale">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          <span className="font-bold text-brand">צור קמפיין</span>
          <div className="w-9" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-7 pb-32">
        {/* Business */}
        <Section title="סוג העסק" subtitle="במה אתם עוסקים?">
          <div className="grid grid-cols-3 gap-2.5">
            {businesses.map(({ value, icon: Icon }) => (
              <ChipCard key={value} active={business === value} onClick={() => setBusiness(value)}>
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-bold">{value}</span>
              </ChipCard>
            ))}
          </div>
        </Section>

        {/* Goal */}
        <Section title="המטרה שלך" subtitle="מה הכי חשוב לקמפיין?">
          <div className="grid grid-cols-3 gap-2.5">
            {goals.map(({ value, icon: Icon }) => (
              <ChipCard key={value} active={goal === value} onClick={() => setGoal(value)}>
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold text-center leading-tight">{value}</span>
              </ChipCard>
            ))}
          </div>
        </Section>

        {/* Budget */}
        <Section title="תקציב" subtitle="כמה תרצו להשקיע?">
          <div className="bg-card rounded-3xl p-5 shadow-card border border-border">
            <div className="flex items-baseline justify-center gap-1.5 mb-5">
              <span className="text-4xl font-black text-brand">{budget.toLocaleString()}</span>
              <span className="text-lg font-bold text-muted-foreground">₪</span>
            </div>
            <input
              type="range" min={500} max={5000} step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer slider-brand"
              style={{ background: `linear-gradient(to left, hsl(var(--brand-pink)) 0%, hsl(var(--brand-purple)) ${((budget - 500) / 4500) * 100}%, hsl(var(--muted)) ${((budget - 500) / 4500) * 100}%)` }}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2 font-semibold">
              <span>5,000 ₪</span>
              <span>500 ₪</span>
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section title="מיקום" subtitle="איפה הקהל שלך?">
          <div className="relative">
            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-4 pr-12 pl-4 font-semibold shadow-soft appearance-none cursor-pointer focus:ring-2 focus:ring-primary outline-none"
            >
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </Section>

        {/* Platform */}
        <Section title="פלטפורמה" subtitle="איפה הקמפיין יעלה?">
          <div className="bg-brand p-0.5 rounded-2xl shadow-glow">
            <div className="bg-card rounded-[14px] py-3.5 px-4 flex items-center gap-3">
              <Instagram className="w-5 h-5" style={{ color: "hsl(var(--brand-pink))" }} />
              <span className="font-bold">Instagram</span>
              <span className="mr-auto text-[11px] px-2 py-1 rounded-full bg-brand-soft font-bold text-foreground">פעיל</span>
            </div>
          </div>
        </Section>

        {/* Content type */}
        <Section title="סוג תוכן" subtitle="מה תרצו שהיוצרים יפיקו?">
          <div className="grid grid-cols-3 gap-2.5">
            {contentTypes.map(({ value, icon: Icon }) => (
              <ChipCard key={value} active={contentType === value} onClick={() => setContentType(value)}>
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-bold">{value}</span>
              </ChipCard>
            ))}
          </div>
        </Section>
      </main>

      {/* Sticky submit */}
      <div className="sticky bottom-0 z-20 backdrop-blur-lg bg-background/85 border-t border-border px-4 pt-3 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-full font-bold text-base text-primary-foreground bg-brand shadow-glow disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed tap-scale"
        >
          מצא לי יוצרים
        </button>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="animate-fade-in-up">
      <div className="mb-3">
        <h2 className="text-xl font-extrabold mb-0.5">{title}</h2>
        <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function ChipCard({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-bounce min-h-[80px] tap-scale ${
        active
          ? "bg-brand text-primary-foreground border-transparent shadow-glow"
          : "bg-card border-border"
      }`}
    >
      {children}
    </button>
  );
}
