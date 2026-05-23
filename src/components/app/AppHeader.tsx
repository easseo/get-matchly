import { Search, Bell, ChevronLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDemoAuth } from "@/hooks/useDemoAuth";

export function AppHeader() {
  const { user } = useDemoAuth();
  const initials = (user?.fullName || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 sticky top-0 z-20 glass-nav flex items-center gap-3 px-4 md:px-6">
      <SidebarTrigger className="shrink-0" />

      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="חיפוש..."
          className="w-full bg-muted/60 border border-transparent rounded-xl pr-9 pl-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card"
        />
      </div>

      <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
        <Bell className="w-5 h-5 text-foreground/70" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
      </button>

      <div className="flex items-center gap-2 pr-2 border-r border-border">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold leading-tight">{user?.fullName || "אורח"}</div>
          <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">{user?.email}</div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-cta" style={{ background: "var(--gradient-brand)" }}>
          {initials}
        </div>
        <ChevronLeft className="w-4 h-4 text-muted-foreground hidden md:block" />
      </div>
    </header>
  );
}
