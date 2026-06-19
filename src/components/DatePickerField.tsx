import { format } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export default function DatePickerField({ value, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-3 bg-card border-2 rounded-2xl py-3.5 px-4 font-semibold shadow-soft tap-scale transition-bounce",
            value ? "border-transparent shadow-cta" : "border-border hover:border-primary/30"
          )}
          style={value ? { backgroundImage: "var(--gradient-brand-soft)" } : undefined}
        >
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <CalendarIcon className="w-5 h-5" />
          </span>
          <div className="flex-1 text-right">
            {value ? (
              <>
                <div className="text-[11px] font-bold text-muted-foreground">תאריך נבחר</div>
                <div className="font-bold text-sm">
                  {format(value, "EEEE, d בMMMM yyyy", { locale: he })}
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
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          locale={he}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}
