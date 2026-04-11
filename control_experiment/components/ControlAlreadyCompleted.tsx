"use client";

import { useI18n } from "../../shared/i18n/provider";

export function ControlAlreadyCompleted() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
        {t("control.blocked.kicker")}
      </p>
      <h1 className="mt-4 max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {t("control.blocked.title")}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
        {t("control.blocked.body")}
      </p>
      <p className="mt-6 max-w-sm text-sm text-slate-500">
        {t("control.blocked.note")}
      </p>
    </div>
  );
}
