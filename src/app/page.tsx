"use client";

import Link from "next/link";
import { useLanguage } from "@src/components/LanguageProvider";
import { homeContent } from "./i18n";

export default function Home() {
  const { language } = useLanguage();
  const copy = homeContent[language];

  return (
    <div className="space-y-24">
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-600 border-bright">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
            {copy.hero.tag}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-[var(--font-display)] leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {copy.hero.title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              {copy.hero.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              className="rounded-full border border-slate-900/10 bg-slate-900 px-6 py-3 text-sm font-semibold text-amber-50 shadow-[0_12px_28px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_36px_rgba(14,165,233,0.2)] border-bright"
              href="/builder"
            >
              {copy.hero.primaryCta}
            </Link>
            <Link
              className="rounded-full border border-slate-900/15 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-900/30 border-bright"
              href="/market"
            >
              {copy.hero.secondaryCta}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {copy.hero.badges.map((item) => (
              <span
                className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {copy.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm border-bright"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-8 top-10 h-48 w-48 rounded-full bg-sky-200/60 blur-3xl" />
          <div className="absolute -bottom-6 right-0 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="relative rounded-[32px] border border-slate-900/10 bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur border-bright">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.terminal.title}
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {copy.terminal.subtitle}
                </p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                Live
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {copy.terminal.stats.map((stat) => (
                <div
                  className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-3 text-sm"
                  key={stat.label}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {copy.terminal.pools.map((pool) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3 text-sm"
                  key={pool.name}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {pool.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {pool.risk}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {pool.apy}
                    </p>
                    <p className="text-xs text-slate-500">
                      {copy.terminal.poolMetricLabel} {pool.tvl}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-full border border-slate-900/10 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-600">
              <span className="uppercase tracking-[0.24em]">
                {copy.terminal.status.label}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
                {copy.terminal.status.value}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="space-y-8 animate-[fade-in-up_0.6s_ease-out_both]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.vaults.title}
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            {copy.vaults.title}
          </h2>
          <p className="text-base leading-7 text-slate-600">
            {copy.vaults.description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {copy.vaults.items.map((vault) => (
            <div
              key={vault.name}
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-slate-900/10 bg-white/75 p-6 shadow-sm border-bright"
            >
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-sky-100 blur-2xl" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">
                    {vault.name}
                  </p>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                    {vault.apy}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{vault.description}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {vault.tags.map((tag) => (
                    <span
                      className="rounded-full border border-slate-900/10 bg-white/80 px-2 py-1"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {copy.vaults.metricLabel}
                </span>
                <span className="font-semibold text-slate-900">
                  {vault.tvl}
                </span>
              </div>
              <div className="mt-6">
                <Link
                  className="inline-flex items-center text-sm font-semibold text-slate-900"
                  href="/market"
                >
                  {vault.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        style={{ animationDelay: "200ms" }}
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.features.title}
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            {copy.features.title}
          </h2>
          <p className="text-base leading-7 text-slate-600">
            {copy.features.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.features.items.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-[24px] border border-slate-900/10 bg-white/75 p-5 shadow-sm border-bright"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-xs font-semibold text-amber-100">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="space-y-8 animate-[fade-in-up_0.6s_ease-out_both]"
        style={{ animationDelay: "260ms" }}
      >
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.steps.title}
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            {copy.steps.title}
          </h2>
          <p className="text-base leading-7 text-slate-600">
            {copy.steps.description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {copy.steps.items.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[24px] border border-slate-900/10 bg-white/75 p-5 shadow-sm border-bright"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-amber-100">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        style={{ animationDelay: "320ms" }}
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.faq.title}
          </p>
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            {copy.faq.title}
          </h2>
          <p className="text-base leading-7 text-slate-600">
            {copy.faq.description}
          </p>
        </div>
        <div className="space-y-4">
          {copy.faq.items.map((item) => (
            <div
              key={item.question}
              className="rounded-[24px] border border-slate-900/10 bg-white/75 p-5 shadow-sm border-bright"
            >
              <p className="text-sm font-semibold text-slate-900">
                {item.question}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-[32px] border border-slate-900/10 bg-white/75 p-8 shadow-sm animate-[fade-in-up_0.6s_ease-out_both] border-bright"
        style={{ animationDelay: "380ms" }}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
              {copy.cta.title}
            </h2>
            <p className="text-base leading-7 text-slate-600">
              {copy.cta.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full border border-slate-900/10 bg-slate-900 px-6 py-3 text-sm font-semibold text-amber-50 shadow-[0_12px_28px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_36px_rgba(14,165,233,0.2)] border-bright"
              href="/builder"
            >
              {copy.cta.primary}
            </Link>
            <Link
              className="rounded-full border border-slate-900/15 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-900/30 border-bright"
              href="/my-badges"
            >
              {copy.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
