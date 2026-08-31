"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  phone: string;
  credits: number;
  signedInToday: boolean;
  lastSignInAt: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  signInDaily: () => Promise<{ ok: boolean; already: boolean; credits?: number }>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
  signInDaily: async () => ({ ok: false, already: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!cancelled) setUser(data.user ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }, [router]);

  const signInDaily = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/sign-in", { method: "POST" });
      const data = await res.json();
      await refresh();
      return {
        ok: !!data.ok,
        already: !!data.already,
        credits: data.credits as number | undefined,
      };
    } catch {
      return { ok: false, already: false };
    }
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, signInDaily }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
