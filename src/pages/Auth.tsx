import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Megaphone, Users, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useDemoAuth, type AppRole } from "@/hooks/useDemoAuth";
import { supabase } from "@/lib/supabase";
import matchlyIcon from "@/assets/matchly-icon.png";
import { cn } from "@/lib/utils";

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn } = useDemoAuth();
  const initialRole = (params.get("role") as AppRole) || "advertiser";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<AppRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("אימייל או סיסמה שגויים"); setLoading(false); return; }
    } else {
      const name = fullName.trim() || email.split("@")[0];
      const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } });
      if (err) { setError(err.message); setLoading(false); return; }
      // Save role to profiles table
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("profiles").upsert({ id: session.user.id, email, full_name: name, role });
      }
    }

    // Also set demo auth so AppLayout knows the role
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", session.user.id).maybeSingle();
      const userRole: AppRole = (profile?.role as AppRole) ?? role;
      signIn(email, profile?.full_name ?? email.split("@")[0], userRole);
      navigate(userRole === "advertiser" ? "/app/dashboard" : "/app/creator/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-mesh">
      <div className="absolute top-5 right-5">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 rotate-180" />
          חזרה לאתר
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={matchlyIcon} alt="Matchly" className="h-14 w-14 object-contain mb-2" />
          <h1 className="text-3xl font-black tracking-tight">
            ברוכים הבאים ל<span className="text-brand">Matchly</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            התחברו והתחילו לעבוד
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-card border border-border p-6">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-2xl mb-5">
            <RoleButton
              active={role === "advertiser"}
              onClick={() => setRole("advertiser")}
              icon={<Megaphone className="w-4 h-4" />}
              label="אני מפרסם"
            />
            <RoleButton
              active={role === "creator"}
              onClick={() => setRole("creator")}
              icon={<Users className="w-4 h-4" />}
              label="אני יוצר תוכן"
            />
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 border-b border-border mb-5">
            <TabButton active={mode === "signin"} onClick={() => setMode("signin")}>
              התחברות
            </TabButton>
            <TabButton active={mode === "signup"} onClick={() => setMode("signup")}>
              הרשמה
            </TabButton>
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
              />
            </Field>
            <Field label="סיסמה">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </Field>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-primary-foreground font-bold shadow-cta btn-glow tap-scale flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "var(--gradient-brand)" }}
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

function RoleButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all tap-scale",
        active ? "text-primary-foreground shadow-cta" : "text-foreground/70 hover:text-foreground"
      )}
      style={active ? { background: "var(--gradient-brand)" } : undefined}
    >
      {icon}
      {label}
    </button>
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
