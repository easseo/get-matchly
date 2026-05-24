import { useEffect, useState } from "react";
import { ArrowRight, Instagram, Calendar, DollarSign, CheckCircle2, Hash, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Campaign, Proposal } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [existingProposal, setExistingProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).maybeSingle();
      setCampaign(c as Campaign);

      if (user) {
        const { data: p } = await supabase
          .from("proposals")
          .select("*")
          .eq("campaign_id", id)
          .eq("creator_id", user.id)
          .maybeSingle();
        setExistingProposal(p as Proposal);
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!campaign) return (
    <div className="p-6 text-center text-gray-500">הקמפיין לא נמצא</div>
  );

  const requirements = campaign.requirements ? campaign.requirements.split("\n").filter(Boolean) : [];

  return (
    <div className="p-4 md:p-6 max-w-4xl" dir="rtl">
      <Link
        to="/creator/browse"
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors w-fit"
        dir="ltr"
      >
        <ArrowRight size={15} />
        בחזרה לקמפיינים
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">{campaign.business_type}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
              <Instagram size={13} /> Instagram
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{campaign.title}</h1>
          <div className="flex items-center gap-1.5 mb-5 text-sm text-gray-500 font-semibold">
            <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
              {campaign.business_name[0]}
            </div>
            {campaign.business_name}
          </div>

          {/* Campaign Overview */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">סקירת קמפיין</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><DollarSign size={11} /> טווח תקציב</div>
                <div className="font-bold text-gray-900 text-sm">₪{campaign.budget_min.toLocaleString()} – ₪{campaign.budget_max.toLocaleString()}</div>
              </div>
              {campaign.deadline && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Calendar size={11} /> דדליין</div>
                  <div className="font-bold text-gray-900 text-sm">{new Date(campaign.deadline).toLocaleDateString("he-IL")}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Hash size={11} /> תוצרים</div>
                <div className="font-bold text-gray-900 text-sm">{campaign.content_count} × {campaign.content_format.join(", ")}</div>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div className="mb-5">
            <h2 className="font-extrabold text-gray-900 mb-2">מטרת הקמפיין</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{campaign.goal}</p>
          </div>

          {/* Description */}
          {campaign.description && (
            <div className="mb-6">
              <h2 className="font-extrabold text-gray-900 mb-2">תיאור</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{campaign.description}</p>
            </div>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="font-extrabold text-gray-900 mb-3">דרישות תוכן</h3>
              <ul className="space-y-2">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={15} className="text-green-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <Link
              to="/creator/browse"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              חזרה לקמפיינים
            </Link>
            {existingProposal ? (
              <div className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                הצעה הוגשה
              </div>
            ) : (
              <Link
                to={`/creator/campaigns/${id}/propose`}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-brand)" }}
              >
                הגשת הצעה
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
