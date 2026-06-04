import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "pink" | "violet" | "amber" | "emerald" | "blue" | "rose";

const tones: Record<Tone, { gradient: string; text: string; iconBg: string; iconText: string }> = {
  pink:    { gradient: "from-pink-500 to-rose-500",       text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
  violet:  { gradient: "from-violet-500 to-purple-600",   text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
  amber:   { gradient: "from-amber-400 to-orange-500",    text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
  emerald: { gradient: "from-emerald-400 to-teal-500",    text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
  blue:    { gradient: "from-sky-400 to-blue-600",        text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
  rose:    { gradient: "from-rose-400 to-pink-600",       text: "text-white", iconBg: "bg-white/20", iconText: "text-white" },
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
    <div className={cn("rounded-2xl p-5 bg-gradient-to-br shadow-lg hover-lift relative overflow-hidden", t.gradient)}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm", t.iconBg)}>
            <Icon className="w-5 h-5 text-white" />
          </span>
        </div>
        <div className="text-3xl font-black text-white ltr-num mb-1">{value}</div>
        <div className="text-white/80 text-xs font-semibold">{label}</div>
        {hint && <div className="text-white/60 text-[10px] font-medium mt-0.5">{hint}</div>}
      </div>
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
