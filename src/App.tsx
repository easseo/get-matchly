import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useDemoAuth";

// Critical path — loaded eagerly (small, always needed)
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import AppLayout from "./layouts/AppLayout.tsx";

// Advertiser pages — lazy loaded (each becomes its own chunk)
const AdvertiserDashboard       = lazy(() => import("./pages/app/Dashboard.tsx"));
const MyCampaigns               = lazy(() => import("./pages/app/MyCampaigns.tsx"));
const CreateCampaignPage        = lazy(() => import("./pages/app/CreateCampaign.tsx"));
const AllProposals              = lazy(() => import("./pages/app/AllProposals.tsx"));
const AdvertiserCampaignDetail  = lazy(() => import("./pages/advertiser/CampaignDetailPage.tsx"));
const Messages                  = lazy(() => import("./pages/app/Messages.tsx"));
const Reviews                   = lazy(() => import("./pages/app/Reviews.tsx"));
const Payments                  = lazy(() => import("./pages/app/Payments.tsx"));
const ProfileSettings           = lazy(() => import("./pages/app/ProfileSettings.tsx"));

// Creator pages — lazy loaded
const CreatorDashboard  = lazy(() => import("./pages/creator/CreatorDashboard.tsx"));
const BrowseCampaigns   = lazy(() => import("./pages/creator/BrowseCampaigns.tsx"));
const CreatorProposals  = lazy(() => import("./pages/creator/MyProposals.tsx"));
const Earnings          = lazy(() => import("./pages/creator/Earnings.tsx"));
const CreatorReviews    = lazy(() => import("./pages/creator/CreatorReviews.tsx"));
const CreatorProfile    = lazy(() => import("./pages/creator/CreatorProfile.tsx"));
const ContentDelivery   = lazy(() => import("./pages/creator/ContentDelivery.tsx"));

// Spinner shown while lazy chunks load
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // cache for 5 minutes
      gcTime: 10 * 60 * 1000,          // keep in memory 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,     // no re-fetch when switching tabs on mobile
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              <Route path="/app" element={<AppLayout role="advertiser" />}>
                <Route path="dashboard" element={<AdvertiserDashboard />} />
                <Route path="create" element={<CreateCampaignPage />} />
                <Route path="campaigns" element={<MyCampaigns />} />
                <Route path="campaigns/:id" element={<AdvertiserCampaignDetail />} />
                <Route path="proposals" element={<AllProposals />} />
                <Route path="messages" element={<Messages />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="payments" element={<Payments />} />
                <Route path="profile" element={<ProfileSettings />} />
              </Route>

              <Route path="/app/creator" element={<AppLayout role="creator" />}>
                <Route path="dashboard" element={<CreatorDashboard />} />
                <Route path="browse" element={<BrowseCampaigns />} />
                <Route path="proposals" element={<CreatorProposals />} />
                <Route path="earnings" element={<Earnings />} />
                <Route path="reviews" element={<CreatorReviews />} />
                <Route path="profile" element={<CreatorProfile />} />
                <Route path="submit" element={<ContentDelivery />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
