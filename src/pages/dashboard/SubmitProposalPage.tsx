import { useState, useEffect } from "react";
import { ArrowRight, Lightbulb, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

export default function SubmitProposalPage() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase.from("campaigns").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setCampaign(data as Campaign);
      if (data) setPrice(String(data.budget_min));
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setError("");
    setLoading(true);
    try {
      const fullMessage = estimatedDelivery
        ? `${message}\n\n---\nלוח זמנים:\n${estimatedDelivery}`
        : message;
      const { error } = await supabase.from("proposals").insert({
        campaign_id: id,
        creator_id: user.id,
        price: parseInt(price),
        message: fullMessage,
        status: "pending",
      });
      if (error) throw error;

      // Notify advertiser about new proposal
      if (campaign) {
        await supabase.from("notifications").insert({
          user_id: campaign.advertiser_id,
          type: "new_proposal",
          data: { message: `הצעה חדשה על "${campaign.title}"`, campaign_id: id },
        });
      }

      navigate(`/creator/campaigns/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl" dir="rtl">
      <Link
        to={`/creator/campaigns/${id}`}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors w-fit"
        dir="ltr"
      >
        <ArrowRight size={15} />
        חזרה לפרטי הקמפיין
      </Link>

      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-gray-900">הגשת הצעה</h1>
        <p className="text-sm text-gray-500 mt-0.5">ספר למותג למה אתה ההתאמה המושלמת לקמפיין</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campaign Summary */}
        {campaign && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">סיכום קמפיין</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold text-gray-900">{campaign.title}</div>
                <div className="text-sm text-purple-600 font-semibold mt-0.5">{campaign.business_name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-0.5">טווח תקציב</div>
                <div className="font-extrabold text-gray-900">₪{campaign.budget_min.toLocaleString()} – ₪{campaign.budget_max.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-extrabold text-gray-900 mb-4">מחיר מוצע</h2>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={1}
              className="w-full border border-gray-200 rounded-xl pr-8 pl-4 py-3 text-sm font-bold outline-none focus:border-primary transition-colors"
              dir="ltr"
            />
          </div>
          {campaign && (
            <div className="text-xs text-gray-400 mt-1">טווח תקציב הקמפיין: ₪{campaign.budget_min.toLocaleString()} – ₪{campaign.budget_max.toLocaleString()}</div>
          )}
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-extrabold text-gray-900 mb-1">רעיון תוכן ואסטרטגיה</h2>
          <p className="text-xs text-gray-400 mb-3">ספר על הגישה היצירתית שלך ואיך תציג את המותג</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="לדוגמה: אצור ריל אינסטגרם מרתק שיציג את המוצר..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary transition-colors resize-none placeholder-gray-300"
          />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-extrabold text-gray-900 mb-1">לוח זמנים לביצוע</h2>
          <p className="text-xs text-gray-400 mb-3">פרט את לוח הזמנים שלך מתחילת הפרויקט ועד הגשה</p>
          <textarea
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            rows={3}
            placeholder="לדוגמה: יום 1-3: תכנון ותסריטאות, יום 4-6: צילום ועריכה..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary transition-colors resize-none placeholder-gray-300"
          />
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={15} className="text-amber-500" />
            <span className="text-sm font-bold text-amber-700">טיפים מקצועיים</span>
          </div>
          <ul className="space-y-1">
            {[
              "היה אותנטי והצג את האישיות שלך",
              "שתף שיתופי פעולה מוצלחים קודמים",
              "הדגם הבנה עמוקה של ערכי המותג",
              "ספק לוח זמנים ריאלי",
            ].map((tip) => (
              <li key={tip} className="text-xs text-amber-700 flex items-start gap-1.5">
                <span className="mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={`/creator/campaigns/${id}`}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ביטול
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "שולח..." : "הגשת הצעה"}
          </button>
        </div>
      </form>
    </div>
  );
}
