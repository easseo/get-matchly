import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { CreatorProfile } from "@/lib/supabase";

const niches = ["ביוטי", "אופנה", "אוכל ומסעדות", "כושר ובריאות", "טכנולוגיה", "טיולים", "גיימינג", "בית ועיצוב", "חינוך", "אחר"];
const locations = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "כל הארץ"];
const contentTypeOptions = ["פוסט", "סטורי", "ריל"];

export default function CreatorSettingsPage() {
  const { user, name, refreshProfile } = useUser();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: "", instagram_username: "", niche: "", location: "",
    followers: "", engagement_rate: "", price_min: "", price_max: "", bio: "",
  });
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    ]).then(([{ data: p }, { data: cp }]) => {
      setProfile(cp as CreatorProfile);
      setForm({
        full_name: (p as any)?.full_name ?? name,
        instagram_username: (cp as any)?.instagram_username ?? "",
        niche: (cp as any)?.niche ?? "",
        location: (cp as any)?.location ?? "",
        followers: String((cp as any)?.followers ?? ""),
        engagement_rate: String((cp as any)?.engagement_rate ?? ""),
        price_min: String((cp as any)?.price_min ?? ""),
        price_max: String((cp as any)?.price_max ?? ""),
        bio: (cp as any)?.bio ?? "",
      });
      setContentTypes((cp as any)?.content_types ?? []);
      setLoading(false);
    });
  }, [user]);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const toggleContentType = (t: string) =>
    setContentTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ full_name: form.full_name }).eq("id", user.id);
    await supabase.from("creator_profiles").update({
      instagram_username: form.instagram_username.replace("@", ""),
      niche: form.niche,
      location: form.location,
      followers: parseInt(form.followers) || 0,
      engagement_rate: parseFloat(form.engagement_rate) || 0,
      price_min: parseInt(form.price_min) || 0,
      price_max: parseInt(form.price_max) || 0,
      bio: form.bio || null,
      content_types: contentTypes,
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
        <p className="text-sm text-gray-500 mt-0.5">עדכן את פרטי הפרופיל שלך</p>
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
            <input value={form.full_name} onChange={update("full_name")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם משתמש באינסטגרם</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">@</span>
              <input value={form.instagram_username} onChange={update("instagram_username")} dir="ltr" className="w-full border border-gray-200 rounded-xl pr-8 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ביו</label>
            <textarea value={form.bio} onChange={update("bio")} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-extrabold text-gray-900">פרטי תוכן</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">תחום</label>
              <select value={form.niche} onChange={update("niche")} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary bg-white">
                <option value="">בחר...</option>
                {niches.map(n => <option key={n} value={n}>{n}</option>)}
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">עוקבים</label>
              <input type="number" value={form.followers} onChange={update("followers")} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">אחוז מעורבות %</label>
              <input type="number" step="0.1" value={form.engagement_rate} onChange={update("engagement_rate")} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מחיר מינימום ₪</label>
              <input type="number" value={form.price_min} onChange={update("price_min")} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מחיר מקסימום ₪</label>
              <input type="number" value={form.price_max} onChange={update("price_max")} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סוגי תוכן</label>
            <div className="flex gap-3">
              {contentTypeOptions.map(t => (
                <button key={t} type="button" onClick={() => toggleContentType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${contentTypes.includes(t) ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-500"}`}>
                  {t}
                </button>
              ))}
            </div>
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
