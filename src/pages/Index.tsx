import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Landing from "@/components/Landing";
import DesktopLanding from "@/components/DesktopLanding";
import { useIsMobile } from "@/hooks/use-mobile";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import Loading from "@/components/Loading";
import Results from "@/components/Results";
import CreatorOnboarding from "@/components/CreatorOnboarding";
import CreatorOnboardingFlow from "@/components/CreatorOnboardingFlow";
import AdvertiserOnboardingFlow from "@/components/AdvertiserOnboardingFlow";
import { type ScoredCreator } from "@/data/creators";
import { runMatchingEngine } from "@/lib/matching";
import { toast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useDemoAuth } from "@/hooks/useDemoAuth";

type Screen = "landing" | "form" | "loading" | "results" | "creator-onboarding" | "creator-flow" | "advertiser-flow";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useDemoAuth();
  const [screen, setScreen] = useState<Screen>("landing");
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [creators, setCreators] = useState<ScoredCreator[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSubmit = async (data: CampaignData) => {
    setCampaign(data);
    setScreen("loading");
    try {
      const id = await saveCampaign({
        business: data.business,
        goal: data.goal,
        budget: data.budget,
        platform: data.platform,
        contents: data.contents,
        deadline: data.deadline,
      });
      setCampaignId(id);
      const matches = await matchAndSave(id, data, []);
      setCreators(matches);
      setSeenIds(matches.map((c) => c.id));
    } catch (e: any) {
      console.error(e);
      toast({ title: "שגיאה", description: e?.message ?? "לא הצלחנו לשמור את הקמפיין", variant: "destructive" });
      setScreen("form");
    }
  };

  const handleLoadingDone = () => {
    setScreen("results");
  };

  const handleMore = async () => {
    if (!campaign || !campaignId) return;
    setLoadingMore(true);
    try {
      const next = await matchAndSave(campaignId, campaign, seenIds);
      if (next.length === 0) {
        toast({ title: "אין יוצרים נוספים", description: "כבר הצגנו לכם את כל היוצרים הרלוונטיים לקמפיין הזה." });
      } else {
        setCreators(next);
        setSeenIds((prev) => [...prev, ...next.map((c) => c.id)]);
      }
    } catch (e: any) {
      toast({ title: "שגיאה", description: e?.message ?? "לא הצלחנו לטעון יוצרים נוספים", variant: "destructive" });
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRestart = () => {
    setScreen("landing");
    setCampaign(null);
    setCampaignId(null);
    setCreators([]);
    setSeenIds([]);
  };

  const renderScreen = () => {
    if (screen === "landing")
      return (
        <Landing
          onStart={() => setScreen("advertiser-flow")}
          onCreatorJoin={() => setScreen("creator-flow")}
        />
      );
    if (screen === "creator-onboarding")
      return <CreatorOnboarding onBack={() => setScreen("landing")} />;
    if (screen === "creator-flow")
      return (
        <CreatorOnboardingFlow
          onBack={() => setScreen("landing")}
          onContinue={() => navigate("/auth?role=creator&mode=signup")}
        />
      );
    if (screen === "advertiser-flow")
      return (
        <AdvertiserOnboardingFlow
          onBack={() => setScreen("landing")}
          onContinue={() => navigate("/auth?role=advertiser&mode=signup")}
        />
      );
    if (screen === "form") return <CampaignForm onSubmit={handleSubmit} onBack={() => setScreen("landing")} />;
    if (screen === "loading")
      return (
        <Loading
          message="מנתחים את הקמפיין שלכם ובוחרים את היוצרים שיביאו תוצאות"
          onDone={handleLoadingDone}
        />
      );
    return <Results creators={creators} onMore={handleMore} onRestart={handleRestart} onNewCampaign={() => setScreen("form")} loadingMore={loadingMore} />;
  };

  const dashboardHref = user
    ? user.role === "advertiser" ? "/app/dashboard" : "/app/creator/dashboard"
    : "/auth";

  const FloatingAuthBtn = (
    <Link
      to={dashboardHref}
      className="fixed top-3 left-3 z-50 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card/90 backdrop-blur border border-border text-xs font-bold shadow-soft hover:bg-card transition-colors"
    >
      <LogIn className="w-3.5 h-3.5" />
      {user ? "אזור אישי" : "התחברות"}
    </Link>
  );

  if (isMobile === false && screen === "landing") {
    return (
      <>
        {FloatingAuthBtn}
        <DesktopLanding
          onStart={() => navigate("/auth?role=advertiser&mode=signup")}
          onCreatorJoin={() => navigate("/auth?role=creator&mode=signup")}
        />
      </>
    );
  }

  return (
    <div className="mobile-bg md:min-h-screen md:flex md:items-start md:justify-center md:py-6">
      {screen === "landing" && FloatingAuthBtn}
      <div className="mobile-shell">{renderScreen()}</div>
    </div>
  );
};

export default Index;
