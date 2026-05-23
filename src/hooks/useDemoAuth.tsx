import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppRole = "advertiser" | "creator";

export type DemoUser = {
  email: string;
  fullName: string;
  role: AppRole;
};

type AuthContextValue = {
  user: DemoUser | null;
  loading: boolean;
  signIn: (email: string, fullName: string, role: AppRole) => void;
  signOut: () => void;
};

const STORAGE_KEY = "matchly_demo_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const signIn = (email: string, fullName: string, role: AppRole) => {
    const next: DemoUser = { email, fullName, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useDemoAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDemoAuth must be used within AuthProvider");
  return ctx;
}
