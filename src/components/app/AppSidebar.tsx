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
    <Sidebar collapsible="icon" side="right" className="border-l border-border/70 bg-card">
      <SidebarHeader className="bg-card">
        <div className={cn("flex items-center gap-2.5 px-3 py-3.5", collapsed && "justify-center")}>
          <span className="h-9 w-9 shrink-0 rounded-xl bg-card border border-border/70 flex items-center justify-center shadow-soft">
            <img src={matchlyIcon} alt="" className="h-5 w-5 object-contain" />
          </span>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-tight text-foreground">Matchly</span>
              <span className="text-[11px] font-medium w-fit text-muted-foreground">
                {role === "advertiser" ? "בעל עסק / מפרסם" : "יוצר/ת תוכן"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card">
        <SidebarGroup className="px-3 pt-3">
          {!collapsed && <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground/70">ניווט</div>}
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
                          "relative flex items-center gap-3 rounded-xl transition-all duration-200 py-2.5 px-3",
                          active
                            ? "bg-primary/[0.07] text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
                        )}
                      >
                        {active && <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-brand" />}
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} strokeWidth={active ? 2.1 : 1.8} />
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

      <SidebarFooter className="border-t border-border/70 bg-card">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-card shadow-soft"
              style={{ background: "var(--gradient-brand)" }}>
              {(user.fullName || "U").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground truncate">{user.fullName}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 mx-2 mb-1 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors",
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
