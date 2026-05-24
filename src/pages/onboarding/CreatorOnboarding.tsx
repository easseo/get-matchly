import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

const niches = ["ביוטי", "אופנה", "אוכל ומסעדות", "כושר ובריאות", "טכנולוגיה", "טיולים", "גיימינג", "בית ועיצוב", "חינוך", "אחר"];
const locations = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "כל הארץ"];
const contentTypeOptions = ["פוסט", "סטורי", "ריל"];

export default function CreatorOnboarding() {
  const { user, refreshProfile } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [form, setForm] = useState({
    instagram_username: "",
    niche: "",
    location: "",
    followers: "",
    engagement_rate: "",
    price_min: "",
    price_max: "",
    bio: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const toggleContentType = (type: string) => {
    setContentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contentTypes.length === 0) { setError("בחר לפחות סוג תוכן אחד"); return; }
    setError("");
    setLoading(true);
    try {
      // Get user from session (reads localStorage, no network call)
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;
      if (!authUser) throw new Error("לא מחובר — נסה להתחבר מחדש");

      // Ensure profile row exists before inserting creator_profiles (FK constraint)
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authUser.id,
        role: "creator",
        full_name: authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "יוצר תוכן",
        email: authUser.email ?? "",
      }, { onConflict: "id" });
      if (profileError) throw profileError;

      const { error } = await supabase.from("creator_profiles").insert({
        user_id: authUser.id,
        instagram_username: form.instagram_username.replace("@", ""),
        niche: form.niche,
        location: form.location,
        followers: parseInt(form.followers),
        engagement_rate: parseFloat(form.engagement_rate),
        price_min: parseInt(form.price_min),
        price_max: parseInt(form.price_max),
        content_types: contentTypes,
        bio: form.bio || null,
      });
      if (error) throw error;
      await refreshProfile();
      window.location.href = "/creator";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={matchlyIcon} className="w-8 h-8 object-contain" alt="" />
          <span className="font-extrabold text-lg" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">ספר לנו עליך</h1>
            <p className="text-sm text-gray-500">נשתמש בזה כדי למצוא לך קמפיינים מתאימים</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם משתמש באינסטגרם *</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">@</span>
              <input value={form.instagram_username} onChange={update("instagram_username")} placeholder="username" required className="w-full border border-gray-200 rounded-xl pr-8 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">תחום התוכן *</label>
            <select value={form.niche} onChange={update("niche")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
              <option value="">בחר תחום...</option>
              {niches.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">מיקום *</label>
            <select value={form.location} onChange={update("location")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
              <option value="">בחר מיקום...</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מספר עוקבים *</label>
              <input value={form.followers} onChange={update("followers")} placeholder="10000" type="number" min="0" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">אחוז מעורבות *</label>
              <div className="relative">
                <input value={form.engagement_rate} onChange={update("engagement_rate")} placeholder="3.5" type="number" min="0" max="100" step="0.1" required className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-8 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מחיר מינימום *</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₪</span>
                <input value={form.price_min} onChange={update("price_min")} placeholder="500" type="number" min="0" required className="w-full border border-gray-200 rounded-xl pr-7 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">מחיר מקסימום *</label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₪</span>
                <input value={form.price_max} onChange={update("price_max")} placeholder="2000" type="number" min="0" required className="w-full border border-gray-200 rounded-xl pr-7 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">סוגי תוכן *</label>
            <div className="flex gap-3">
              {contentTypeOptions.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleContentType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    contentTypes.includes(type)
                      ? "border-primary text-primary bg-primary/5"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">ביו קצר</label>
            <textarea value={form.bio} onChange={update("bio")} placeholder="ספר קצת על עצמך..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "var(--gradient-brand)" }}>
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "שומר..." : "המשך לדשבורד"}
          </button>
        </form>
      </div>
    </div>
  );
}
