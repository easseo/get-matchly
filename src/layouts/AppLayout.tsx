import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";
import { useDemoAuth } from "@/hooks/useDemoAuth";

export default function AppLayout({ role }: { role: "advertiser" | "creator" }) {
  const { user, loading } = useDemoAuth();

  if (loading) return null;
  if (!user) return <Navigate to={`/auth?role=${role}`} replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === "advertiser" ? "/app/dashboard" : "/app/creator/dashboard"} replace />;
  }

  return (
    <SidebarProvider>
      <div dir="rtl" className="min-h-screen flex w-full bg-background">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-6 max-w-[1400px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomNav role={role} />
    </SidebarProvider>
  );
}
