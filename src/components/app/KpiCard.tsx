import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "pink" | "violet" | "amber" | "emerald" | "blue" | "rose";

const tones: Record<Tone, { chip: string; bar: string }> = {
  pink:    { chip: "bg-pink-50 text-pink-600 ring-pink-100",          bar: "from-pink-500 to-fuchsia-500" },
  violet:  { chip: "bg-violet-50 text-violet-600 ring-violet-100",    bar: "from-violet-500 to-purple-600" },
  amber:   { chip: "bg-amber-50 text-amber-700 ring-amber-100",       bar: "from-amber-400 to-orange-400" },
  emerald: { chip: "bg-emerald-50 text-emerald-600 ring-emerald-100", bar: "from-emerald-400 to-teal-500" },
  blue:    { chip: "bg-sky-50 text-sky-600 ring-sky-100",             bar: "from-sky-400 to-blue-500" },
  rose:    { chip: "bg-rose-50 text-rose-600 ring-rose-100",          bar: "from-rose-400 to-pink-500" },
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
    <div className="card-premium hover-lift relative overflow-hidden p-5 md:p-6">
      <span className={cn("absolute top-0 right-6 left-6 h-px bg-gradient-to-l opacity-70", t.bar)} />
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="text-[13px] font-semibold text-muted-foreground">{label}</div>
        <span className={cn("w-9 h-9 rounded-xl flex items-center justify-center ring-1 shrink-0", t.chip)}>
          <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </span>
      </div>
      <div className="font-display text-[34px] leading-none font-bold text-foreground ltr-num">{value}</div>
      {hint && <div className="text-muted-foreground/80 text-xs font-medium mt-2">{hint}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 className="font-display text-[28px] md:text-[36px] leading-tight font-bold">{title}</h1>
        {subtitle && <p className="text-sm md:text-[15px] text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "פעיל":   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "טיוטה":  "bg-slate-100 text-slate-600 border border-slate-200",
    "הסתיים": "bg-sky-100 text-sky-700 border border-sky-200",
    "ממתין":  "bg-amber-100 text-amber-700 border border-amber-200",
    "אושר":   "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "נדחה":   "bg-rose-100 text-rose-700 border border-rose-200",
    "הושלם":  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  const cls = map[status] || "bg-muted text-foreground";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold", cls)}>
      {status}
    </span>
  );
}

export function CreatorAvatar({ name, avatar, size = "md" }: { name: string; avatar?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" };
  const initials = name.split(" ").map(s => s[0]).join("").slice(0, 2);
  return (
    <div className={cn("rounded-full shrink-0 overflow-hidden ring-2 ring-white shadow-md", sizes[size])}>
      {avatar ? (
        <img src={avatar} alt={name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white font-bold">
          {initials}
        </div>
      )}
    </div>
  );
}
