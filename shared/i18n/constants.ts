export type Locale = "en" | "ua";

/** Bump when you deploy — shown on the language screen so hosting updates are obvious. */
export const APP_UI_REVISION = "2026-04-12";

export const LOCALE_STORAGE_KEY = "be_experiment_locale";

export function isLocale(x: string | null): x is Locale {
  return x === "en" || x === "ua";
}
