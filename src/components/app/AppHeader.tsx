import { Bell, ChevronDown, LogOut, Settings, UserCircle, Megaphone, FileText, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import matchlyIcon from "@/assets/matchly-icon.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type MockNotif = { id: string; icon: React.ReactNode; title: string; sub: string; time: string; unread: boolean };

const MOCK_NOTIFS: MockNotif[] = [
  { id: "n1", icon: <Megaphone className="w-4 h-4 text-pink-500" />, title: "קמפיין חדש זמין", sub: "FitLab פרסם קמפיין כושר חדש", time: "לפני 5 דק׳", unread: true },
  { id: "n2", icon: <FileText className="w-4 h-4 text-blue-500" />, title: "הצעה התקבלה", sub: "PureGlow קיבל את ההצעה שלך", time: "לפני שעה", unread: true },
  { id: "n3", icon: <Sparkles className="w-4 h-4 text-purple-500" />, title: "התאמה חדשה", sub: "יש לך 3 קמפיינים מתאימים לפרופיל שלך", time: "אתמול", unread: false },
];

function NotifBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const unreadCount = notifs.filter(n => n.unread).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-pink-500 ring-2 ring-white flex items-center justify-center text-[9px] text-white font-black">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border border-gray-100 overflow-hidden" dir="rtl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-extrabold text-sm text-gray-900">התראות</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[11px] font-semibold text-primary hover:underline">
              סמן הכל כנקרא
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifs.map(n => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 transition-colors hover:bg-gray-50 cursor-pointer ${n.unread ? "bg-pink-50/40" : ""}`}
              onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
            >
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-tight">{n.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{n.sub}</p>
                <p className="text-[10px] text-gray-300 mt-1 font-medium">{n.time}</p>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-2" />}
            </div>
          ))}
        </div>
        {unreadCount === 0 && (
          <div className="py-4 text-center text-xs text-gray-400 font-medium">אין התראות חדשות</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader() {
  const { user, signOut } = useDemoAuth();
  const navigate = useNavigate();
  const isGuest = user?.email === "guest@matchly.net";

  const initials = (user?.fullName || "א")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dashboardUrl = user?.role === "creator" ? "/app/creator/dashboard" : "/app/dashboard";
  const profileUrl = user?.role === "creator" ? "/app/creator/profile" : "/app/profile";

  const handleSignOut = () => {
    signOut();
    window.location.href = "/";
  };

  return (
    <header className="h-16 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center gap-3 px-4 md:px-6">
      <SidebarTrigger className="shrink-0 text-gray-500 hover:text-gray-900" />

      <Link to={dashboardUrl} className="shrink-0 hover:opacity-80 transition-opacity">
        <img src={matchlyIcon} alt="Matchly" className="h-10 w-10 object-contain rounded-xl" />
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <NotifBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0"
                style={{ background: "var(--gradient-brand)" }}
              >
                {initials}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-gray-900 leading-tight">
                  {isGuest ? "אורח/ת" : user?.fullName || "משתמש"}
                </div>
                <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{user?.email}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border border-gray-100 p-1.5" dir="rtl">
            {/* User info header */}
            <div className="px-3 py-2.5 mb-1">
              <p className="font-extrabold text-sm text-gray-900">{isGuest ? "אורח/ת" : user?.fullName}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              {isGuest && (
                <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                  מצב אורח
                </span>
              )}
            </div>

            <DropdownMenuSeparator className="my-1" />

            {isGuest ? (
              <DropdownMenuItem
                className="rounded-xl cursor-pointer font-bold text-white flex items-center gap-2 px-3 py-2.5 focus:text-white"
                style={{ background: "var(--gradient-brand)" }}
                onClick={() => navigate("/auth")}
              >
                <Sparkles className="w-4 h-4" />
                הצטרפו עכשיו — חינם
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="rounded-xl cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 focus:bg-gray-50"
                onClick={() => navigate(profileUrl)}
              >
                <UserCircle className="w-4 h-4 text-gray-400" />
                הפרופיל שלי
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="rounded-xl cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 focus:bg-gray-50"
              onClick={() => navigate(profileUrl)}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              הגדרות
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              className="rounded-xl cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 focus:bg-red-50 focus:text-red-500"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              {isGuest ? "יציאה" : "התנתקות"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
