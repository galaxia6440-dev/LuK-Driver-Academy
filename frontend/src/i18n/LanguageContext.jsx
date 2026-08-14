import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("luk_lang") : null;
    return saved === "en" || saved === "fr" ? saved : "fr";
  });

  useEffect(() => {
    window.localStorage.setItem("luk_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = translations[lang];
    const t = (key) => dict[key] || key;
    const toggleLang = () => setLang((l) => (l === "fr" ? "en" : "fr"));
    const pick = (fr, en) => (lang === "fr" ? fr : en) || fr || en;
    return { lang, setLang, toggleLang, t, pick };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
