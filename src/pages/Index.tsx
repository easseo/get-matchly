import { useState } from "react";
import Landing from "@/components/Landing";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import Loading from "@/components/Loading";
import Results from "@/components/Results";
import { pickThree, type Creator } from "@/data/creators";

type Screen = "landing" | "form" | "loading" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [, setCampaign] = useState<CampaignData | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSubmit = (data: CampaignData) => {
    setCampaign(data);
    setScreen("loading");
  };

  const handleLoadingDone = () => {
    const initial = pickThree();
    setCreators(initial);
    setSeenIds(initial.map((c) => c.id));
    setScreen("results");
  };

  const handleMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const next = pickThree(seenIds);
      setCreators(next);
      setSeenIds((prev) => [...prev, ...next.map((c) => c.id)]);
      setLoadingMore(false);
    }, 1500);
  };

  const handleRestart = () => {
    setScreen("landing");
    setCreators([]);
    setSeenIds([]);
  };

  if (screen === "landing") return <Landing onStart={() => setScreen("form")} />;
  if (screen === "form") return <CampaignForm onSubmit={handleSubmit} onBack={() => setScreen("landing")} />;
  if (screen === "loading")
    return (
      <Loading
        message="אנחנו מנתחים את הקמפיין שלך ובוחרים את היוצרים הכי מתאימים..."
        onDone={handleLoadingDone}
      />
    );
  return <Results creators={creators} onMore={handleMore} onRestart={handleRestart} loadingMore={loadingMore} />;
};

export default Index;
