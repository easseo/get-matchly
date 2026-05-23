import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Megaphone, FileText, MessageSquare,
  Star, CreditCard, Settings, LogOut, Sparkles, Compass, DollarSign,
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
    <Sidebar collapsible="icon" side="right" className="border-l border-border">
      <SidebarHeader className="border-b border-border">
        <div className={cn("flex items-center gap-2 px-2 py-3", collapsed && "justify-center")}>
          <img src={matchlyIcon} alt="" className="h-9 w-9 object-contain shrink-0" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight">Matchly</span>
              <span className="text-[9px] text-muted-foreground font-medium tracking-wider" dir="ltr">
                {role === "advertiser" ? "ADVERTISER" : "CREATOR"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
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
                          "flex items-center gap-3 rounded-xl transition-all",
                          active
                            ? "text-primary-foreground shadow-cta font-bold"
                            : "text-foreground/75 hover:text-foreground hover:bg-muted/60"
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

        {!collapsed && (
          <div className="mx-3 mt-4 rounded-2xl p-4 relative overflow-hidden" style={{ background: "var(--gradient-brand-soft)" }}>
            <Sparkles className="w-5 h-5 text-primary mb-2" />
            <div className="text-sm font-bold mb-1">שדרגו לPro</div>
            <div className="text-[11px] text-muted-foreground font-medium mb-3">
              גישה ליוצרים פרימיום והתאמות AI מתקדמות
            </div>
            <button className="w-full py-2 rounded-xl text-primary-foreground text-xs font-bold shadow-cta" style={{ background: "var(--gradient-brand)" }}>
              שדרוג עכשיו
            </button>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <button
          onClick={signOut}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 mx-1 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>התנתקות</span>}
        </button>
        {!collapsed && user && (
          <div className="text-[10px] text-muted-foreground px-3 pb-2 truncate">{user.email}</div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
