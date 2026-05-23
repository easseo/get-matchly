import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/app/KpiCard";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import { toast } from "@/hooks/use-toast";

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const handleSubmit = (data: CampaignData) => {
    toast({ title: "הקמפיין נשמר!", description: `${data.business} · ₪${data.budget}` });
    navigate("/app/campaigns");
  };

  return (
    <>
      <PageHeader title="יצירת קמפיין חדש" subtitle="ספרו לנו על הקמפיין ונתאים לכם יוצרים מנצחים" />
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <CampaignForm onSubmit={handleSubmit} onBack={() => navigate("/app/dashboard")} />
      </div>
    </>
  );
}
