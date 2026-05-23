import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "pink" | "violet" | "amber" | "emerald" | "blue" | "rose";

const tones: Record<Tone, { bg: string; text: string; icon: string }> = {
  pink:    { bg: "bg-pink-50",    text: "text-pink-700",    icon: "bg-pink-100 text-pink-600" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-700",  icon: "bg-violet-100 text-violet-600" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-700",   icon: "bg-amber-100 text-amber-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600" },
  blue:    { bg: "bg-sky-50",     text: "text-sky-700",     icon: "bg-sky-100 text-sky-600" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-700",    icon: "bg-rose-100 text-rose-600" },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = "pink",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  const t = tones[tone];
  return (
    <div className={cn("rounded-2xl p-4 border border-border/60 hover-lift", t.bg)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-bold text-foreground/70">{label}</span>
        <span className={cn("w-8 h-8 rounded-xl flex items-center justify-center", t.icon)}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className={cn("text-2xl font-black ltr-num", t.text)}>{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground font-semibold mt-1">{hint}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground font-medium mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "פעיל":   "bg-emerald-100 text-emerald-700",
    "טיוטה":  "bg-slate-100 text-slate-700",
    "הסתיים": "bg-sky-100 text-sky-700",
    "ממתין":  "bg-amber-100 text-amber-700",
    "אושר":   "bg-emerald-100 text-emerald-700",
    "נדחה":   "bg-rose-100 text-rose-700",
    "הושלם":  "bg-emerald-100 text-emerald-700",
  };
  const cls = map[status] || "bg-muted text-foreground";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold", cls)}>
      {status}
    </span>
  );
}
