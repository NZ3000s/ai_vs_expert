"use client";

import { TOTAL_ROUNDS } from "@/data/experiments";
import type { ControlResponseRow } from "@/lib/types";

export function ControlResults({
  records,
  sessionDurationMs,
}: {
  records: ControlResponseRow[];
  sessionDurationMs: number | null;
}) {
  const correct = records.filter(
    (r) => r.user_choice === r.correct_answer
  ).length;
  const pct =
    TOTAL_ROUNDS > 0 ? Math.round((correct / TOTAL_ROUNDS) * 1000) / 10 : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Thank you
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Your responses have been recorded.
        </p>
        {sessionDurationMs != null && (
          <p className="mt-3 text-sm tabular-nums text-slate-500">
            Session time:{" "}
            <span className="text-slate-300">
              {Math.round(sessionDurationMs / 1000)}s
            </span>
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center shadow-xl backdrop-blur-xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Your score
        </h2>
        <p className="mt-4 text-4xl font-bold tabular-nums text-white">
          {correct}
          <span className="text-lg font-semibold text-slate-500">
            {" "}
            / {TOTAL_ROUNDS}
          </span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Rounds where your choice matched the realized market direction (UP /
          DOWN).
        </p>
        <p className="mt-6 text-3xl font-semibold text-emerald-400/95">
          {pct}%
        </p>
        <p className="text-xs text-slate-500">Accuracy</p>
      </div>
    </div>
  );
}
