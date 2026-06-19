import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/app/KpiCard";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import CampaignForm, { type CampaignData } from "@/components/CampaignForm";

async function insertCampaign(payload: object, retries = 2): Promise<{ data: any; error: any }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await supabase.from("campaigns").insert(payload).select().single();
    if (!result.error) return result;
    // Retry on network errors (Load failed, fetch failed, etc.)
    const isNetworkError = result.error.message?.toLowerCase().includes("load failed") ||
      result.error.message?.toLowerCase().includes("fetch") ||
      result.error.message?.toLowerCase().includes("network");
    if (!isNetworkError || attempt === retries - 1) return result;
    // Wait 1.5s before retry to let Supabase wake up
    await new Promise(r => setTimeout(r, 1500));
  }
  return { data: null, error: { message: "לא הצלחנו להתחבר לשרת" } };
}

export default function CreateCampaignPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CampaignData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      toast({ title: "שגיאה", description: "יש להתחבר מחדש", variant: "destructive" });
      return;
    }

    const title          = `קמפיין ${data.business} — ${data.goal}`;
    const contentFormats = data.contents.map(c => c.type);
    const contentCount   = data.contents.reduce((sum, c) => sum + c.qty, 0);

    const requirementsParts: string[] = [];
    if (data.brief) requirementsParts.push(data.brief);
    if (data.creatorTiers.length > 0) {
      requirementsParts.push(`גודל יוצר/ת רצוי: ${data.creatorTiers.join(", ")}`);
    }
    const requirements = requirementsParts.length > 0 ? requirementsParts.join("\n\n") : null;

    const { data: campaign, error } = await insertCampaign({
      advertiser_id:   userId,
      title,
      business_name:   data.business,
      business_type:   data.business,
      goal:            data.goal,
      description:     data.brief ?? null,
      platform:        "instagram",
      content_format:  contentFormats,
      content_count:   contentCount,
      budget_min:      0,
      budget_max:      0,
      target_location: data.location,
      deadline:        data.deadline ?? null,
      requirements,
      status:          "receiving_proposals",
    });

    if (error) {
      toast({
        title: "שגיאה בשמירה",
        description: "נסו שוב — ייתכן שהשרת לא היה זמין לרגע",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "הקמפיין נוצר!", description: `${data.business} · ${data.contentType}` });
    navigate(`/app/campaigns/${campaign.id}`);
  };

  return (
    <>
      <PageHeader title="יצירת קמפיין חדש" subtitle="ספרו לנו על הקמפיין — יוצרי התוכן יגישו לכם הצעות מחיר" />
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <CampaignForm onSubmit={handleSubmit} onBack={() => navigate("/app/dashboard")} />
      </div>
    </>
  );
}
