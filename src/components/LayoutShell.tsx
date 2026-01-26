"use client";

import Image from "next/image";
import Link from "next/link";
import { Monitor, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@src/components/LanguageProvider";
import { layoutCopy } from "../app/i18n";
import LanguageSwitch from "./LanguageSwitch";
import ConnectWalletButton from "@src/components/ConnectWalletButton";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const THEME_STORAGE_KEY = "badgex-theme";
  type ThemeMode = "light" | "dark" | "auto";
  const { language } = useLanguage();
  const copy = layoutCopy[language];
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    setThemeMode(stored ?? "auto");
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const shouldUseDark =
        themeMode === "dark" || (themeMode === "auto" && media.matches);
      document.documentElement.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();
    if (themeMode === "auto") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }

    return undefined;
  }, [themeMode]);

  const themeButtonClass = useMemo(
    () =>
      "flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:text-slate-900 cursor-pointer data-[active=true]:bg-slate-900 data-[active=true]:text-amber-100 dark:text-slate-300 dark:hover:text-white dark:data-[active=true]:bg-cyan-400/80 dark:data-[active=true]:text-slate-900 dark:data-[active=true]:shadow-[0_0_12px_rgba(34,211,238,0.55)]",
    []
  );
  const navItemClass = useMemo(
    () =>
      "rounded-full border border-transparent px-3 py-1 text-sm font-semibold text-slate-600 transition hover:border-slate-900/20 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-500/10 dark:hover:text-white",
    []
  );
  const navItemMobileClass = useMemo(
    () =>
      "whitespace-nowrap rounded-full border border-transparent px-3 py-1 transition hover:border-slate-900/20 hover:bg-slate-900/5 hover:text-slate-900 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-500/10 dark:hover:text-white",
    []
  );
  const locationText = useMemo(() => {
    if (!pathname || pathname === "/") return copy.location.home;
    if (pathname.startsWith("/builder")) return copy.nav.builder;
    if (pathname.startsWith("/my-badges")) return copy.nav.myBadges;
    if (pathname.startsWith("/badges")) return copy.nav.badges;
    if (pathname.startsWith("/market")) return copy.nav.market;
    return copy.location.home;
  }, [pathname, copy]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/10 bg-white/60 backdrop-blur-xl dark:border-cyan-400/20 dark:bg-black/70 dark:shadow-[0_0_28px_rgba(34,211,238,0.14)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              alt="Badgex logo"
              className="h-10 w-10 object-contain"
              height={40}
              priority
              src="/logo-dark.png"
              width={40}
            />
            <span className="text-lg font-semibold tracking-tight dark:text-slate-100">
              {copy.brand}
            </span>
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            <Link className={navItemClass} href="/builder">
              {copy.nav.builder}
            </Link>
            <Link className={navItemClass} href="/my-badges">
              {copy.nav.myBadges}
            </Link>
            <Link className={navItemClass} href="/badges">
              {copy.nav.badges}
            </Link>
            <Link className={navItemClass} href="/market">
              {copy.nav.market}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <ConnectWalletButton
              connectLabel={copy.connect}
              wrongNetworkLabel={copy.wrongNetwork}
              avatarUrl="/avatar-default.png"
            />
          </div>
        </div>
        <div className="border-t border-slate-900/5 md:hidden dark:border-white/10">
          <nav className="mx-auto flex w-full max-w-[1440px] gap-2 overflow-x-auto px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <Link className={navItemMobileClass} href="/builder">
              {copy.nav.builder}
            </Link>
            <Link className={navItemMobileClass} href="/my-badges">
              {copy.nav.myBadges}
            </Link>
            <Link className={navItemMobileClass} href="/badges">
              {copy.nav.badges}
            </Link>
            <Link className={navItemMobileClass} href="/market">
              {copy.nav.market}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:pt-24">
        {children}
      </main>
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-900/10 bg-white/70 backdrop-blur-xl dark:border-cyan-400/20 dark:bg-black/70 dark:shadow-[0_0_28px_rgba(34,211,238,0.14)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 py-0 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)] dark:shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {copy.footerTitle}
            </span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
              {copy.footerTagline}
            </span>
            <div className="hidden items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-[11px] text-slate-500 sm:flex dark:border-cyan-400/20 dark:bg-black/60 dark:text-slate-400">
              <span className="uppercase tracking-[0.2em]">
                {copy.location.label}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-100">
                {locationText}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-slate-900/10 bg-white/80 p-0.5 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-black/60 my-1">
              <button
                aria-label="Light theme"
                aria-pressed={themeMode === "light"}
                className={themeButtonClass}
                data-active={themeMode === "light"}
                onClick={() => {
                  localStorage.setItem(THEME_STORAGE_KEY, "light");
                  setThemeMode("light");
                }}
                type="button"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                aria-label="Dark theme"
                aria-pressed={themeMode === "dark"}
                className={themeButtonClass}
                data-active={themeMode === "dark"}
                onClick={() => {
                  localStorage.setItem(THEME_STORAGE_KEY, "dark");
                  setThemeMode("dark");
                }}
                type="button"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                aria-label="Auto theme"
                aria-pressed={themeMode === "auto"}
                className={themeButtonClass}
                data-active={themeMode === "auto"}
                onClick={() => {
                  localStorage.setItem(THEME_STORAGE_KEY, "auto");
                  setThemeMode("auto");
                }}
                type="button"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
            <div className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-slate-400 md:flex dark:text-slate-500">
              <Link
                className="transition hover:text-slate-700 dark:hover:text-white"
                href="/builder"
              >
                {copy.footerLinks.build}
              </Link>
              <Link
                className="transition hover:text-slate-700 dark:hover:text-white"
                href="/market"
              >
                {copy.footerLinks.market}
              </Link>
              <Link
                className="transition hover:text-slate-700 dark:hover:text-white"
                href="/my-badges"
              >
                {copy.footerLinks.manage}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
