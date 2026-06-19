import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Megaphone, FileText, MessageSquare,
  Star, CreditCard, Settings, LogOut, Compass, DollarSign,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import matchlyIcon from "@/assets/matchly-icon.png";
import { cn } from "@/lib/utils";

const advertiserItems = [
  { title: "דשבורד", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "יצירת קמפיין", url: "/app/create", icon: PlusCircle },
  { title: "הקמפיינים שלי", url: "/app/campaigns", icon: Megaphone },
  { title: "כל ההצעות", url: "/app/proposals", icon: FileText },
  { title: "הודעות", url: "/app/messages", icon: MessageSquare },
  { title: "ביקורות", url: "/app/reviews", icon: Star },
  { title: "תשלומים", url: "/app/payments", icon: CreditCard },
  { title: "הגדרות פרופיל", url: "/app/profile", icon: Settings },
];

const creatorItems = [
  { title: "דשבורד", url: "/app/creator/dashboard", icon: LayoutDashboard },
  { title: "דפדוף בקמפיינים", url: "/app/creator/browse", icon: Compass },
  { title: "ההצעות שלי", url: "/app/creator/proposals", icon: FileText },
  { title: "רווחים", url: "/app/creator/earnings", icon: DollarSign },
  { title: "ביקורות", url: "/app/creator/reviews", icon: Star },
  { title: "הגדרות פרופיל", url: "/app/creator/profile", icon: Settings },
];

export function AppSidebar({ role }: { role: "advertiser" | "creator" }) {
  const { state } = useSidebar();
  const { user, signOut } = useDemoAuth();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const items = role === "advertiser" ? advertiserItems : creatorItems;

  return (
    <Sidebar collapsible="icon" side="right" className="border-l border-gray-100 bg-white">
      <SidebarHeader className="border-b border-gray-100 bg-white">
        <div className={cn("flex items-center gap-2.5 px-3 py-3.5", collapsed && "justify-center")}>
          <img src={matchlyIcon} alt="" className="h-8 w-8 object-contain shrink-0 rounded-xl" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-gray-900">Matchly</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit text-gray-500">
                {role === "advertiser" ? "בעל עסק / מפרסם" : "יוצר/ת תוכן"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-2 pt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-xl transition-all py-2.5 px-3",
                          active
                            ? "text-white shadow-md font-bold"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"
                        )}
                        style={active ? { background: "var(--gradient-brand)" } : undefined}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-white">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "var(--gradient-brand)" }}>
              {(user.fullName || "U").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">{user.fullName}</div>
              <div className="text-[10px] text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 mx-2 mb-1 rounded-xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>התנתקות</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
