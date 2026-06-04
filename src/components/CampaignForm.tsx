import { useState, useMemo, lazy, Suspense } from "react";
import { ArrowLeft, Utensils, Shirt, Dumbbell, Sparkles as SparkleIcon, MoreHorizontal, Users, Eye, ShoppingBag, MapPin, Instagram, Film, Image as ImageIcon, Clock, Check, Minus, Plus, X, Laptop, Heart, GraduationCap, Home, Car, Music, Plane, PawPrint, Coins, Gamepad2, Baby, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LazyDatePicker = lazy(() => import("@/components/DatePickerField"));

export type ContentSelection = { type: string; qty: number };

export type CampaignData = {
  business: string;
  goal: string;
  location: string;
  platform: string;
  contentType: string;
  contents: ContentSelection[];
  deadline?: string;
  brief?: string;
  creatorTiers: string[];
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

const moreBusinesses = [
  { value: "טכנולוגיה",      icon: Laptop },
  { value: "בריאות",         icon: Heart },
  { value: "חינוך",          icon: GraduationCap },
  { value: "בית ועיצוב",     icon: Home },
  { value: "רכב",            icon: Car },
  { value: "מוזיקה",         icon: Music },
  { value: "תיירות",         icon: Plane },
  { value: "חיות מחמד",     icon: PawPrint },
  { value: "פיננסים",        icon: Coins },
  { value: "גיימינג",        icon: Gamepad2 },
  { value: "ילדים ותינוקות", icon: Baby },
  { value: "ספורט",          icon: ShoppingBag },
];

const goals = [
  { value: "יותר לקוחות", icon: Users },
  { value: "יותר חשיפה",  icon: Eye },
  { value: "יותר מכירות", icon: ShoppingBag },
];

const contentTypes = [
  { value: "רילס",  plural: "רילסים", icon: Film },
  { value: "סטורי", plural: "סטוריז", icon: Clock },
  { value: "פוסט",  plural: "פוסטים", icon: ImageIcon },
];

const cities = ["כל הארץ", "תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "פתח תקווה", "אשדוד", "הרצליה", "נתניה", "חולון"];

const MAX_QTY = 20;

const CREATOR_TIERS = [
  { value: "מיקרו",   label: "מיקרו-משפיענים",    range: "1K – 10K עוקבים" },
  { value: "בינוני",  label: "משפיענים בינוניים", range: "10K – 50K עוקבים" },
  { value: "מאקרו",   label: "מאקרו-משפיענים",    range: "50K+ עוקבים" },
];

export default function CampaignForm({ onSubmit, onBack }: CampaignFormProps) {
  const [businessList, setBusinessList]   = useState<string[]>([]);
  const [goalList, setGoalList]           = useState<string[]>([]);
  const [showMoreBusinesses, setShowMoreBusinesses] = useState(false);
  const [location, setLocation]           = useState("כל הארץ");
  const [quantities, setQuantities]       = useState<Record<string, number>>({});
  const [deadline, setDeadline]           = useState<Date | undefined>(undefined);
  const [brief, setBrief]                 = useState("");
  const [creatorTiers, setCreatorTiers]   = useState<string[]>([]);

  const business = businessList.join(", ");
  const goal     = goalList.join(", ");

  const toggleFromList = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const selectedContents = useMemo(
    () => Object.entries(quantities).filter(([, q]) => q > 0),
    [quantities]
  );
  const hasContent = selectedContents.length > 0;
  const canSubmit  = business && goal && hasContent && deadline;

  const TOTAL_STEPS = 4;
  const completedSteps = useMemo(() => {
    let n = 0;
    if (business)    n++;
    if (goal)        n++;
    if (hasContent)  n++;
    if (deadline)    n++;
    return n;
  }, [business, goal, hasContent, deadline]);

  const toggleContent = (value: string) => {
    setQuantities(q => {
      const next = { ...q };
      if (next[value] && next[value] > 0) delete next[value];
      else next[value] = 1;
      return next;
    });
  };

  const setQty = (value: string, delta: number) => {
    setQuantities(q => {
      const cur     = q[value] ?? 0;
      const nextVal = Math.max(0, Math.min(MAX_QTY, cur + delta));
      const next    = { ...q };
      if (nextVal === 0) delete next[value];
      else next[value] = nextVal;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const contents: ContentSelection[] = selectedContents.map(([type, qty]) => ({ type, qty }));
    const contentTypeStr = contents.map(c => `${c.qty} ${pluralize(c.type)}`).join(" + ");
    onSubmit({
      business,
      goal,
      location,
      platform: "Instagram",
      contentType: contentTypeStr,
      contents,
      deadline: deadline ? deadline.toISOString().split("T")[0] : undefined,
      brief: brief.trim() || undefined,
      creatorTiers,
    });
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Sticky header + progress */}
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

        {/* ── Business type ── */}
        <Section title="תחום העסק" subtitle="במה אתם עוסקים?">
          <div className="grid grid-cols-3 gap-2">
            {businesses.map(({ value, icon: Icon }) => {
              if (value === "אחר") {
                const extraSelected = businessList.filter(
                  b => !businesses.slice(0, -1).map(x => x.value).includes(b)
                );
                return (
                  <ChipCard key={value} active={extraSelected.length > 0} onClick={() => setShowMoreBusinesses(true)}>
                    <MoreHorizontal className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">
                      {extraSelected.length > 0 ? `+ ${extraSelected.length} נבחרו` : "אחר"}
                    </span>
                  </ChipCard>
                );
              }
              return (
                <ChipCard key={value} active={businessList.includes(value)} onClick={() => toggleFromList(setBusinessList, value)}>
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">{value}</span>
                </ChipCard>
              );
            })}
          </div>
        </Section>

        {/* More businesses bottom sheet */}
        {showMoreBusinesses && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMoreBusinesses(false)} />
            <div className="relative bg-white w-full rounded-t-3xl max-h-[80dvh] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                <h3 className="font-extrabold text-gray-900">תחומים נוספים</h3>
                <button onClick={() => setShowMoreBusinesses(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="grid grid-cols-3 gap-2">
                  {moreBusinesses.map(({ value, icon: Icon }) => (
                    <ChipCard key={value} active={businessList.includes(value)} onClick={() => toggleFromList(setBusinessList, value)}>
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="text-[11px] font-bold text-center leading-tight">{value}</span>
                    </ChipCard>
                  ))}
                </div>
              </div>
              <div className="px-5 py-4 border-t border-gray-100 shrink-0 safe-bottom">
                <button onClick={() => setShowMoreBusinesses(false)} className="w-full py-3.5 rounded-2xl text-white font-bold text-sm" style={{ background: "var(--gradient-brand)" }}>
                  אישור
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Campaign goal ── */}
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

        {/* ── Location ── */}
        <Section title="קהל יעד" subtitle="איפה נמצאים הלקוחות שאליהם תרצו להגיע?">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full bg-card border border-border rounded-2xl py-3.5 pr-12 pl-4 font-semibold shadow-soft h-auto relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 bg-card">
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Section>

        {/* ── Platform ── */}
        <Section title="פלטפורמה" subtitle="הקמפיין ירוץ באינסטגרם בלבד">
          <div className="bg-brand p-0.5 rounded-2xl shadow-glow">
            <div className="bg-card rounded-[14px] py-3 px-4 flex items-center gap-3">
              <Instagram className="w-5 h-5" style={{ color: "hsl(var(--brand-pink))" }} />
              <span className="font-bold">Instagram</span>
              <span className="mr-auto text-[11px] px-2 py-1 rounded-full bg-brand-soft font-bold text-foreground">פעיל</span>
            </div>
          </div>
        </Section>

        {/* ── Content formats + quantities ── */}
        <Section
          title="פורמט התוכן"
          subtitle="בחרו אילו סוגי תוכן תרצו. יוצרי התוכן יגישו לכם הצעת מחיר מותאמת לפי בחירתכם."
        >
          <div className="space-y-2">
            {contentTypes.map(({ value, plural, icon: Icon }) => {
              const qty    = quantities[value] ?? 0;
              const active = qty > 0;
              return (
                <div
                  key={value}
                  className={cn("relative rounded-2xl transition-bounce overflow-hidden", active ? "shadow-cta p-0.5" : "")}
                  style={active ? { background: "var(--gradient-brand)" } : undefined}
                >
                  <div className={cn("rounded-[14px] bg-card border-2 transition-bounce", active ? "border-transparent" : "border-border")}>
                    <button onClick={() => toggleContent(value)} className="w-full flex items-center gap-3 p-3 tap-scale text-right">
                      <div
                        className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", active ? "text-primary-foreground" : "bg-muted text-foreground")}
                        style={active ? { background: "var(--gradient-brand)" } : undefined}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{value}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">
                          {active ? `${qty} ${plural}` : "לחצו להוספה"}
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
                        <div className="flex items-center justify-between bg-muted/60 rounded-xl px-3 py-2">
                          <span className="text-[11px] font-bold text-muted-foreground">כמות {plural}</span>
                          <div className="flex items-center gap-3" dir="ltr">
                            <button
                              onClick={() => setQty(value, -1)}
                              className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center tap-scale disabled:opacity-40"
                              disabled={qty <= 1}
                              aria-label="הפחת"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[2ch] text-center font-black text-lg ltr-num">{qty}</span>
                            <button
                              onClick={() => setQty(value, +1)}
                              className="w-9 h-9 rounded-full text-primary-foreground flex items-center justify-center tap-scale disabled:opacity-40"
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

        {/* ── Campaign brief / special requirements ── */}
        <Section title="דרישות מיוחדות / הערות" subtitle="מידע שיעזור ליוצרים להגיש הצעת מחיר מדויקת">
          <div className={cn(
            "rounded-2xl border-2 transition-bounce overflow-hidden",
            brief ? "border-transparent p-0.5 shadow-cta" : "border-border"
          )}
            style={brief ? { background: "var(--gradient-brand)" } : undefined}
          >
            <div className={cn("rounded-[14px] bg-card", brief ? "" : "")}>
              <div className="flex items-start gap-3 p-3 pb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: brief ? "var(--gradient-brand)" : undefined }}
                  {...(!brief && { className: "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-muted" })}
                >
                  <FileText className={cn("w-5 h-5", brief ? "text-white" : "text-muted-foreground")} />
                </div>
                <textarea
                  value={brief}
                  onChange={e => setBrief(e.target.value)}
                  rows={3}
                  placeholder="לדוגמה: הקמפיין דורש הגעה פיזית לחנות, אנבוקסינג, או שילוב לינק ייעודי..."
                  className="flex-1 bg-transparent text-sm font-medium resize-none focus:outline-none placeholder:text-muted-foreground/60 py-2 leading-relaxed"
                  dir="rtl"
                />
              </div>
              <div className="px-3 pb-2 text-[10px] text-muted-foreground font-medium text-left">
                {brief.length > 0 && `${brief.length} תווים`}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Creator tier preference (optional) ── */}
        <Section title="גודל משפיען מבוקש" subtitle="אופציונלי — בחרו את הגודל המועדף. ניתן לבחור יותר מאחד.">
          <div className="space-y-2">
            {CREATOR_TIERS.map(({ value, label, range }) => {
              const selected = creatorTiers.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleFromList(setCreatorTiers, value)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 transition-bounce tap-scale text-right",
                    selected ? "border-transparent shadow-cta" : "border-border bg-card hover:border-primary/30"
                  )}
                  style={selected ? { background: "var(--gradient-brand)" } : undefined}
                >
                  <div>
                    <div className={cn("font-bold text-sm", selected ? "text-white" : "text-foreground")}>{label}</div>
                    <div className={cn("text-[11px] font-medium mt-0.5", selected ? "text-white/75" : "text-muted-foreground")} dir="ltr">{range}</div>
                  </div>
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                    selected ? "bg-white/20" : "bg-muted"
                  )}>
                    {selected
                      ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      : <Plus className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={3} />
                    }
                  </span>
                </button>
              );
            })}
          </div>
          {creatorTiers.length === 0 && (
            <p className="text-[11px] text-muted-foreground font-medium mt-2 text-center">
              אם לא תבחרו, הקמפיין יוצג לכל היוצרים
            </p>
          )}
        </Section>

        {/* ── Deadline ── */}
        <Section title="דד ליין לקמפיין" subtitle="מתי תרצו שהתוכן יעלה?">
          <Suspense fallback={<div className="w-full h-14 rounded-2xl bg-muted animate-pulse" />}>
            <LazyDatePicker value={deadline} onChange={setDeadline} />
          </Suspense>
        </Section>

      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-20 backdrop-blur-xl bg-background/85 border-t border-border/60 px-4 pt-3 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-full font-bold text-base text-primary-foreground bg-brand shadow-cta-lg disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed tap-scale"
        >
          מצא לי יוצרי תוכן מתאימים
        </button>
        {!canSubmit && (
          <p className="text-center text-[11px] text-muted-foreground font-medium pt-2 pb-1">
            {!business ? "בחרו תחום עסק" : !goal ? "בחרו מטרת קמפיין" : !hasContent ? "בחרו פורמט תוכן" : "בחרו תאריך יעד"}
          </p>
        )}
      </div>
    </div>
  );
}

function pluralize(type: string) {
  return contentTypes.find(c => c.value === type)?.plural ?? type;
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
        active ? "border-0 text-primary-foreground shadow-cta" : "bg-card border-2 border-border text-foreground hover:border-primary/30"
      }`}
      style={active ? { background: "var(--gradient-brand)" } : undefined}
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
