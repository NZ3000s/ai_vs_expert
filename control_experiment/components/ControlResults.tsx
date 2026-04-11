"use client";

import { TOTAL_ROUNDS } from "@/data/experiments";
import type { ControlResponseRow } from "@/lib/types";
import { useI18n } from "../../shared/i18n/provider";

export function ControlResults({
  records,
  sessionDurationMs,
}: {
  records: ControlResponseRow[];
  sessionDurationMs: number | null;
}) {
  const { t } = useI18n();
  const correct = records.filter(
    (r) => r.user_choice === r.correct_answer
  ).length;
  const pct =
    TOTAL_ROUNDS > 0 ? Math.round((correct / TOTAL_ROUNDS) * 1000) / 10 : 0;

  return (
    <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
          {t("control.results.thankYou")}
        </h1>
        <p className="mt-2 text-xs text-slate-400 sm:mt-3 sm:text-sm">
          {t("control.results.recorded")}
        </p>
        {sessionDurationMs != null && (
          <p className="mt-2 text-xs tabular-nums text-slate-500 sm:mt-3 sm:text-sm">
            {t("control.results.sessionTime")}:{" "}
            <span className="text-slate-300">
              {Math.round(sessionDurationMs / 1000)}s
            </span>
          </p>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 text-center shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-8">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">
          {t("control.results.yourScore")}
        </h2>
        <p className="mt-3 text-3xl font-bold tabular-nums text-white sm:mt-4 sm:text-4xl">
          {correct}
          <span className="text-base font-semibold text-slate-500 sm:text-lg">
            {" "}
            / {TOTAL_ROUNDS}
          </span>
        </p>
        <p className="mt-2 text-xs leading-snug text-slate-400 sm:text-sm">
          {t("control.results.scoreHelp")}
        </p>
        <p className="mt-4 text-2xl font-semibold text-emerald-400/95 sm:mt-6 sm:text-3xl">
          {pct}%
        </p>
        <p className="text-[10px] text-slate-500 sm:text-xs">
          {t("control.results.accuracy")}
        </p>
      </div>
    </div>
  );
}
