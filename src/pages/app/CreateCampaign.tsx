import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/app/KpiCard";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export default function CreateCampaignPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CampaignData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      toast({ title: "שגיאה", description: "יש להתחבר מחדש", variant: "destructive" });
      return;
    }

    const title = `קמפיין ${data.business} — ${data.goal}`;
    const contentFormats = data.contents.map((c) => c.type);
    const contentCount = data.contents.reduce((sum, c) => sum + c.qty, 0);

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        advertiser_id: userId,
        title,
        business_name: data.business,
        business_type: data.business,
        goal: data.goal,
        description: null,
        platform: "instagram",
        content_format: contentFormats,
        content_count: contentCount,
        budget_min: Math.max(100, Math.round(data.budget * 0.7)),
        budget_max: Math.round(data.budget * 1.3),
        target_location: data.location,
        deadline: data.deadline ?? null,
        requirements: null,
        status: "receiving_proposals",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "שגיאה בשמירה", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "הקמפיין נוצר!", description: `${data.business} · ₪${data.budget.toLocaleString()}` });
    navigate(`/app/campaigns/${campaign.id}`);
  };

  return (
    <>
      <PageHeader title="יצירת קמפיין חדש" subtitle="ספרו לנו על הקמפיין ונתאים לכם יוצרי תוכן מנצחים" />
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <CampaignForm onSubmit={handleSubmit} onBack={() => navigate("/app/dashboard")} />
      </div>
    </>
  );
}
