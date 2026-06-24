import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function readUserFromStorage() {
  try { return JSON.parse(localStorage.getItem("matchly_demo_user") || "null"); }
  catch { return null; }
}

export default function AppLayout({ role }: { role: "advertiser" | "creator" }) {
  const { user: ctxUser } = useDemoAuth();
  const user = ctxUser ?? readUserFromStorage();

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
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
      <BottomNav role={role} />
    </SidebarProvider>
  );
}
