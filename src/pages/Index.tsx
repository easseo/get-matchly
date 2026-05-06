import { useState } from "react";
import Landing from "@/components/Landing";
import DesktopLanding from "@/components/DesktopLanding";
import { useIsMobile } from "@/hooks/use-mobile";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import Loading from "@/components/Loading";
import Results from "@/components/Results";
import CreatorOnboarding from "@/components/CreatorOnboarding";
import { type ScoredCreator } from "@/data/creators";
import { saveCampaign, matchAndSave } from "@/lib/matching";
import { toast } from "@/hooks/use-toast";

type Screen = "landing" | "form" | "loading" | "results" | "creator-onboarding";

const Index = () => {
  const isMobile = useIsMobile();
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
      setCreators(next);
      setSeenIds((prev) => [...prev, ...next.map((c) => c.id)]);
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
          onStart={() => setScreen("form")}
          onCreatorJoin={() => setScreen("creator-onboarding")}
        />
      );
    if (screen === "creator-onboarding")
      return <CreatorOnboarding onBack={() => setScreen("landing")} />;
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

  if (!isMobile && screen === "landing") {
    return (
      <DesktopLanding
        onStart={() => setScreen("form")}
        onCreatorJoin={() => setScreen("creator-onboarding")}
      />
    );
  }

  return (
    <div className={isMobile ? "mobile-bg md:min-h-screen md:flex md:items-start md:justify-center md:py-6" : "mobile-bg min-h-screen"}>
      <div className={isMobile ? "mobile-shell" : "desktop-shell"}>{renderScreen()}</div>
    </div>
  );
};

export default Index;
