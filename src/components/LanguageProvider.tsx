"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLanguage, type Language } from "@src/app/i18n";
import { LANGUAGE_STORAGE_KEY } from "@src/lib/preferences";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = defaultLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      toggleLanguage: () =>
        setLanguageState((current) => (current === "en" ? "zh" : "en")),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
