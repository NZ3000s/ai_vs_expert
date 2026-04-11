export type Locale = "en" | "ua";

export const LOCALE_STORAGE_KEY = "be_experiment_locale";

export function isLocale(x: string | null): x is Locale {
  return x === "en" || x === "ua";
}
