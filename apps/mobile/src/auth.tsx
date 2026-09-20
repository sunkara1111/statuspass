import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createMobileClient } from "./supabase";
import { ensureStudent, type StudentRecord } from "./student";
import { isSupabaseConfigured } from "./config";

type AuthState = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  student: StudentRecord | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  ready: false,
  configured: false,
  user: null,
  student: null,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const configured = isSupabaseConfigured();

  async function hydrate(session: Session | null) {
    const supabase = createMobileClient();
    if (!supabase || !session?.user) {
      setUser(null);
      setStudent(null);
      return;
    }
    setUser(session.user);
    const row = await ensureStudent(supabase);
    setStudent(row?.student ?? null);
  }

  async function refresh() {
    const supabase = createMobileClient();
    if (!supabase) {
      setUser(null);
      setStudent(null);
      setReady(true);
      return;
    }
    const { data } = await supabase.auth.getSession();
    await hydrate(data.session);
    setReady(true);
  }

  useEffect(() => {
    void refresh();
    const supabase = createMobileClient();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void hydrate(session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      configured,
      user,
      student,
      refresh,
      signOut: async () => {
        const supabase = createMobileClient();
        await supabase?.auth.signOut();
        setUser(null);
        setStudent(null);
      },
    }),
    [ready, configured, user, student],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
