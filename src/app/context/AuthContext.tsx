"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { getPostLoginPath } from "@/lib/auth-shared";

type Role = "admin" | "user";

type User = {
  name: string;
  role: Role;
  phone?: string;
};

type SendOtpResult = {
  success: boolean;
  message?: string;
  smsSent?: boolean;
  devCode?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithPassword: (username: string, password: string) => Promise<User | null>;
  sendOtp: (phone: string) => Promise<SendOtpResult>;
  loginWithOtp: (phone: string, code: string) => Promise<User | null>;
  register: (name: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithPassword = useCallback(
    async (username: string, password: string): Promise<User | null> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!data.success || !data.user) {
        return null;
      }

      setUser(data.user);
      router.replace(getPostLoginPath(data.user.role));
      return data.user;
    },
    [router],
  );

  const sendOtp = useCallback(async (phone: string): Promise<SendOtpResult> => {
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    return {
      success: data.success === true,
      message: typeof data.message === "string" ? data.message : undefined,
      smsSent: data.smsSent === true,
      devCode: typeof data.devCode === "string" ? data.devCode : undefined,
    };
  }, []);

  const loginWithOtp = useCallback(
    async (phone: string, code: string): Promise<User | null> => {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();
      if (!data.success || !data.user) {
        return null;
      }

      setUser(data.user);
      router.replace(getPostLoginPath(data.user.role));
      return data.user;
    },
    [router],
  );

  const register = useCallback((name: string) => {
    setUser({ name, role: "user" });
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithPassword,
        sendOtp,
        loginWithOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
