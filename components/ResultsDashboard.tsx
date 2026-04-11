"use client";

import { useMemo } from "react";
import { EXPERIMENT_ROUNDS } from "@/data/experiments";
import { computeResultsSummary } from "@/lib/computeResults";
import { formatSessionDurationMs } from "@/lib/formatDuration";
import type { Prediction, RoundRecord } from "@/lib/types";
import { useI18n } from "@shared/i18n/provider";

function userChosenDirection(r: RoundRecord): Prediction {
  return r.followed_source === "Expert" ? r.expert_prediction : r.ai_prediction;
}

function pctLabel(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n % 1 === 0 ? n : n.toFixed(1)}%`;
}

function Bar({
  label,
  pct,
  accent,
}: {
  label: string;
  pct: number;
  accent: string;
}) {
  const w = Math.min(100, Math.max(0, pct));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-slate-300">
          {pctLabel(pct)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800/90">
        <div
          className={`h-full rounded-full transition-all ${accent}`}
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsDashboard({
  records,
  sessionDurationMs,
}: {
  records: RoundRecord[];
  /** Elapsed time for this run; `null` if unavailable (e.g. restored view). */
  sessionDurationMs: number | null;
}) {
  const { t } = useI18n();
  const summary = useMemo(() => computeResultsSummary(records), [records]);

  const interpretationText = t(
    `main.results.interpretation.${summary.interpretationKind}`
  );

  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
          {t("main.results.thankYou")}
        </h1>
        <p className="mt-2 text-xs text-slate-400 sm:mt-3 sm:text-sm">
          {t("main.results.recorded")}
        </p>
        {sessionDurationMs != null && (
          <p className="mt-2 text-xs font-medium tabular-nums text-slate-400 sm:mt-3 sm:text-sm">
            {t("main.results.sessionDuration")}:{" "}
            <span className="text-slate-300">
              {formatSessionDurationMs(sessionDurationMs)}
            </span>
          </p>
        )}
      </div>

      <div className="mb-8 grid gap-4 sm:mb-10 sm:gap-6 md:grid-cols-3">
        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-4 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            {t("main.results.yourResult")}
          </h2>
          <p className="mt-3 text-3xl font-bold tabular-nums text-white sm:mt-4 sm:text-4xl">
            {summary.user.score}
            <span className="text-base font-semibold text-slate-500 sm:text-lg">
              {" "}
              / {summary.user.totalRounds}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            {t("main.results.yourResultHelp")}
          </p>
          <p className="mt-3 text-xl font-semibold text-emerald-400/95 sm:mt-4 sm:text-2xl">
            {pctLabel(summary.user.accuracyPct)}
          </p>
          <p className="text-[10px] text-slate-500 sm:text-xs">
            {t("main.results.accuracy")}
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-4 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            {t("main.results.trustDistribution")}
          </h2>
          <p className="mt-3 text-xs text-slate-400 sm:mt-4 sm:text-sm">
            {t("main.results.trustHelp")}
          </p>
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            <Bar
              label={t("main.results.followExpert")}
              pct={summary.trust.pctExpert}
              accent="bg-gradient-to-r from-emerald-600 to-cyan-600"
            />
            <Bar
              label={t("main.results.followAI")}
              pct={summary.trust.pctAi}
              accent="bg-gradient-to-r from-blue-600 to-violet-600"
            />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-4 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            {t("main.results.sourcePerformance")}
          </h2>
          <p className="mt-3 text-xs text-slate-400 sm:mt-4 sm:text-sm">
            {t("main.results.sourceHelp")}
          </p>
          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            <Bar
              label={t("main.results.expert")}
              pct={summary.sources.expertAccuracyPct}
              accent="bg-slate-200/90"
            />
            <Bar
              label={t("main.results.aiModel")}
              pct={summary.sources.aiAccuracyPct}
              accent="bg-slate-400/80"
            />
          </div>
        </section>
      </div>

      <div className="mb-8 sm:mb-10">
        <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 sm:text-[11px]">
          {t("main.results.roundFeedback")}
        </h2>
        <p className="mt-2 text-center text-[11px] text-slate-500 sm:text-xs">
          {t("main.results.roundFeedbackHelp")}
        </p>
        <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          {records.map((r, idx) => {
            const def = EXPERIMENT_ROUNDS.find((x) => x.id === r.round_number);
            const label = def?.scenarioLabel ?? r.asset;
            const pick = userChosenDirection(r);
            const correct = pick === r.outcome;
            const roundTitle = t("main.results.roundLine", {
              n: idx + 1,
              asset: def?.displayAsset ?? r.asset,
            });
            return (
              <li
                key={`${r.round_number}-${idx}`}
                className={`flex flex-col gap-2 rounded-xl border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 ${
                  correct
                    ? "border-emerald-500/35 bg-emerald-950/25"
                    : "border-red-500/35 bg-red-950/20"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">
                    {roundTitle}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-200">{label}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm sm:justify-end sm:gap-3">
                  <span className="text-slate-400">
                    {t("main.results.outcome")}{" "}
                    <span className="font-semibold text-slate-200">
                      {r.outcome}
                    </span>
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">
                    {t("main.results.youChose")}{" "}
                    <span className="font-semibold text-slate-200">{pick}</span>
                  </span>
                  <span
                    className={`inline-flex min-w-[5.5rem] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold ${
                      correct
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                    aria-label={
                      correct
                        ? t("main.results.correct")
                        : t("main.results.incorrect")
                    }
                  >
                    {correct
                      ? t("main.results.correct")
                      : t("main.results.incorrect")}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/40 p-4 text-center backdrop-blur-xl sm:mt-8 sm:rounded-2xl sm:p-6">
        <p className="text-xs leading-relaxed text-slate-200 sm:text-sm">
          {interpretationText}
        </p>
      </div>
    </div>
  );
}
