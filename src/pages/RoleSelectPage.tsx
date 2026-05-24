import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Building2, CheckCircle2, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import matchlyIcon from "@/assets/matchly-icon.png";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/supabase";

type Step = "role" | "creator-form" | "advertiser-form";

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", businessName: "", website: ""
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const signUp = async (role: UserRole, fullName: string) => {
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role, full_name: fullName },
        },
      });
      if (error) throw error;
      if (!data.user) throw new Error("לא הצלחנו ליצור חשבון");

      // Explicitly upsert the profile — don't rely solely on the DB trigger
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        role,
        full_name: fullName,
        email: form.email,
      }, { onConflict: "id" });
      if (profileError) throw profileError;

      // Navigate directly to onboarding — avoid double-redirect through AuthGuard
      window.location.href = role === "advertiser" ? "/onboarding/advertiser" : "/onboarding/creator";
    } catch (err: any) {
      if (err.message?.includes("already registered")) {
        setError("האימייל הזה כבר רשום. נסה להתחבר.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim() || "יוצר תוכן";
    signUp("creator", fullName);
  };

  const handleAdvertiserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = form.businessName || `${form.firstName} ${form.lastName}`.trim() || "בעל עסק";
    signUp("advertiser", fullName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 flex flex-col" dir="rtl">
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between" dir="ltr">
        <Link to="/" className="flex items-center gap-2">
          <img src={matchlyIcon} className="w-8 h-8 object-contain" alt="" />
          <span className="font-extrabold text-base" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
        </Link>
        <Link to="/login" className="text-sm font-bold text-gray-700">התחברות</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">

        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 font-medium shadow-lg">
            {error}
          </div>
        )}

        {step === "role" && (
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={matchlyIcon} className="w-8 h-8 object-contain" alt="" />
                <span className="font-extrabold text-lg" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Matchly</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">צור חשבון</h1>
              <p className="text-sm text-gray-500">בחר כיצד תרצה להתחיל</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setStep("creator-form")}
                className="p-6 rounded-2xl text-white text-right transition-all hover:opacity-95 hover:scale-[1.01]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h2 className="font-extrabold text-lg mb-1">יוצר תוכן</h2>
                <p className="text-sm text-white/80 mb-4">עבוד עם עסקים באינסטגרם</p>
                <ul className="space-y-1.5 text-sm text-white/90">
                  {["עיין בקמפיינים רלוונטיים", "הגש הצעות מחיר", "הרוויח מקמפיינים"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle2 size={14} className="shrink-0" />{item}</li>
                  ))}
                </ul>
              </button>

              <button
                onClick={() => setStep("advertiser-form")}
                className="p-6 rounded-2xl text-right border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all hover:scale-[1.01]"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 size={20} className="text-gray-600" />
                </div>
                <h2 className="font-extrabold text-lg mb-1 text-gray-900">מפרסם / בעל עסק</h2>
                <p className="text-sm text-gray-500 mb-4">מצא יוצרי תוכן לקמפיינים שלך</p>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  {["צור קמפיינים ממוקדים", "קבל התאמות חכמות", "בחר את היוצר המתאים"].map((item) => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary shrink-0" />{item}</li>
                  ))}
                </ul>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              כבר יש לך חשבון?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">התחבר</Link>
            </p>
          </div>
        )}

        {step === "creator-form" && (
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
            <button onClick={() => setStep("role")} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors" dir="ltr">
              <ArrowRight size={15} /> חזרה
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900">הרשמה כיוצר תוכן</h1>
            </div>
            <p className="text-sm text-gray-400 mb-6">מלא פרטים ליצירת חשבון</p>

            <form onSubmit={handleCreatorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">שם פרטי *</label>
                  <input value={form.firstName} onChange={update("firstName")} placeholder="שם פרטי" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">שם משפחה *</label>
                  <input value={form.lastName} onChange={update("lastName")} placeholder="שם משפחה" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">אימייל *</label>
                <input type="email" value={form.email} onChange={update("email")} placeholder="your@email.com" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">סיסמה *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="לפחות 6 תווים" required minLength={6} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors pl-10" dir="ltr" />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "var(--gradient-brand)" }}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "יוצר חשבון..." : "יצירת חשבון יוצר"}
              </button>
            </form>
          </div>
        )}

        {step === "advertiser-form" && (
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
            <button onClick={() => setStep("role")} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors" dir="ltr">
              <ArrowRight size={15} /> חזרה
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 size={16} className="text-gray-600" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900">הרשמה כמפרסם</h1>
            </div>
            <p className="text-sm text-gray-400 mb-6">מלא פרטים ליצירת חשבון עסקי</p>

            <form onSubmit={handleAdvertiserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">שם העסק *</label>
                <input value={form.businessName} onChange={update("businessName")} placeholder="שם העסק שלך" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">שם פרטי *</label>
                  <input value={form.firstName} onChange={update("firstName")} placeholder="שם פרטי" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">שם משפחה *</label>
                  <input value={form.lastName} onChange={update("lastName")} placeholder="שם משפחה" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">אימייל *</label>
                <input type="email" value={form.email} onChange={update("email")} placeholder="business@company.com" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">סיסמה *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="לפחות 6 תווים" required minLength={6} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors pl-10" dir="ltr" />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "var(--gradient-brand)" }}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "יוצר חשבון..." : "יצירת חשבון עסקי"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
