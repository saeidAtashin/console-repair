"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import SiteLogo from "../ui/SiteLogo";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // تغییر استایل در هنگام اسکرول
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "خانه", href: "/" },
    {
      title: "تعمیرات",
      children: [
        { title: "تعمیر PS5", href: "/services/ps5-repair" },
        { title: "تعمیر PS4", href: "/services/ps4-repair" },
        { title: "تعمیر Xbox", href: "/services/xbox-repair" },
        { title: "تعمیر دسته", href: "/services/controller-repair" },
      ],
    },
    {
      title: "بازی",
      children: [
        { title: "نصب بازی PS5", href: "/services/game-install/ps5" },
        { title: "نصب بازی PS4", href: "/services/game-install/ps4" },
        { title: "نصب بازی Xbox One", href: "/services/game-install/xbox-one" },
        { title: "نصب بازی Xbox Series", href: "/services/game-install/xbox-series" },
      ],
    },
    {
      title: "فروشگاه",
      children: [
        { title: "خرید PS5", href: "/shop/ps5" },
        { title: "خرید PS4", href: "/shop/ps4" },
        { title: "خرید Xbox", href: "/shop/xbox" },
      ],
    },
    {
      title: "بلاگ",
      href: "/blog/controller-repair",
    },
    {
      title: "پیگیری",
      href: "/tracking",
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
          scrolled
            ? "border-white/10 bg-black/80 backdrop-blur-2xl h-16"
            : "border-transparent bg-transparent h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Actions / Auth (Left Side) */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-white"
            >
              <Menu size={28} />
            </button>

            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    className="relative group overflow-hidden px-6 py-2 rounded-lg bg-cyan-500 text-black font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">شروع تعمیرات</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:border-cyan-500/50 transition-all"
                  >
                    <LayoutDashboard size={18} className="text-cyan-400" />
                    پنل کاربری
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav (Center) */}
          <nav className="hidden md:flex items-center gap-1 flex-[2] justify-center">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.title} className="relative group px-3 py-2">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">
                    {item.title}
                    <ChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform duration-300"
                    />
                  </button>

                  <div className="absolute top-full right-0 w-56 pt-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/90 p-2 backdrop-blur-2xl shadow-2xl">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors relative group"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-500 -translate-x-1/2 transition-all group-hover:w-1/2" />
                </Link>
              ),
            )}
          </nav>

          {/* Logo (Right Side) */}
          <div className="flex-1 flex justify-end">
            <SiteLogo />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - با استایل Cyberpunk */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full overflow-y-auto w-80 bg-zinc-950 border-l border-white/10 p-8 transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Background Grid inside Mobile Menu */}
          <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-12">
              <SiteLogo
                showText={false}
                imageClassName="h-10 w-10 rounded-lg"
                className="gap-0"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-right">
              {navItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <>
                      <button
                        className="flex justify-between items-center w-full text-xl font-bold text-white"
                        onClick={() =>
                          setMobileOpen(
                            mobileOpen === item.title ? null : item.title,
                          )
                        }
                      >
                        <ChevronDown
                          size={18}
                          className={`text-cyan-500 transition-transform ${mobileOpen === item.title ? "rotate-180" : ""}`}
                        />
                        {item.title}
                      </button>
                      <div
                        className={`mt-4 overflow-hidden transition-all duration-300 ${mobileOpen === item.title ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="flex flex-col gap-4 pr-4 border-r border-cyan-500/20 mr-2">
                          {item.children.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpen(false)}
                              className="text-zinc-400 hover:text-cyan-400 transition-colors"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Auth Actions */}
            {!user && (
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 rounded-xl bg-white/5 text-center text-white"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 rounded-xl bg-cyan-500 text-center text-black font-bold shadow-lg shadow-cyan-500/20"
                >
                  ثبت نام
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
