import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, Instagram, Eye, EyeOff, Building2, ChevronLeft } from "lucide-react";
import { useDemoAuth, type AppRole } from "@/hooks/useDemoAuth";
import { supabase } from "@/lib/supabase";
import matchlyIcon from "@/assets/matchly-icon.png";
import { cn } from "@/lib/utils";

type Step = "role" | "auth";

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn } = useDemoAuth();

  const initialRole = (params.get("role") as AppRole) || "creator";
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";

  const [step, setStep]     = useState<Step>("role");
  const [role, setRole]     = useState<AppRole>(initialRole);
  const [mode, setMode]     = useState<"signin" | "signup">(initialMode);

  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName]           = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);

    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("אימייל או סיסמה שגויים"); setLoading(false); return; }
    } else {
      const name = fullName.trim() || email.split("@")[0];
      const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } });
      if (err) { setError(err.message); setLoading(false); return; }
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", session.user.id).maybeSingle();
      const userRole: AppRole = (profile?.role as AppRole) ?? role;
      signIn(email, profile?.full_name ?? email.split("@")[0], userRole);
      if (userRole === "advertiser") {
        navigate("/app/dashboard");
      } else if (mode === "signup") {
        navigate("/app/creator/pricing-setup");
      } else {
        navigate("/app/creator/dashboard");
      }
    }
    setLoading(false);
  };

  const cardGradient = "var(--gradient-brand)";

  // ── Step 1: Role selection ──────────────────────────────
  if (step === "role") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-mesh" dir="rtl">
        <div className="absolute top-5 right-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            חזרה לאתר
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src={matchlyIcon} alt="Matchly" className="h-14 w-14 object-contain mb-3" />
            <h1 className="text-3xl font-black tracking-tight text-center">
              ברוכים הבאים ל‑<span className="text-brand">Matchly</span>
            </h1>
          </div>

          <div className="bg-card rounded-3xl shadow-card border border-border p-6">
            <p className="text-base font-extrabold text-foreground text-center mb-5">אני מצטרף/ת בתור:</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Creator */}
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all tap-scale text-center overflow-hidden",
                  role === "creator" ? "border-transparent shadow-xl" : "border-border bg-card hover:border-primary/40"
                )}
                style={role === "creator" ? { background: cardGradient } : undefined}
              >
                {role === "creator" && (
                  <span className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </span>
                )}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  role === "creator" ? "bg-white/20" : "bg-gradient-to-br from-pink-100 to-purple-100"
                )}>
                  <Instagram className={cn("w-7 h-7", role === "creator" ? "text-white" : "text-primary")} />
                </div>
                <div>
                  <div className={cn("font-extrabold text-base leading-tight", role === "creator" ? "text-white" : "text-foreground")}>
                    יוצר/ת תוכן
                  </div>
                  <div className={cn("text-[11px] font-medium mt-1 leading-tight", role === "creator" ? "text-white/75" : "text-muted-foreground")}>
                    תהנו משיתופי פעולה והרוויחו
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  role === "creator" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                )}>
                  חינם
                </span>
              </button>

              {/* Advertiser */}
              <button
                type="button"
                onClick={() => setRole("advertiser")}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all tap-scale text-center overflow-hidden",
                  role === "advertiser" ? "border-transparent shadow-xl" : "border-border bg-card hover:border-primary/40"
                )}
                style={role === "advertiser" ? { background: cardGradient } : undefined}
              >
                {role === "advertiser" && (
                  <span className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </span>
                )}
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  role === "advertiser" ? "bg-white/20" : "bg-muted"
                )}>
                  <Building2 className={cn("w-7 h-7", role === "advertiser" ? "text-white" : "text-gray-500")} />
                </div>
                <div>
                  <div className={cn("font-extrabold text-base leading-tight", role === "advertiser" ? "text-white" : "text-foreground")}>
                    בעל עסק / מפרסם
                  </div>
                  <div className={cn("text-[11px] font-medium mt-1", role === "advertiser" ? "text-white/75" : "text-muted-foreground")}>
                    פרסום קמפיינים
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  role === "advertiser" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                )}>
                  חינם
                </span>
              </button>
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={() => setStep("auth")}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-cta btn-glow tap-scale mb-3"
              style={{ background: cardGradient }}
            >
              <Sparkles className="w-4 h-4" />
              המשך להרשמה
            </button>

            {/* Guest */}
            <button
              type="button"
              onClick={() => {
                signIn("guest@matchly.net", "אורח", role);
                window.location.href = role === "creator" ? "/app/creator/dashboard" : "/app/dashboard";
              }}
              className="w-full py-3 rounded-2xl text-sm font-semibold transition-all tap-scale flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.07) 0%, rgba(236,72,153,0.07) 100%)",
                border: "1.5px solid transparent",
                backgroundClip: "padding-box",
              }}
            >
              <span
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1.5px",
                }}
              />
              <span className="text-transparent bg-clip-text font-bold" style={{ backgroundImage: "var(--gradient-brand)" }}>
                המשך ללא הרשמה
              </span>
              <span className="text-xs opacity-50 text-muted-foreground">←</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Auth form ──────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-mesh" dir="rtl">
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setStep("role")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          חזרה
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={matchlyIcon} alt="Matchly" className="h-12 w-12 object-contain mb-2" />
          {/* Role badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold mb-3"
            style={{ background: cardGradient }}
          >
            {role === "creator"
              ? <><Instagram className="w-3 h-3" /> יוצר/ת תוכן</>
              : <><Building2 className="w-3 h-3" /> בעל עסק / מפרסם</>}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">
            {mode === "signup" ? "יצירת חשבון" : "התחברות"}
          </h1>
        </div>

        <div className="bg-card rounded-3xl shadow-card border border-border p-6">
          {/* Mode tabs */}
          <div className="flex gap-1 border-b border-border mb-5">
            <TabButton active={mode === "signin"} onClick={() => setMode("signin")}>התחברות</TabButton>
            <TabButton active={mode === "signup"} onClick={() => setMode("signup")}>הרשמה</TabButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <Field label="שם מלא">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </Field>
            )}

            <Field label="אימייל">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                dir="ltr"
              />
            </Field>

            <Field label="סיסמה">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {mode === "signup" && (
              <Field label="אימות סיסמה">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full bg-background border rounded-xl px-4 py-3 pl-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40",
                      confirmPassword && confirmPassword !== password
                        ? "border-red-300 focus:ring-red-300"
                        : confirmPassword && confirmPassword === password
                        ? "border-emerald-300 focus:ring-emerald-300"
                        : "border-border"
                    )}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {confirmPassword && confirmPassword === password && (
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-bold">✓</span>
                  )}
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">הסיסמאות אינן תואמות</p>
                )}
              </Field>
            )}

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-primary-foreground font-bold shadow-cta btn-glow tap-scale flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: cardGradient }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {mode === "signin" ? "כניסה לדשבורד" : "יצירת חשבון"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors",
        active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
