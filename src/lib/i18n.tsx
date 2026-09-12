import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { de, type UiStrings } from "@/content/i18n/de";
import { en } from "@/content/i18n/en";
import { LANGUAGES, type Language } from "@/content/languages";
import { profile } from "@/content/profile";
import type { Localized, LocalizedList } from "@/content/schema";

const STORAGE_KEY = "portfolio-language";
const UI: Record<Language, UiStrings> = { de, en };

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  /* Pick a localized string. */
  t: (value: Localized) => string;
  /* Pick a localized list. */
  list: (value: LocalizedList) => readonly string[];
  ui: UiStrings;
  /* Replace {placeholders} in a UI string. */
  fill: (template: string, values: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLanguage(value: unknown): value is Language {
  return typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);
}

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    /* storage blocked, fall through */
  }
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(initialLanguage);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = profile.meta.title[lang];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", profile.meta.description[lang]);
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", profile.meta.title[lang]);
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (v) => v[lang],
      list: (v) => v[lang],
      ui: UI[lang],
      fill: (template, values) =>
        template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
