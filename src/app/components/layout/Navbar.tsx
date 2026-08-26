"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useShopCart } from "@/app/context/ShopCartContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import CartNavLink from "../shop/CartNavLink";
import { navbarNavItems, type SiteNavItem } from "@/lib/site-nav";
import { SHOP_ENABLED } from "@/lib/shop";
import SiteLogo from "../ui/SiteLogo";
import ShopSearch from "../shop/ShopSearch";
import {
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

const CD_SCROLL_FACTOR = 0.35;
const CD_BURST_MS = 520;
const CD_BURST_EXTRA_DEG = 900;
const OPEN_MENU_DELAY_MS = 200;

function getRotationDeg(el: HTMLElement) {
  const { transform } = window.getComputedStyle(el);
  if (!transform || transform === "none") return 0;
  const { a, b } = new DOMMatrix(transform);
  return (Math.atan2(b, a) * 180) / Math.PI;
}

function navLinkActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function navItemActive(pathname: string, item: SiteNavItem) {
  if (navLinkActive(pathname, item.href)) return true;
  return item.children?.some((child) => navLinkActive(pathname, child.href)) ?? false;
}

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount, cartBounce } = useShopCart();
  const hideShopSearch = !SHOP_ENABLED || pathname.startsWith("/shop");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const cdRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burstRafRef = useRef<number | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRafPendingRef = useRef(false);
  const isBurstingRef = useRef(false);
  const scrollRotationRef = useRef(0);

  useEffect(() => {
    const updateCdFromScroll = () => {
      const el = cdRef.current;
      if (!el || isBurstingRef.current) return;
      el.style.transform = `rotate(${scrollRotationRef.current}deg)`;
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      scrollRotationRef.current = window.scrollY * CD_SCROLL_FACTOR;

      if (scrollRafPendingRef.current) return;
      scrollRafPendingRef.current = true;
      requestAnimationFrame(() => {
        scrollRafPendingRef.current = false;
        updateCdFromScroll();
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (burstRafRef.current) cancelAnimationFrame(burstRafRef.current);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const burstCdOnOpen = useCallback(() => {
    const el = cdRef.current;
    if (!el) return;

    if (burstRafRef.current) cancelAnimationFrame(burstRafRef.current);
    isBurstingRef.current = true;

    const startTime = performance.now();
    const startAngle = getRotationDeg(el);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / CD_BURST_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      const burstAngle = startAngle + CD_BURST_EXTRA_DEG * eased;
      el.style.transform = `rotate(${burstAngle}deg)`;

      if (progress < 1) {
        burstRafRef.current = requestAnimationFrame(tick);
        return;
      }

      isBurstingRef.current = false;
      el.style.transform = `rotate(${scrollRotationRef.current}deg)`;
      burstRafRef.current = null;
    };

    burstRafRef.current = requestAnimationFrame(tick);
  }, []);

  const openMenu = useCallback(() => {
    burstCdOnOpen();
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      setOpen(true);
      openTimerRef.current = null;
    }, OPEN_MENU_DELAY_MS);
  }, [burstCdOnOpen]);

  const closeMenu = useCallback((returnFocus = false) => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setOpen(false);
    setMobileOpen(null);
    const el = cdRef.current;
    if (el && !isBurstingRef.current) {
      el.style.transform = `rotate(${scrollRotationRef.current}deg)`;
    }
    if (returnFocus) {
      menuToggleRef.current?.focus();
    }
  }, []);

  const toggleMenu = useCallback(() => {
    if (open) closeMenu(true);
    else openMenu();
  }, [open, closeMenu, openMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeMenu]);

  const cartClassName =
    "rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-200 transition hover:border-cyan-500/50 touch-manipulation";

  const loginClassName =
    "relative overflow-hidden rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 sm:px-5 lg:px-6 touch-manipulation";

  const panelClassName =
    "flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-bold text-white transition-all hover:border-cyan-500/50 sm:gap-2 sm:px-5 sm:text-sm touch-manipulation";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-all duration-500 ${scrolled
          ? "h-16 border-white/10 bg-black/80 backdrop-blur-2xl"
          : "h-16 border-transparent bg-transparent md:h-20"
          }`}
      >
        <div
          className="mx-auto h-full max-w-7xl flex justify-between items-center sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4 px-4 sm:px-6"
        >
          {/* Actions — end (left in RTL) */}
          <div className="flex min-w-0 items-center justify-start gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 lg:flex xl:gap-3">
              {!user ? (
                <Link href="/login" className={loginClassName}>
                  ورود
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className={panelClassName}
                  >
                    <LayoutDashboard
                      size={16}
                      className="shrink-0 text-cyan-400 sm:hidden"
                    />
                    <LayoutDashboard
                      size={18}
                      className="hidden shrink-0 text-cyan-400 sm:block"
                    />
                    <span className="hidden sm:inline">پنل کاربری</span>
                    <span className="sm:hidden">پنل</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20 touch-manipulation"
                    aria-label="خروج"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}

              {SHOP_ENABLED ? (
                <CartNavLink
                  itemCount={itemCount}
                  receiving={cartBounce}
                  className={cartClassName}
                />
              ) : null}
              {!hideShopSearch ? (
                <div className="hidden xl:block">
                  <ShopSearch variant="header" onNavigate={() => closeMenu()} />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                ref={menuToggleRef}
                type="button"
                onClick={toggleMenu}
                data-route-loader-ignore="true"
                className="relative h-10 w-10 shrink-0 touch-manipulation sm:h-11 sm:w-11"
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                aria-expanded={open}
                aria-controls="mobile-nav-drawer"
              >
                <div
                  ref={cdRef}
                  className="h-10 w-10 will-change-transform sm:h-11 sm:w-11"
                >
                  <Image
                    src="/obj-console/cd.png"
                    alt=""
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.35)] filter hue-rotate-331 saturate-200 sm:h-11 sm:w-11"
                    priority
                  />
                </div>
              </button>
              {SHOP_ENABLED ? (
                <CartNavLink
                  itemCount={itemCount}
                  receiving={cartBounce}
                  className={cartClassName}
                />
              ) : null}
            </div>
          </div>
          {/* Desktop nav — center */}
          <nav
            className="hidden items-center justify-center gap-0.5 lg:flex xl:gap-1"
            aria-label="منوی اصلی"
          >
            {navbarNavItems.map((item) => {
              const active = navItemActive(pathname, item);

              return item.children ? (
                <div
                  key={item.title}
                  className="group relative px-1.5 py-2 before:absolute before:inset-x-0 before:-bottom-4 before:h-4 xl:px-3"
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-0.5 text-xs font-medium transition-colors lg:text-sm ${active
                      ? "text-cyan-400"
                      : "text-zinc-400 hover:text-cyan-400"
                      }`}
                  >
                    {item.title}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-300 group-hover:rotate-180"
                      aria-hidden
                    />
                    <span
                      className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-cyan-500 transition-all ${active ? "w-1/2" : "w-0 group-hover:w-1/2"
                        }`}
                    />
                  </Link>

                  <div className="invisible absolute top-full right-0 w-56 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/90 p-2 shadow-2xl backdrop-blur-2xl">
                      {item.children.map((sub) => {
                        const subActive = navLinkActive(pathname, sub.href);

                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            aria-current={subActive ? "page" : undefined}
                            className={`block rounded-xl px-4 py-2.5 text-sm transition-all ${subActive
                              ? "bg-white/5 text-cyan-400"
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                              }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative px-2 py-2 text-xs font-medium transition-colors lg:text-sm xl:px-4 ${active
                    ? "text-cyan-400"
                    : "text-zinc-400 hover:text-cyan-400"
                    }`}
                >
                  {item.title}
                  <span
                    className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 bg-cyan-500 transition-all ${active ? "w-1/2" : "w-0 group-hover:w-1/2"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Logo — start (right in RTL) */}
          <div className="flex min-w-0 items-center justify-end">
            <SiteLogo
              className={scrolled ? "scale-95 transition-transform" : ""}
            />
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => closeMenu(true)}
          aria-hidden
        />

        <div
          id="mobile-nav-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="منوی موبایل"
          className={`absolute right-0 top-0 flex h-full w-[min(100vw-3rem,20rem)] flex-col overflow-hidden border-l border-white/10 bg-zinc-950 transition-transform duration-500 sm:w-80 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-5 py-5 sm:px-8 sm:py-6">
              <SiteLogo
                showText={false}
                imageClassName="h-10 w-10 rounded-lg"
                className="gap-0"
              />
              <button
                type="button"
                onClick={() => closeMenu(true)}
                data-route-loader-ignore="true"
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white touch-manipulation"
                aria-label="بستن منو"
              >
                <X size={28} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 [-webkit-overflow-scrolling:touch] sm:px-8">
              {!hideShopSearch ? (
                <div className="mb-6">
                  <ShopSearch variant="header" onNavigate={() => closeMenu()} />
                </div>
              ) : null}

              <nav
                className="flex flex-col gap-1 text-right"
                aria-label="منوی موبایل"
              >
                {navbarNavItems.map((item) => {
                  const active = navItemActive(pathname, item);

                  return (
                    <div key={item.title}>
                      {item.children ? (
                        <>
                          <div className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-2 py-2">
                            <Link
                              href={item.href}
                              onClick={() => closeMenu()}
                              aria-current={active ? "page" : undefined}
                              className={`text-lg font-bold transition-colors sm:text-xl ${active
                                ? "text-cyan-400"
                                : "text-white hover:text-cyan-400"
                                }`}
                            >
                              {item.title}
                            </Link>
                            <button
                              type="button"
                              dir="ltr"
                              data-route-loader-ignore="true"
                              aria-expanded={mobileOpen === item.title}
                              aria-label={`${item.title} — زیرمنو`}
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-cyan-500 transition-colors hover:bg-white/5 touch-manipulation"
                              onClick={() =>
                                setMobileOpen(
                                  mobileOpen === item.title ? null : item.title,
                                )
                              }
                            >
                              <ChevronDown
                                size={18}
                                className={`transition-transform ${mobileOpen === item.title ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                          <div
                            className={`grid transition-all duration-300 ${mobileOpen === item.title ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                          >
                            <div className="overflow-hidden">
                              <div className="mr-2 flex flex-col gap-3 border-r border-cyan-500/20 py-1 pr-4">
                                {item.children.map((sub) => {
                                  const subActive = navLinkActive(pathname, sub.href);

                                  return (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={() => closeMenu()}
                                      aria-current={subActive ? "page" : undefined}
                                      className={`text-sm transition-colors sm:text-base ${subActive
                                        ? "text-cyan-400"
                                        : "text-zinc-400 hover:text-cyan-400"
                                        }`}
                                    >
                                      {sub.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => closeMenu()}
                          aria-current={active ? "page" : undefined}
                          className={`block min-h-[44px] rounded-xl px-2 py-3 text-lg font-bold transition-colors sm:text-xl ${active
                            ? "text-cyan-400"
                            : "text-white hover:text-cyan-400"
                            }`}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="shrink-0 border-t border-white/5 px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex flex-col gap-3">
                {SHOP_ENABLED ? (
                  <Link
                    href="/shop/cart"
                    data-shop-cart-target
                    onClick={() => closeMenu()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-3.5 text-center text-sm font-bold text-white transition-all hover:border-cyan-500/50 sm:py-4 sm:text-base touch-manipulation"
                  >
                    <ShoppingCart size={20} className="text-cyan-400" />
                    سبد خرید
                    {itemCount > 0 ? (
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-500 px-1 text-xs text-black">
                        {itemCount}
                      </span>
                    ) : null}
                  </Link>
                ) : null}
                {!user ? (
                  <Link
                    href="/login"
                    onClick={() => closeMenu()}
                    className="w-full rounded-xl bg-cyan-500 py-3.5 text-center text-sm font-bold text-black shadow-lg shadow-cyan-500/20 sm:py-4 sm:text-base touch-manipulation"
                  >
                    ورود / ثبت‌نام
                  </Link>
                ) : (
                  <>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => closeMenu()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-3.5 text-center text-sm font-bold text-white transition-all hover:border-cyan-500/50 sm:py-4 sm:text-base touch-manipulation"
                    >
                      <LayoutDashboard size={20} className="text-cyan-400" />
                      پنل کاربری
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 sm:py-4 sm:text-base touch-manipulation"
                    >
                      <LogOut size={20} />
                      خروج
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
