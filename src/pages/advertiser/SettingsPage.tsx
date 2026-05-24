import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

const businessTypes = ["ביוטי", "אופנה", "אוכל ומסעדות", "כושר ובריאות", "טכנולוגיה", "טיולים", "גיימינג", "בית ועיצוב", "חינוך", "אחר"];
const locations = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "כל הארץ"];

export default function AdvertiserSettingsPage() {
  const { user, name, refreshProfile } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: "", business_name: "", business_type: "", location: "", website: "", description: "",
  });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("advertiser_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    ]).then(([{ data: p }, { data: ap }]) => {
      setForm({
        full_name: (p as any)?.full_name ?? name,
        business_name: (ap as any)?.business_name ?? "",
        business_type: (ap as any)?.business_type ?? "",
        location: (ap as any)?.location ?? "",
        website: (ap as any)?.website ?? "",
        description: (ap as any)?.description ?? "",
      });
      setLoading(false);
    });
  }, [user]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: form.full_name }).eq("id", user.id);
    await supabase.from("advertiser_profiles").update({
      business_name: form.business_name,
      business_type: form.business_type,
      location: form.location || null,
      website: form.website || null,
      description: form.description || null,
    }).eq("user_id", user.id);
    await refreshProfile();
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">הגדרות פרופיל</h1>
        <p className="text-sm text-gray-500 mt-0.5">עדכן את פרטי העסק שלך</p>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-semibold">
          הפרופיל עודכן בהצלחה!
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-extrabold text-gray-900">פרטים אישיים</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם מלא</label>
            <input value={form.full_name} onChange={update("full_name")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-extrabold text-gray-900">פרטי העסק</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם העסק</label>
            <input value={form.business_name} onChange={update("business_name")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">תחום</label>
              <select value={form.business_type} onChange={update("business_type")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-white">
                <option value="">בחר...</option>
                {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מיקום</label>
              <select value={form.location} onChange={update("location")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-white">
                <option value="">בחר...</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">אתר אינטרנט</label>
            <input value={form.website} onChange={update("website")} dir="ltr" placeholder="https://" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">תיאור</label>
            <textarea value={form.description} onChange={update("description")} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: "var(--gradient-brand)" }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "שומר..." : "שמור שינויים"}
        </button>
      </div>
    </div>
  );
}
