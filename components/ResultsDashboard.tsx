"use client";

import { useMemo } from "react";
import { EXPERIMENT_ROUNDS } from "@/data/experiments";
import { computeResultsSummary } from "@/lib/computeResults";
import { formatSessionDurationMs } from "@/lib/formatDuration";
import type { Prediction, RoundRecord } from "@/lib/types";

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
  const summary = useMemo(() => computeResultsSummary(records), [records]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Thank you for your participation
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Your responses have been recorded.
        </p>
        {sessionDurationMs != null && (
          <p className="mt-3 text-sm font-medium tabular-nums text-slate-400">
            Session duration:{" "}
            <span className="text-slate-300">
              {formatSessionDurationMs(sessionDurationMs)}
            </span>
          </p>
        )}
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Your result
          </h2>
          <p className="mt-4 text-4xl font-bold tabular-nums text-white">
            {summary.user.score}
            <span className="text-lg font-semibold text-slate-500">
              {" "}
              / {summary.user.totalRounds}
            </span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Rounds where your followed source matched the realized direction
            (UP/DOWN).
          </p>
          <p className="mt-4 text-2xl font-semibold text-emerald-400/95">
            {pctLabel(summary.user.accuracyPct)}
          </p>
          <p className="text-xs text-slate-500">Accuracy</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Trust distribution
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Share of decisions by source.
          </p>
          <div className="mt-6 space-y-5">
            <Bar
              label="Follow Expert"
              pct={summary.trust.pctExpert}
              accent="bg-gradient-to-r from-emerald-600 to-cyan-600"
            />
            <Bar
              label="Follow AI"
              pct={summary.trust.pctAi}
              accent="bg-gradient-to-r from-blue-600 to-violet-600"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Source performance
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            How often each source matched the prespecified outcome (UP/DOWN) in
            this study set.
          </p>
          <div className="mt-6 space-y-5">
            <Bar
              label="Expert"
              pct={summary.sources.expertAccuracyPct}
              accent="bg-slate-200/90"
            />
            <Bar
              label="AI model"
              pct={summary.sources.aiAccuracyPct}
              accent="bg-slate-400/80"
            />
          </div>
        </section>
      </div>

      <div className="mb-10">
        <h2 className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Round-by-round feedback
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          Your chosen direction vs the realized outcome for each round (not
          shown during the task).
        </p>
        <ul className="mt-6 space-y-3">
          {records.map((r, idx) => {
            const def = EXPERIMENT_ROUNDS.find((x) => x.id === r.round_number);
            const label = def?.scenarioLabel ?? r.asset;
            const pick = userChosenDirection(r);
            const correct = pick === r.outcome;
            return (
              <li
                key={`${r.round_number}-${idx}`}
                className={`flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  correct
                    ? "border-emerald-500/35 bg-emerald-950/25"
                    : "border-red-500/35 bg-red-950/20"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Round {idx + 1} · {def?.displayAsset ?? r.asset}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-200">{label}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm sm:justify-end">
                  <span className="text-slate-400">
                    Outcome{" "}
                    <span className="font-semibold text-slate-200">
                      {r.outcome}
                    </span>
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">
                    You chose{" "}
                    <span className="font-semibold text-slate-200">{pick}</span>
                  </span>
                  <span
                    className={`inline-flex min-w-[5.5rem] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold ${
                      correct
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                    aria-label={correct ? "Correct" : "Incorrect"}
                  >
                    {correct ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center backdrop-blur-xl">
        <p className="text-sm leading-relaxed text-slate-200">
          {summary.interpretation}
        </p>
      </div>
    </div>
  );
}
