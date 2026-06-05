import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Instagram } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

const businessTypes = ["ביוטי", "אופנה", "אוכל ומסעדות", "כושר ובריאות", "טכנולוגיה", "טיולים", "גיימינג", "בית ועיצוב", "חינוך", "אחר"];
const goals = ["מכירות", "מודעות למותג", "הגדלת עוקבים", "השקת מוצר", "קידום אירוע", "אחר"];
const locations = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "כל הארץ"];
const contentFormats = ["פוסט", "סטורי", "ריל"];

// Typical price ranges per content type (based on platform creator pricing)
const FORMAT_PRICE_HINTS: Record<string, string> = {
  "פוסט":  "₪300–₪900",
  "סטורי": "₪150–₪500",
  "ריל":   "₪400–₪1,200",
};

export default function CreateCampaignPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    business_name: "",
    business_type: "",
    goal: "",
    description: "",
    target_location: "",
    budget_min: "",
    budget_max: "",
    content_count: "1",
    deadline: "",
    requirements: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const toggleFormat = (f: string) =>
    setSelectedFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    if (!user) return;
    if (selectedFormats.length === 0) { setError("בחר לפחות פורמט תוכן אחד"); return; }
    if (parseInt(form.budget_min) > parseInt(form.budget_max)) { setError("תקציב מינימום לא יכול להיות גבוה ממקסימום"); return; }
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.from("campaigns").insert({
        advertiser_id: user.id,
        title: form.title,
        business_name: form.business_name,
        business_type: form.business_type,
        goal: form.goal,
        description: form.description || null,
        platform: "instagram",
        content_format: selectedFormats,
        content_count: parseInt(form.content_count),
        budget_min: parseInt(form.budget_min),
        budget_max: parseInt(form.budget_max),
        target_location: form.target_location,
        deadline: form.deadline || null,
        requirements: form.requirements || null,
        status,
      }).select().single();
      if (error) throw error;
      navigate(`/advertiser/campaigns/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl" dir="rtl">
      <button onClick={() => navigate("/app/campaigns")} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors" dir="ltr">
        <ArrowRight size={15} /> חזרה לקמפיינים
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">קמפיין חדש</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <Instagram size={14} className="text-pink-500" />
          <span className="text-sm text-gray-500 font-medium">Instagram בלבד</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={(e) => handleSubmit(e, "published")} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-gray-800">פרטי הקמפיין</h2>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">כותרת הקמפיין *</label>
            <input value={form.title} onChange={update("title")} placeholder="למשל: השקת קולקציית קיץ" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם העסק *</label>
            <input value={form.business_name} onChange={update("business_name")} placeholder="שם העסק שלך" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">תחום *</label>
              <select value={form.business_type} onChange={update("business_type")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
                <option value="">בחר...</option>
                {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מטרת הקמפיין *</label>
              <select value={form.goal} onChange={update("goal")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
                <option value="">בחר...</option>
                {goals.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">תיאור הקמפיין</label>
            <textarea value={form.description} onChange={update("description")} placeholder="תאר את הקמפיין, מה אתה מחפש, מה המסר..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-gray-800">פורמט תוכן</h2>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סוג תוכן *</label>
            <div className="flex gap-3">
              {contentFormats.map(f => (
                <button key={f} type="button" onClick={() => toggleFormat(f)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    selectedFormats.includes(f) ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            {selectedFormats.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFormats.map(f => (
                  <span key={f} className="text-[11px] px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
                    {f}: {FORMAT_PRICE_HINTS[f]} ליוצר
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">כמות פריטי תוכן *</label>
            <input value={form.content_count} onChange={update("content_count")} type="number" min="1" max="20" required className="w-32 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
          </div>
        </div>

        {/* Budget & Location */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-gray-800">תקציב ומיקום</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">תקציב מינימום (₪) *</label>
              <input value={form.budget_min} onChange={update("budget_min")} placeholder="500" type="number" min="0" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">תקציב מקסימום (₪) *</label>
              <input value={form.budget_max} onChange={update("budget_max")} placeholder="2000" type="number" min="0" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">מיקום יעד *</label>
            <select value={form.target_location} onChange={update("target_location")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
              <option value="">בחר מיקום...</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">דדליין</label>
            <input value={form.deadline} onChange={update("deadline")} type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-extrabold text-gray-800 mb-3">דרישות מהיוצר</h2>
          <textarea value={form.requirements} onChange={update("requirements")} placeholder="למשל: יוצר עם ניסיון בתחום היופי, תוכן בעברית, אזכור המוצר..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any, "draft")}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            שמור כטיוטה
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "מפרסם..." : "פרסם קמפיין"}
          </button>
        </div>
      </form>
    </div>
  );
}
