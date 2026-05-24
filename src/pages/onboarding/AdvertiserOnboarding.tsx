import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2 } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

const businessTypes = ["ביוטי", "אופנה", "אוכל ומסעדות", "כושר ובריאות", "טכנולוגיה", "טיולים", "גיימינג", "בית ועיצוב", "חינוך", "אחר"];
const locations = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "ראשון לציון", "כל הארץ"];

export default function AdvertiserOnboarding() {
  const { user, refreshProfile } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    location: "",
    website: "",
    description: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Get user from session (reads localStorage, no network call)
      const { data: { session } } = await supabase.auth.getSession();
      const authUser = session?.user;
      if (!authUser) throw new Error("לא מחובר — נסה להתחבר מחדש");

      // Ensure profile row exists before inserting advertiser_profiles (FK constraint)
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authUser.id,
        role: "advertiser",
        full_name: authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? "מפרסם",
        email: authUser.email ?? "",
      }, { onConflict: "id" });
      if (profileError) throw profileError;

      const { error } = await supabase.from("advertiser_profiles").insert({
        user_id: authUser.id,
        business_name: form.business_name,
        business_type: form.business_type,
        location: form.location || null,
        website: form.website || null,
        description: form.description || null,
      });
      if (error) throw error;
      await refreshProfile();
      window.location.href = "/advertiser";
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
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Building2 size={20} className="text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">ספר לנו על העסק שלך</h1>
            <p className="text-sm text-gray-500">נשתמש בזה כדי למצוא לך יוצרי תוכן מתאימים</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">שם העסק *</label>
            <input value={form.business_name} onChange={update("business_name")} placeholder="למשל: מספרת דנה" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">תחום העסק *</label>
            <select value={form.business_type} onChange={update("business_type")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
              <option value="">בחר תחום...</option>
              {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">מיקום *</label>
            <select value={form.location} onChange={update("location")} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-white">
              <option value="">בחר מיקום...</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">אתר אינטרנט</label>
            <input value={form.website} onChange={update("website")} placeholder="https://..." type="url" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">תיאור קצר</label>
            <textarea value={form.description} onChange={update("description")} placeholder="ספר קצת על העסק שלך..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
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
