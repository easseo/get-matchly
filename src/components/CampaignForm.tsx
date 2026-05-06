import { useState, useMemo } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { ArrowLeft, Utensils, Shirt, Dumbbell, Sparkles as SparkleIcon, MoreHorizontal, Users, Eye, ShoppingBag, MapPin, Instagram, Film, Image as ImageIcon, Clock, Check, Minus, Plus, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ContentSelection = { type: string; qty: number };

export type CampaignData = {
  business: string;
  goal: string;
  budget: number;
  location: string;
  platform: string;
  contentType: string;
  contents: ContentSelection[];
  deadline?: string;
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
  { value: "רילס", plural: "רילסים", icon: Film },
  { value: "סטורי", plural: "סטוריז", icon: Clock },
  { value: "פוסט", plural: "פוסטים", icon: ImageIcon },
];

const cities = ["כל הארץ", "תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "פתח תקווה", "אשדוד", "הרצליה", "נתניה"];

const MIN_BUDGET = 100;
const MAX_BUDGET = 10000;
const MAX_QTY = 20;

function formatILS(n: number) {
  return `₪${n.toLocaleString("en-US")}`;
}

function getBudgetRange(value: number): [number, number] {
  const tiers: Array<[number, number, number]> = [
    [100, 100, 200],
    [200, 200, 400],
    [400, 400, 700],
    [700, 500, 1000],
    [1000, 1000, 2000],
    [2000, 2000, 4000],
    [4000, 3000, 6000],
    [6000, 5000, 8000],
    [8000, 6000, 10000],
    [10000, 8000, 12000],
  ];
  let chosen = tiers[0];
  for (const t of tiers) {
    if (value >= t[0]) chosen = t;
  }
  return [chosen[1], chosen[2]];
}

export default function CampaignForm({ onSubmit, onBack }: CampaignFormProps) {
  const [businessList, setBusinessList] = useState<string[]>([]);
  const [goalList, setGoalList] = useState<string[]>([]);
  const business = businessList.join(", ");
  const goal = goalList.join(", ");
  const toggleFromList = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };
  const [budget, setBudget] = useState(2000);
  const [location, setLocation] = useState("כל הארץ");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const selectedContents = useMemo(
    () => Object.entries(quantities).filter(([, q]) => q > 0),
    [quantities]
  );
  const hasContent = selectedContents.length > 0;
  const canSubmit = business && goal && hasContent && deadline;

  const completedSteps = useMemo(() => {
    let n = 1; // budget
    if (business) n++;
    if (goal) n++;
    if (hasContent) n++;
    if (deadline) n++;
    return n;
  }, [business, goal, hasContent, deadline]);

  const TOTAL_STEPS = 5;
  const [low, high] = getBudgetRange(budget);
  const sliderPct = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  const toggleContent = (value: string) => {
    setQuantities((q) => {
      const next = { ...q };
      if (next[value] && next[value] > 0) {
        delete next[value];
      } else {
        next[value] = 1;
      }
      return next;
    });
  };

  const setQty = (value: string, delta: number) => {
    setQuantities((q) => {
      const cur = q[value] ?? 0;
      const nextVal = Math.max(0, Math.min(MAX_QTY, cur + delta));
      const next = { ...q };
      if (nextVal === 0) delete next[value];
      else next[value] = nextVal;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const contents: ContentSelection[] = selectedContents.map(([type, qty]) => ({ type, qty }));
    const contentTypeStr = contents.map((c) => `${c.qty} ${pluralize(c.type)}`).join(" + ");
    onSubmit({
      business,
      goal,
      budget,
      location,
      platform: "Instagram",
      contentType: contentTypeStr,
      contents,
      deadline: deadline ? format(deadline, "yyyy-MM-dd") : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="px-4 pt-3 pb-2.5 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -mr-2 rounded-full hover:bg-muted tap-scale">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          <span className="font-bold text-brand">קמפיין חדש</span>
          <div className="w-9" />
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-muted-foreground ltr-num" dir="rtl">
              שלב {completedSteps} מתוך {TOTAL_STEPS}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground ltr-num">
              {Math.round((completedSteps / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 pb-32 space-y-5">
        {/* Business */}
        <Section title="תחום העסק" subtitle="במה אתם עוסקים?">
          <div className="grid grid-cols-3 gap-2">
            {businesses.map(({ value, icon: Icon }) => (
              <ChipCard key={value} active={businessList.includes(value)} onClick={() => toggleFromList(setBusinessList, value)}>
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-bold">{value}</span>
              </ChipCard>
            ))}
          </div>
        </Section>

        {/* Goal */}
        <Section title="מטרת הקמפיין" subtitle="מה הכי חשוב לכם להשיג?">
          <div className="grid grid-cols-3 gap-2">
            {goals.map(({ value, icon: Icon }) => (
              <ChipCard key={value} active={goalList.includes(value)} onClick={() => toggleFromList(setGoalList, value)}>
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-[11px] font-bold text-center leading-tight">{value}</span>
              </ChipCard>
            ))}
          </div>
        </Section>

        {/* Budget */}
        <Section title="תקציב" subtitle="כמה תרצו להשקיע בקמפיין?">
          <div className="relative bg-card rounded-3xl p-5 shadow-card border border-border overflow-hidden">
            <div className="absolute inset-0 bg-brand-soft opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="text-center mb-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">טווח מומלץ</span>
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-1" dir="ltr">
                <span className="text-3xl font-black text-brand ltr-num">{formatILS(low)}</span>
                <span className="text-2xl font-black text-muted-foreground">–</span>
                <span className="text-3xl font-black text-brand ltr-num">{formatILS(high)}</span>
              </div>
              <p className="text-center text-[11px] text-muted-foreground font-semibold mb-5 ltr-num" dir="rtl">
                ליוצר · בחירה: {formatILS(budget)}
              </p>

              <div className="relative h-10 flex items-center" dir="rtl">
                <div className="absolute inset-x-0 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all absolute right-0 top-0"
                    style={{ width: `${sliderPct}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={MIN_BUDGET}
                  max={MAX_BUDGET}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="custom-range absolute inset-0 w-full h-10 appearance-none bg-transparent cursor-pointer"
                  style={{ direction: "rtl" }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 font-semibold ltr-num" dir="rtl">
                <span>₪100</span>
                <span>₪10,000</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section title="קהל יעד" subtitle="איפה נמצאים הלקוחות שלכם?">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full bg-card border border-border rounded-2xl py-3.5 pr-12 pl-4 font-semibold shadow-soft h-auto relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-card">
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Section>

        {/* Platform */}
        <Section title="פלטפורמה" subtitle="איפה הקמפיין ירוץ?">
          <div className="bg-brand p-0.5 rounded-2xl shadow-glow">
            <div className="bg-card rounded-[14px] py-3 px-4 flex items-center gap-3">
              <Instagram className="w-5 h-5" style={{ color: "hsl(var(--brand-pink))" }} />
              <span className="font-bold">Instagram</span>
              <span className="mr-auto text-[11px] px-2 py-1 rounded-full bg-brand-soft font-bold text-foreground">פעיל</span>
            </div>
          </div>
        </Section>

        {/* Content type - multi select with quantity */}
        <Section title="פורמט התוכן" subtitle="בחרו סוגים וכמויות">
          <div className="space-y-2">
            {contentTypes.map(({ value, plural, icon: Icon }) => {
              const qty = quantities[value] ?? 0;
              const active = qty > 0;
              return (
                <div
                  key={value}
                  className={cn(
                    "relative rounded-2xl transition-bounce overflow-hidden",
                    active ? "shadow-cta p-0.5" : ""
                  )}
                  style={active ? { background: "var(--gradient-brand)" } : undefined}
                >
                  <div className={cn(
                    "rounded-[14px] bg-card border-2 transition-bounce",
                    active ? "border-transparent" : "border-border"
                  )}>
                    <button
                      onClick={() => toggleContent(value)}
                      className="w-full flex items-center gap-3 p-3 tap-scale text-right"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          active ? "text-primary-foreground" : "bg-muted text-foreground"
                        )}
                        style={active ? { background: "var(--gradient-brand)" } : undefined}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{value}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">
                          {active ? `${qty} ${plural}` : "להוספה"}
                        </div>
                      </div>
                      {active ? (
                        <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
                          <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={4} />
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={3} />
                        </span>
                      )}
                    </button>

                    {active && (
                      <div className="px-3 pb-3 -mt-1 animate-fade-in-up">
                        <div className="flex items-center justify-between bg-muted/60 rounded-xl px-2 py-1.5">
                          <span className="text-[11px] font-bold text-muted-foreground pr-2">כמות</span>
                          <div className="flex items-center gap-2" dir="ltr">
                            <button
                              onClick={() => setQty(value, -1)}
                              className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center tap-scale disabled:opacity-40"
                              disabled={qty <= 1}
                              aria-label="הפחת"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[2ch] text-center font-black text-base ltr-num">{qty}</span>
                            <button
                              onClick={() => setQty(value, +1)}
                              className="w-8 h-8 rounded-full text-primary-foreground flex items-center justify-center tap-scale disabled:opacity-40"
                              style={{ background: "var(--gradient-brand)" }}
                              disabled={qty >= MAX_QTY}
                              aria-label="הוסף"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Deadline */}
        <Section title="דד ליין לקמפיין" subtitle="מתי תרצו שהתוכן יעלה?">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-3 bg-card border-2 rounded-2xl py-3.5 px-4 font-semibold shadow-soft tap-scale transition-bounce",
                  deadline ? "border-transparent shadow-cta" : "border-border hover:border-primary/30"
                )}
                style={deadline ? { backgroundImage: "var(--gradient-brand-soft)" } : undefined}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <div className="flex-1 text-right">
                  {deadline ? (
                    <>
                      <div className="text-[11px] font-bold text-muted-foreground">תאריך נבחר</div>
                      <div className="font-bold text-sm">
                        {format(deadline, "EEEE, d בMMMM yyyy", { locale: he })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-sm">בחרו תאריך</div>
                      <div className="text-[11px] text-muted-foreground font-medium">בחרו את המועד הרצוי לעלייה</div>
                    </>
                  )}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-card border-border" align="center">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={he}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </Section>
      </main>

      {/* Sticky submit */}
      <div className="sticky bottom-0 z-20 backdrop-blur-xl bg-background/85 border-t border-border/60 px-4 pt-3 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-full font-bold text-base text-primary-foreground bg-brand shadow-cta-lg disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed tap-scale"
        >
          קבל 3 התאמות חכמות
        </button>
      </div>

      <style>{`
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: white;
          border: 3px solid hsl(var(--brand-pink));
          box-shadow: 0 4px 14px hsl(var(--brand-pink) / 0.5), 0 0 0 6px hsl(var(--brand-pink) / 0.12);
          cursor: grab;
          transition: transform 0.15s ease;
        }
        .custom-range::-webkit-slider-thumb:active { transform: scale(1.12); cursor: grabbing; }
        .custom-range::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: white;
          border: 3px solid hsl(var(--brand-pink));
          box-shadow: 0 4px 14px hsl(var(--brand-pink) / 0.5), 0 0 0 6px hsl(var(--brand-pink) / 0.12);
          cursor: grab;
        }
        .custom-range::-webkit-slider-runnable-track { background: transparent; }
        .custom-range::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
}

function pluralize(type: string) {
  const t = contentTypes.find((c) => c.value === type);
  return t?.plural ?? type;
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="animate-fade-in-up">
      <div className="mb-2.5">
        <h2 className="text-lg font-extrabold mb-0.5 leading-tight">{title}</h2>
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
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-bounce min-h-[78px] tap-scale overflow-hidden ${
        active
          ? "border-0 text-primary-foreground shadow-cta"
          : "bg-card border-2 border-border text-foreground hover:border-primary/30"
      }`}
      style={
        active
          ? { background: "var(--gradient-brand)" }
          : undefined
      }
    >
      {active && (
        <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-white/95 flex items-center justify-center">
          <Check className="w-2.5 h-2.5" style={{ color: "hsl(var(--brand-pink))" }} strokeWidth={4} />
        </span>
      )}
      {children}
    </button>
  );
}
