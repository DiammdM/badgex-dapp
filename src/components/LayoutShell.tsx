"use client";

import Link from "next/link";
import { useLanguage } from "@src/components/LanguageProvider";
import { layoutCopy } from "../app/i18n";
import LanguageSwitch from "./LanguageSwitch";
import ConnectWalletButton from "@src/components/ConnectWalletButton";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const copy = layoutCopy[language];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/10 bg-white/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
              bx
            </span>
            <span className="text-lg font-semibold tracking-tight">
              {copy.brand}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link className="transition hover:text-slate-900" href="/builder">
              {copy.nav.builder}
            </Link>
            <Link className="transition hover:text-slate-900" href="/my-badges">
              {copy.nav.myBadges}
            </Link>
            <Link className="transition hover:text-slate-900" href="/badges">
              {copy.nav.badges}
            </Link>
            <Link className="transition hover:text-slate-900" href="/market">
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
        <div className="border-t border-slate-900/5 md:hidden">
          <nav className="mx-auto flex w-full max-w-[1440px] gap-4 overflow-x-auto px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <Link
              className="whitespace-nowrap hover:text-slate-900"
              href="/builder"
            >
              {copy.nav.builder}
            </Link>
            <Link
              className="whitespace-nowrap hover:text-slate-900"
              href="/my-badges"
            >
              {copy.nav.myBadges}
            </Link>
            <Link
              className="whitespace-nowrap hover:text-slate-900"
              href="/badges"
            >
              {copy.nav.badges}
            </Link>
            <Link
              className="whitespace-nowrap hover:text-slate-900"
              href="/market"
            >
              {copy.nav.market}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:pt-24">
        {children}
      </main>
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-900/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 py-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
            <span className="font-semibold text-slate-800">
              {copy.footerTitle}
            </span>
            <span className="hidden sm:inline text-slate-400">
              {copy.footerTagline}
            </span>
          </div>
          <div className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-slate-400 md:flex">
            <Link className="transition hover:text-slate-700" href="/builder">
              {copy.footerLinks.build}
            </Link>
            <Link className="transition hover:text-slate-700" href="/market">
              {copy.footerLinks.market}
            </Link>
            <Link className="transition hover:text-slate-700" href="/my-badges">
              {copy.footerLinks.manage}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
