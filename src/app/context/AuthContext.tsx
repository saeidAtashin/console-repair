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
import { apiRequest, ApiError } from "@/lib/api-client";
import { clearAuthToken, setAuthToken } from "@/lib/auth-storage";

type Role = "admin" | "user";

type User = {
  name: string;
  role: Role;
  phone_number?: string;
};

type SendOtpResult = {
  success: boolean;
  message?: string;
  smsSent?: boolean;
  devCode?: string;
};

type LoginWithOtpResult = {
  user: User | null;
  message?: string;
};

type AuthPayload = {
  success?: boolean;
  message?: string;
  user?: User | null;
  token?: string;
  accessToken?: string;
  smsSent?: boolean;
  devCode?: string;
  data?: {
    phone_number?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithPassword: (phone_number: string, password: string) => Promise<User | null>;
  sendOtp: (phone_number: string) => Promise<SendOtpResult>;
  loginWithOtp: (phone_number: string, otp: string) => Promise<LoginWithOtpResult>;
  register: (name: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function resolveAuthToken(payload: AuthPayload): string | null {
  if (typeof payload.token === "string" && payload.token) {
    return payload.token;
  }

  if (typeof payload.accessToken === "string" && payload.accessToken) {
    return payload.accessToken;
  }

  return null;
}

/** Remote API often returns 2xx with `{ message, data }` and no `success` flag. */
function isSuccessfulPayload(payload: AuthPayload): boolean {
  return payload.success !== false;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void apiRequest<AuthPayload>("/api/auth/me")
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithPassword = useCallback(
    async (phone_number: string, password: string): Promise<User | null> => {
      const data = await apiRequest<AuthPayload>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number, password }),
        auth: false,
      });

      if (!data.success || !data.user) {
        return null;
      }

      const token = resolveAuthToken(data);
      if (token) {
        setAuthToken(token);
      }
      setUser(data.user);
      router.replace(getPostLoginPath(data.user.role));
      return data.user;
    },
    [router],
  );

  const sendOtp = useCallback(async (phone_number: string): Promise<SendOtpResult> => {
    try {
      const payload = await apiRequest<AuthPayload>("/auth/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number }),
        auth: false,
      });
      // Remote API returns 2xx with `{ message, data }` and no `success` flag.
      return {
        success: isSuccessfulPayload(payload),
        message:
          typeof payload.message === "string" ? payload.message : undefined,
        smsSent: payload.smsSent === true,
        devCode:
          typeof payload.devCode === "string" ? payload.devCode : undefined,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, message: error.message };
      }
      return {
        success: false,
        message: "پاسخ نامعتبر از سرور",
      };
    }
  }, []);

  const loginWithOtp = useCallback(
    async (phone_number: string, otp: string): Promise<LoginWithOtpResult> => {
      try {
        const data = await apiRequest<AuthPayload>("/auth/verify-otp/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number, otp }),
          auth: false,
        });
        const userPayload = data.user ?? undefined;
        if (data.success !== true || !userPayload) {
          return {
            user: null,
            message:
              typeof data.message === "string" ? data.message : "خطا در تایید کد",
          };
        }

        const token = resolveAuthToken(data);
        if (token) {
          setAuthToken(token);
        }

        setUser(userPayload);
        router.replace(getPostLoginPath(userPayload.role));
        return { user: userPayload };
      } catch (error) {
        if (error instanceof ApiError) {
          return { user: null, message: error.message };
        }
        return { user: null, message: "پاسخ نامعتبر از سرور" };
      }
    },
    [router],
  );

  const register = useCallback((name: string) => {
    setUser({ name, role: "user" });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore remote logout failure and clear local session state.
    }
    clearAuthToken();
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
