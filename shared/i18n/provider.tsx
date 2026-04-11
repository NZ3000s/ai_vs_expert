"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from "./constants";
import { messages } from "./messages";

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((o: unknown, k) => {
    if (o && typeof o === "object" && k in (o as object)) {
      return (o as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
}

function interpolate(
  s: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return s;
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export type I18nContextValue = {
  locale: Locale | null;
  ready: boolean;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  tArray: (path: string) => string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(raw)) setLocaleState(raw);
    } catch {
      /* private mode */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!locale) return;
    document.documentElement.lang = locale === "ua" ? "uk" : "en";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      if (!locale) return path;
      const v = getByPath(messages[locale], path);
      if (typeof v !== "string") return path;
      return interpolate(v, vars);
    },
    [locale]
  );

  const tArray = useCallback(
    (path: string): string[] => {
      if (!locale) return [];
      const v = getByPath(messages[locale], path);
      if (!Array.isArray(v)) return [];
      return v.map((x) => String(x));
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, ready, setLocale, t, tArray }),
    [locale, ready, setLocale, t, tArray]
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
