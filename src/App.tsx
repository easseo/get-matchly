import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useDemoAuth";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import AppLayout from "./layouts/AppLayout.tsx";

import AdvertiserDashboard from "./pages/app/Dashboard.tsx";
import MyCampaigns from "./pages/app/MyCampaigns.tsx";
import CreateCampaignPage from "./pages/app/CreateCampaign.tsx";
import AllProposals from "./pages/app/AllProposals.tsx";
import Messages from "./pages/app/Messages.tsx";
import Reviews from "./pages/app/Reviews.tsx";
import Payments from "./pages/app/Payments.tsx";
import ProfileSettings from "./pages/app/ProfileSettings.tsx";

import CreatorDashboard from "./pages/creator/CreatorDashboard.tsx";
import BrowseCampaigns from "./pages/creator/BrowseCampaigns.tsx";
import CreatorProposals from "./pages/creator/MyProposals.tsx";
import Earnings from "./pages/creator/Earnings.tsx";
import CreatorReviews from "./pages/creator/CreatorReviews.tsx";
import CreatorProfile from "./pages/creator/CreatorProfile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/app" element={<AppLayout role="advertiser" />}>
              <Route path="dashboard" element={<AdvertiserDashboard />} />
              <Route path="create" element={<CreateCampaignPage />} />
              <Route path="campaigns" element={<MyCampaigns />} />
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
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
