"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, Translations, getTranslation } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [t, setT] = useState<Translations>(getTranslation("en"));

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem("hustly-language") as Language;
    if (saved && (saved === "en" || saved === "id")) {
      setLanguageState(saved);
      setT(getTranslation(saved));
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setT(getTranslation(lang));
    localStorage.setItem("hustly-language", lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "id" : "en";
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
