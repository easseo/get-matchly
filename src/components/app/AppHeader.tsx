import { Search, Bell, ChevronDown } from "lucide-react";
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
    <header className="h-16 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center gap-3 px-4 md:px-6">
      <SidebarTrigger className="hidden md:flex shrink-0 text-gray-500 hover:text-gray-900" />

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="חיפוש..."
          className="w-full bg-gray-100 border-0 rounded-xl pr-9 pl-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-2 mr-auto">
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-1.5 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-bold text-gray-900 leading-tight">{user?.fullName || "אורח"}</div>
            <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{user?.email}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
