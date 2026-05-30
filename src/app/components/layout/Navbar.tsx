"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { navbarNavItems } from "@/lib/site-nav";
import SiteLogo from "../ui/SiteLogo";
import { X, ChevronDown, LogOut, LayoutDashboard, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="flex items-center gap-4 flex-1">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              data-route-loader-ignore="true"
              className="md:hidden p-2 text-orange-400"
              aria-label={open ? "بستن منو" : "باز کردن منو"}
            >
              <Menu size={28} />
            </button>

            <div className="flex md:hidden items-center gap-2">
              {!user ? (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-black font-bold text-sm"
                >
                  ورود
                </Link>
              ) : (
                <>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400"
                    aria-label="خروج"
                  >
                    <LogOut size={18} />
                  </button>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs"
                  >
                    <LayoutDashboard size={16} className="text-orange-400" />
                    پنل
                  </Link>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-lg bg-orange-500 text-black font-bold text-sm hover:bg-orange-400 transition"
                >
                  ورود
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <LogOut size={18} />
                  </button>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:border-orange-500/50"
                  >
                    <LayoutDashboard size={18} className="text-orange-400" />
                    پنل کاربری
                  </Link>
                </div>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 flex-[2] justify-center">
            {navbarNavItems.map((item) =>
              item.children ? (
                <div key={item.title} className="relative group px-3 py-2">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors">
                    {item.title}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full right-0 w-56 pt-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/90 p-2 backdrop-blur-2xl shadow-2xl max-h-80 overflow-y-auto">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5"
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
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  {item.title}
                </Link>
              ),
            )}
          </nav>

          <div className="flex-1 flex justify-end">
            <SiteLogo />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[200] transition-all duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full overflow-y-auto w-80 bg-zinc-950 border-l border-white/10 p-8 transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-12">
            <SiteLogo showText={false} imageClassName="h-10 w-10 rounded-lg" className="gap-0" />
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
              <X size={32} />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-right">
            {navbarNavItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <>
                    <button
                      className="flex justify-between items-center w-full text-xl font-bold text-white"
                      onClick={() => setMobileOpen(mobileOpen === item.title ? null : item.title)}
                    >
                      <ChevronDown size={18} className={`text-orange-500 transition-transform ${mobileOpen === item.title ? "rotate-180" : ""}`} />
                      {item.title}
                    </button>
                    <div className={`mt-4 overflow-hidden transition-all ${mobileOpen === item.title ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="flex flex-col gap-4 pr-4 border-r border-orange-500/20 mr-2">
                        {item.children.map((sub) => (
                          <Link key={sub.href} href={sub.href} onClick={() => setOpen(false)} className="text-zinc-400 hover:text-orange-400">
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setOpen(false)} className="text-xl font-bold text-white hover:text-orange-400">
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
