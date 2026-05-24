import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Compass, FileText, DollarSign, Star, Settings, LogOut, Bell, ChevronRight, Search, MessageSquare } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import { useUser } from "@/context/UserContext";

const mobileNavItems = [
  { icon: LayoutDashboard, label: "בקרה", path: "/creator", end: true },
  { icon: Compass, label: "גלישה", path: "/creator/browse" },
  { icon: FileText, label: "הצעות", path: "/creator/proposals" },
  { icon: MessageSquare, label: "הודעות", path: "/creator/messages" },
  { icon: Settings, label: "הגדרות", path: "/creator/settings" },
];

const navItems = [
  { icon: LayoutDashboard, label: "לוח בקרה", path: "/creator", end: true },
  { icon: Compass, label: "גלישת קמפיינים", path: "/creator/browse" },
  { icon: FileText, label: "ההצעות שלי", path: "/creator/proposals" },
  { icon: MessageSquare, label: "הודעות", path: "/creator/messages" },
  { icon: DollarSign, label: "הכנסות", path: "/creator/earnings" },
  { icon: Star, label: "ביקורות", path: "/creator/reviews" },
  { icon: Settings, label: "הגדרות פרופיל", path: "/creator/settings" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { name, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" dir="ltr">
      {/* Sidebar - desktop only */}
      <aside className="hidden md:flex w-[200px] shrink-0 bg-white border-r border-gray-200 flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src={matchlyIcon} className="w-7 h-7 object-contain" alt="" />
            <div>
              <div
                className="font-extrabold text-sm leading-tight"
                style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                Matchly
              </div>
              <div className="text-[10px] text-gray-400 font-medium leading-tight">Influence Today. Earn Now.</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto" dir="rtl">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
              style={({ isActive }) => (isActive ? { background: "var(--gradient-brand)" } : {})}
            >
              <item.icon size={16} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <button
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors w-full"
            dir="rtl"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>התנתקות</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
          {/* Mobile: logo; Desktop: search */}
          <div className="flex md:hidden items-center gap-2">
            <img src={matchlyIcon} className="w-7 h-7 object-contain" alt="" />
            <span className="font-extrabold text-sm" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="חיפוש..."
              dir="rtl"
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-3" dir="rtl">
            <button className="relative p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/creator/settings")}>
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-gray-800">{name}</div>
                <div className="text-xs text-gray-400">יוצר תוכן</div>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: "var(--gradient-brand)" }}
              >
                {initials}
              </div>
              <ChevronRight size={14} className="text-gray-400 hidden md:block" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-16 md:pb-0" dir="rtl">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-40">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? "text-primary" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
