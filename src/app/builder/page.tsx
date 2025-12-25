"use client";

import Link from "next/link";
import { useLanguage } from "../_components/LanguageProvider";
import { builderContent } from "../i18n";

export default function BuilderPage() {
  const { language } = useLanguage();
  const copy = builderContent[language];
  const metadataJson = JSON.stringify(copy.metadataPreview, null, 2);

  return (
    <div className="space-y-10">
      <section className="flex animate-[fade-in-up_0.6s_ease-out_both] flex-wrap items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {copy.label}
          </p>
          <h1 className="text-3xl font-[var(--font-display)] text-slate-900 sm:text-4xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {copy.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {copy.statusDraft}
            </span>
            <span className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1">
              {copy.statusLocal}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
            type="button"
          >
            {copy.reset}
          </button>
          <button
            className="rounded-full border border-slate-900/15 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
            type="button"
          >
            {copy.updatePreview}
          </button>
          <button
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            type="button"
          >
            {copy.saveToIpfs}
          </button>
        </div>
      </section>

      <section
        className="grid animate-[fade-in-up_0.6s_ease-out_both] gap-8 lg:grid-cols-[1fr_1fr]"
        style={{ animationDelay: "120ms" }}
      >
        <div className="rounded-[28px] border border-slate-900/10 bg-white/75 p-6 shadow-lg shadow-slate-900/5">
          <h2 className="text-lg font-semibold text-slate-900">
            {copy.configTitle}
          </h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.badgeName}
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                placeholder={copy.badgeNamePlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.descriptionLabel}
              </label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                placeholder={copy.descriptionPlaceholder}
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.category}
              </label>
              <select className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none">
                {copy.categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {copy.theme}
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {copy.themes.map((theme) => (
                  <button
                    className="flex items-center justify-between rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5"
                    key={theme.name}
                    type="button"
                  >
                    {theme.name}
                    <span className={`h-4 w-4 rounded-full ${theme.accent}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.shape}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.shapes.map((shape) => (
                    <button
                      className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                      key={shape}
                      type="button"
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.border}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.borders.map((border) => (
                    <button
                      className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                      key={border}
                      type="button"
                    >
                      {border}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.icon}
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {copy.icons.map((icon) => (
                    <button
                      className="rounded-2xl border border-slate-900/10 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
                      key={icon}
                      type="button"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.text}
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-800 focus:border-slate-900/40 focus:outline-none"
                  placeholder={copy.textPlaceholder}
                  type="text"
                />
                <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {copy.level}
                </label>
                <input
                  className="mt-2 w-full accent-slate-900"
                  defaultValue={3}
                  max={5}
                  min={1}
                  step={1}
                  type="range"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{copy.previewTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {copy.previewPill}
              </span>
            </div>
            <div className="mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-amber-100 p-6">
              <svg
                aria-hidden="true"
                className="h-52 w-52 drop-shadow-xl"
                viewBox="0 0 200 200"
              >
                <defs>
                  <linearGradient id="badgeFill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fff7db" />
                    <stop offset="100%" stopColor="#f7c8a5" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#badgeFill)"
                  points="100,14 170,55 170,145 100,186 30,145 30,55"
                  stroke="#8a5a44"
                  strokeWidth="8"
                />
                <text
                  fill="#6b3f2c"
                  fontSize="16"
                  fontWeight="700"
                  textAnchor="middle"
                  x="100"
                  y="110"
                >
                  {copy.previewText}
                </text>
              </svg>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.theme}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {copy.previewTheme}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.shape}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {copy.previewShape}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.text}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {copy.previewText}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.level}
                </p>
                <p className="mt-2 font-semibold text-slate-900">3</p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 text-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {copy.summary.category}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  {copy.previewCategory}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>{copy.metadataTitle}</span>
              <span className="rounded-full border border-slate-900/10 px-3 py-1 text-[10px]">
                {copy.metadataPill}
              </span>
            </div>
            <pre className="mt-5 max-h-56 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-amber-100/90">
              {metadataJson}
            </pre>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-xs text-slate-600">
              {copy.metadataNote}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-900/10 bg-white/80 p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {copy.afterSaveTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {copy.afterSaveSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900">
              {copy.afterSaveNote}
            </div>
            <Link
              className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900"
              href="/my-badges"
            >
              {copy.afterSaveCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
