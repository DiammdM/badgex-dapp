"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { homeContent } from "./i18n";

export default function Home() {
  const { language } = useLanguage();
  const copy = homeContent[language];

  return (
    <div className="space-y-20">
      <section className="grid animate-[fade-in-up_0.6s_ease-out_both] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-600">
            {copy.heroTag}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-[var(--font-display)] leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              {copy.heroDescription}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
              href="/builder"
            >
              {copy.primaryCta}
            </Link>
            <Link
              className="rounded-full border border-slate-900/15 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-900/30"
              href="/market"
            >
              {copy.secondaryCta}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {copy.highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm"
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
        <div className="rounded-[32px] border border-slate-900/10 bg-white/80 p-8 shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span className="uppercase tracking-[0.3em]">
              {copy.preview.title}
            </span>
            <span className="rounded-full border border-slate-900/10 px-3 py-1 text-xs">
              512 x 512
            </span>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1fr]">
            <div className="flex items-center justify-center rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-rose-200 p-6 shadow-inner">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-amber-800/70 bg-gradient-to-br from-amber-100 via-white to-amber-50 shadow-lg">
                <span className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-amber-900">
                  {language === "zh" ? "贡献者" : "Contributor"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.preview.nameLabel}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {copy.preview.badgeTitle}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.preview.attributesLabel}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                  {copy.preview.attributes.map((attribute) => (
                    <span
                      className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1"
                      key={attribute}
                    >
                      {attribute}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
                {copy.preview.note}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="space-y-6 rounded-[28px] border border-slate-900/10 bg-white/75 p-8">
          <h2 className="text-3xl font-[var(--font-display)] text-slate-900">
            {copy.flowTitle}
          </h2>
          <p className="text-base leading-7 text-slate-600">
            {copy.flowDescription}
          </p>
          <div className="grid gap-4">
            {copy.steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-slate-900/10 bg-white/70 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-amber-100">
                  {index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5"
            href="/builder"
          >
            {copy.flowCta}
          </Link>
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {copy.workspace.title}
            </p>
            <h3 className="mt-3 text-2xl font-[var(--font-display)] text-slate-900">
              {copy.workspace.subtitle}
            </h3>
            <div className="mt-6 grid gap-4">
              {copy.workspace.statuses.map((status) => (
                <div
                  key={status.title}
                  className="flex items-center justify-between rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {status.title}
                    </p>
                    <p className="text-slate-500">
                      {copy.workspace.badgeTitle}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100">
                    {language === "zh" ? "查看" : "View"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {copy.featured.title}
            </p>
            <div className="mt-5 space-y-4">
              {copy.featured.items.map((badge, index) => (
                <div
                  key={badge.name}
                  className="flex animate-[fade-in-up_0.6s_ease-out_both] items-center justify-between rounded-2xl border border-slate-900/10 bg-white/70 p-4 text-sm"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{badge.name}</p>
                    <p className="text-slate-500">
                      {badge.owner} - {badge.theme}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                    {badge.price}
                  </span>
                </div>
              ))}
            </div>
            <Link
              className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900"
              href="/market"
            >
              {copy.featured.cta}
            </Link>
          </div>
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-6 md:grid-cols-3"
        style={{ animationDelay: "200ms" }}
      >
        {copy.modules.items.map((module, index) => (
          <div
            key={module.title}
            className="flex h-full flex-col justify-between rounded-[26px] border border-slate-900/10 bg-white/75 p-6 shadow-sm"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {copy.modules.title}
              </p>
              <h3 className="text-xl font-[var(--font-display)] text-slate-900">
                {module.title}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {module.description}
              </p>
            </div>
            <Link
              className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900"
              href={module.href}
            >
              {module.action}
            </Link>
          </div>
        ))}
      </section>

      <section
        className="rounded-[32px] border border-slate-900/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-10 py-12 text-amber-50 animate-[fade-in-up_0.6s_ease-out_both]"
        style={{ animationDelay: "280ms" }}
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-[var(--font-display)]">
              {copy.closing.title}
            </h2>
            <p className="text-sm leading-7 text-amber-100/80">
              {copy.closing.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-amber-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              href="/builder"
            >
              {copy.closing.primary}
            </Link>
            <Link
              className="rounded-full border border-amber-200/40 px-6 py-3 text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5"
              href="/my-badges"
            >
              {copy.closing.secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
