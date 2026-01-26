"use client";

import { languages, type Language } from "../app/i18n";
import { useLanguage } from "./LanguageProvider";

const labels: Record<Language, string> = {
  en: "EN",
  zh: "中文",
};

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="hidden items-center gap-1 rounded-full border border-slate-900/10 bg-white/80 p-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur md:flex dark:border-cyan-400/20 dark:bg-black/60 dark:text-slate-400">
      {languages.map((lang) => {
        const active = lang === language;
        return (
          <button
            className={`rounded-full px-2.5 py-1 transition cursor-pointer ${
              active
                ? "bg-slate-900 text-amber-100 dark:bg-cyan-400/80 dark:text-slate-900 dark:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
            key={lang}
            onClick={() => setLanguage(lang)}
            type="button"
          >
            {labels[lang]}
          </button>
        );
      })}
    </div>
  );
}
