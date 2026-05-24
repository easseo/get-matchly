import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, role, loading } = useUser();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (loading) return;
    // Not logged in — no need to check onboarding
    if (!user) { setOnboardingDone(false); return; }
    // Role not yet available — wait for next render
    if (!role) return;

    const checkOnboarding = async () => {
      if (role === "advertiser") {
        const { data } = await supabase
          .from("advertiser_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        setOnboardingDone(!!data);
      } else if (role === "creator") {
        const { data } = await supabase
          .from("creator_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        setOnboardingDone(!!data);
      } else {
        setOnboardingDone(true); // agency — skip for now
      }
    };
    checkOnboarding();
  }, [user, role, loading]);

  if (loading || onboardingDone === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  if (!onboardingDone) {
    if (role === "advertiser") return <Navigate to="/onboarding/advertiser" replace />;
    if (role === "creator") return <Navigate to="/onboarding/creator" replace />;
  }

  return <>{children}</>;
}
