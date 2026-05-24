import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, Profile, UserRole } from "@/lib/supabase";

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  role: UserRole | null;
  name: string;
  loading: boolean;
  setRole: (role: UserRole | null) => void;
  setName: (name: string) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  session: null,
  role: null,
  name: "",
  loading: true,
  setRole: () => {},
  setName: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) setProfile(data as Profile);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  // Legacy compatibility shims
  const setRole = async (role: UserRole | null) => {
    if (!user || !role) return;
    await supabase.from("profiles").update({ role }).eq("id", user.id);
    await refreshProfile();
  };

  const setName = async (name: string) => {
    if (!user) return;
    await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    await refreshProfile();
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      session,
      role: profile?.role ?? null,
      name: profile?.full_name ?? "",
      loading,
      setRole,
      setName,
      signOut,
      refreshProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
