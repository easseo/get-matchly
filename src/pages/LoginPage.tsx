import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("לא ניתן להתחבר");

      // Fetch role and redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      const role = profile?.role;
      if (role === "advertiser") window.location.href = "/advertiser";
      else if (role === "agency") window.location.href = "/agency";
      else if (role === "creator") window.location.href = "/creator";
      else throw new Error("לא נמצא פרופיל. נסה להירשם מחדש.");
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "אימייל או סיסמה שגויים" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex flex-col" dir="rtl">
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between" dir="ltr">
        <Link to="/" className="flex items-center gap-2">
          <img src={matchlyIcon} className="w-8 h-8 object-contain" alt="" />
          <span className="font-extrabold text-base" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/signup" className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>הרשמה</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <img src={matchlyIcon} className="w-8 h-8 object-contain" alt="" />
              <span className="font-extrabold text-lg" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">התחברות</h1>
            <p className="text-sm text-gray-500 mb-6">ברוכים השבים ל-Matchly</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">אימייל</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">סיסמה</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors pl-10"
                    required
                    dir="ltr"
                  />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-brand)" }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "מתחבר..." : "התחברות"}
              </button>

              <p className="text-center text-sm text-gray-500">
                אין לך חשבון?{" "}
                <Link to="/signup" className="font-bold text-primary hover:underline">הירשם</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
