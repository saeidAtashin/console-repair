"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type Mode = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword, loginWithOtp, sendOtp } = useAuth();

  const [mode, setMode] = useState<Mode>("password");

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [phone, setPhone] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);

  const [error, setError] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);

  // refs برای ۴ input
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // وقتی وارد حالت OTP شد و کد ارسال شد، روی input اول فوکوس کن
  useEffect(() => {
    if (codeSent) {
      otpRefs.current[0]?.focus();
    }
  }, [codeSent]);

  // Countdown timer
  useEffect(() => {
    if (!codeSent || counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [codeSent, counter]);

  // timeout OTP
  useEffect(() => {
    if (!codeSent) return;

    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false);
          setOtpDigits(["", "", "", ""]);
          setError("⏰ زمان کد تایید به پایان رسید.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [codeSent]);

  const validatePhone = (value: string): boolean => /^09\d{9}$/.test(value);

  const handlePasswordLogin = async (): Promise<void> => {
    setError("");
    try {
      const user = await loginWithPassword(username, password);
      if (user) {
        if (user.role === "admin") router.push("/admin");
        else router.push("/dashboard");
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است.");
      }
    } catch {
      setError("خطا در ورود با رمز عبور.");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value.slice(0, 11));
  };

  const handleOtpDigitChange = (index: number, value: string): void => {
    const digit = value.replace(/\D/g, "").slice(0, 1);

    setOtpDigits((prev) => {
      const updated = [...prev];
      updated[index] = digit;
      return updated;
    });

    if (digit && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSendOtp = async (): Promise<void> => {
    setError("");

    if (!validatePhone(phone)) {
      setError("شماره موبایل باید با 09 شروع شود و 11 رقم باشد.");
      return;
    }

    if (sendingOtp) return;

    setSendingOtp(true);
    try {
      const result = await sendOtp(phone);
      if (!result.success) {
        setError(result.message ?? "خطا در ارسال کد تایید.");
        return;
      }

      setCodeSent(true);
      setCounter(120);
      setOtpDigits(["", "", "", ""]);

      if (result.devCode) {
        console.log(`[OTP dev] ${phone} => ${result.devCode}`);
      }
    } catch {
      setError("خطا در ارسال کد تایید.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSendOtpSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void handleSendOtp();
  };

  const handleOtpLogin = async (): Promise<void> => {
    setError("");

    const otp = otpDigits.join("");

    if (otp.length !== 4) {
      setError("کد تأیید باید ۴ رقم باشد");
      return;
    }

    try {
      const user = await loginWithOtp(phone, otp);
      if (user) {
        router.push("/dashboard");
      } else {
        setError("کد تایید اشتباه است.");
      }
    } catch {
      setError("خطا در اعتبارسنجی کد تایید.");
    }
  };

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-black mb-2 text-center">ورود</h1>
        <p className="text-zinc-400 text-center mb-8">ورود به حساب کاربری</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode("password");
              setError("");
            }}
            className={`flex-1 py-3 rounded-xl ${
              mode === "password" ? "bg-cyan-500 text-black" : "bg-white/5"
            }`}
          >
            رمز عبور
          </button>

          <button
            onClick={() => {
              setMode("otp");
              setError("");
            }}
            className={`flex-1 py-3 rounded-xl ${
              mode === "otp" ? "bg-cyan-500 text-black" : "bg-white/5"
            }`}
          >
            OTP
          </button>
        </div>

        {mode === "password" ? (
          <div className="space-y-4">
            <input
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              placeholder="نام کاربری"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />

            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="رمز عبور"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />

            <button
              onClick={handlePasswordLogin}
              className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl"
            >
              ورود
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!codeSent ? (
              <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="شماره موبایل"
                  autoComplete="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={sendingOtp || !validatePhone(phone)}
                  className="w-full bg-white/10 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? "در حال ارسال..." : "ارسال کد"}
                </button>
              </form>
            ) : (
              <>
                {/* 4 input OTP */}
                <div className="flex justify-center gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      // ref={(el) => (otpRefs.current[index] = el)}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpDigitChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl"
                    />
                  ))}
                </div>

                <p className="text-sm text-center text-zinc-400">
                  زمان باقی‌مانده: {formatTime(counter)}
                </p>

                <button
                  onClick={handleOtpLogin}
                  className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl"
                >
                  تایید و ورود
                </button>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-400 mt-4 text-sm text-center">{error}</p>
        )}
      </div>
    </main>
  );
}
