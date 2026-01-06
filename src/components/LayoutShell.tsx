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
      <header className="border-b border-slate-900/10 bg-white/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
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
          <nav className="mx-auto flex w-full max-w-6xl gap-4 overflow-x-auto px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
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
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
        {children}
      </main>
      <footer className="border-t border-slate-900/10 bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-slate-900">{copy.footerTitle}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em]">
              {copy.footerTagline}
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link className="transition hover:text-slate-900" href="/builder">
              {copy.footerLinks.build}
            </Link>
            <Link className="transition hover:text-slate-900" href="/market">
              {copy.footerLinks.market}
            </Link>
            <Link className="transition hover:text-slate-900" href="/my-badges">
              {copy.footerLinks.manage}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
