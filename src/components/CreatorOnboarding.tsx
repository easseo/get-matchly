import { useState } from "react";
import { ArrowLeft, Sparkles, User, Instagram, Tag, Users, MapPin, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CreatorOnboardingProps {
  onBack: () => void;
}

const niches = ["אופנה", "ביוטי", "כושר", "אוכל", "לייפסטייל", "טכנולוגיה", "נסיעות", "משפחה", "עיצוב", "ספורט"];
const followerRanges = ["1K–10K", "10K–50K", "50K–100K", "100K–500K", "500K+"];
const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "פתח תקווה", "אשדוד", "הרצליה", "נתניה", "אחר"];

export default function CreatorOnboarding({ onBack }: CreatorOnboardingProps) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("");
  const [followers, setFollowers] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    name.trim().length >= 2 &&
    handle.trim().length >= 2 &&
    niche &&
    followers &&
    city &&
    contact.trim().length >= 5;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("נא למלא את כל השדות");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-brand opacity-30 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-44 h-44 rounded-full bg-brand opacity-20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand flex items-center justify-center shadow-glow mb-6 animate-pulse-glow">
            <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black mb-3">
            <span className="text-brand">תודה!</span>
          </h1>
          <p className="text-lg text-foreground font-semibold mb-2">
            נעדכן אותך כשהבטא תיפתח 🚀
          </p>
          <p className="text-sm text-muted-foreground font-medium mb-10 max-w-xs">
            הצטרפת לרשימת היוצרים הנבחרים. בקרוב ניצור איתך קשר עם פרטים נוספים.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-primary-foreground bg-brand shadow-glow tap-scale"
          >
            חזרה לעמוד הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -mr-2 rounded-full hover:bg-muted tap-scale">
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          <span className="font-bold text-brand">הצטרפות לבטא</span>
          <div className="w-9" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 pb-32">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border shadow-soft mb-4">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(var(--brand-pink))" }} />
            <span className="text-xs font-bold text-muted-foreground">בטא סגורה · מקומות מוגבלים</span>
          </div>
          <h1 className="text-3xl font-black mb-2 leading-tight">
            <span className="text-brand">יוצר.ת תוכן?</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium px-4">
            הצטרפו לפלטפורמה שמחברת אתכם למותגים שמתאימים לקהל שלכם
          </p>
        </div>

        <Field label="שם מלא" icon={User}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="ישראל ישראלי"
            className="w-full bg-transparent outline-none font-semibold placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field label="פרופיל Instagram" icon={Instagram}>
          <span className="text-muted-foreground font-semibold ltr-num">@</span>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
            maxLength={40}
            placeholder="username"
            dir="ltr"
            className="flex-1 bg-transparent outline-none font-semibold placeholder:text-muted-foreground/60 text-left ltr-num"
          />
        </Field>

        <Section title="תחום התוכן" icon={Tag}>
          <div className="flex flex-wrap gap-2">
            {niches.map((n) => (
              <Chip key={n} active={niche === n} onClick={() => setNiche(n)}>
                {n}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="כמות עוקבים" icon={Users}>
          <div className="grid grid-cols-3 gap-2">
            {followerRanges.map((r) => (
              <Chip key={r} active={followers === r} onClick={() => setFollowers(r)} fullWidth>
                <span className="ltr-num">{r}</span>
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="עיר" icon={MapPin}>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Chip key={c} active={city === c} onClick={() => setCity(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </Section>

        <Field label="אימייל או וואטסאפ" icon={Mail}>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={120}
            placeholder="name@email.com או 050-0000000"
            dir="ltr"
            className="w-full bg-transparent outline-none font-semibold placeholder:text-muted-foreground/60 text-left ltr-num"
          />
        </Field>
      </main>

      <div className="sticky bottom-0 z-20 backdrop-blur-lg bg-background/85 border-t border-border px-4 pt-3 safe-bottom">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-full font-bold text-base text-primary-foreground bg-brand shadow-glow disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed tap-scale"
        >
          שלחו לי גישה לבטא
        </button>
        <p className="text-[11px] text-center text-muted-foreground font-medium mt-2">
          בלחיצה אתם מאשרים שניצור קשר בנוגע לבטא
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      <label className="block text-xs font-bold text-muted-foreground mb-2 px-1">{label}</label>
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 shadow-soft focus-within:ring-2 focus-within:ring-primary transition-smooth">
        <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
        {children}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-bold text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children, fullWidth }: { active: boolean; onClick: () => void; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${fullWidth ? "w-full justify-center" : ""} inline-flex items-center px-4 py-2.5 rounded-full text-sm font-bold border-2 tap-scale transition-bounce ${
        active
          ? "bg-brand text-primary-foreground border-transparent shadow-glow"
          : "bg-card border-border text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
