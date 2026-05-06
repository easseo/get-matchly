import { useState } from "react";
import Landing from "@/components/Landing";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import Loading from "@/components/Loading";
import Results from "@/components/Results";
import CreatorOnboarding from "@/components/CreatorOnboarding";
import { matchCreators, type ScoredCreator } from "@/data/creators";

type Screen = "landing" | "form" | "loading" | "results" | "creator-onboarding";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [creators, setCreators] = useState<ScoredCreator[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSubmit = (data: CampaignData) => {
    setCampaign(data);
    setScreen("loading");
  };

  const handleLoadingDone = () => {
    if (!campaign) return;
    const initial = matchCreators(campaign, []);
    setCreators(initial);
    setSeenIds(initial.map((c) => c.id));
    setScreen("results");
  };

  const handleMore = () => {
    if (!campaign) return;
    setLoadingMore(true);
    setTimeout(() => {
      const next = matchCreators(campaign, seenIds);
      setCreators(next);
      setSeenIds((prev) => [...prev, ...next.map((c) => c.id)]);
      setLoadingMore(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScreen("landing");
    setCampaign(null);
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
    return <Results creators={creators} onMore={handleMore} onRestart={handleRestart} loadingMore={loadingMore} />;
  };

  return (
    <div className="md:min-h-screen md:flex md:items-start md:justify-center md:py-6 mobile-bg">
      <div className="mobile-shell">{renderScreen()}</div>
    </div>
  );
};

export default Index;
