"use client";

import { useI18n } from "@shared/i18n/provider";

/**
 * Shown when `experiment_completed` is set — one submission per browser.
 */
export function AlreadyCompletedScreen() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
        {t("main.blocked.kicker")}
      </p>
      <h1 className="mt-4 max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {t("main.blocked.title")}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
        {t("main.blocked.body")}
      </p>
      <p className="mt-6 max-w-sm text-sm text-slate-500">
        {t("main.blocked.note")}
      </p>
    </div>
  );
}
