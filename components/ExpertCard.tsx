"use client";

import type { ExperimentExpert } from "@/data/experiments";
import type { Prediction } from "@/lib/types";

const MAX_TEXT = 500;

/** Shared shell for expert / AI cards — neutral emphasis, symmetric layout */
export const decisionCardClass =
  "rounded-2xl border border-white/10 bg-slate-900/45 p-4 shadow-md backdrop-blur-xl";

/** Shared prediction pill — slightly larger for readability */
export function PredictionBadge({
  prediction,
}: {
  prediction: Prediction;
}) {
  const predClass =
    prediction === "UP"
      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
      : "border-red-500/50 bg-red-500/10 text-red-400";

  return (
    <span
      className={`inline-flex rounded-full border px-3.5 py-1.5 text-[15px] font-semibold leading-none ${predClass}`}
    >
      Prediction: {prediction}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex shrink-0 text-sky-400" title="Verified" aria-hidden>
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

export function ExpertCard({ expert }: { expert: ExperimentExpert }) {
  const text =
    expert.text.length > MAX_TEXT
      ? `${expert.text.slice(0, MAX_TEXT - 1)}…`
      : expert.text;

  const bioOneLine =
    expert.bio.length > 90 ? `${expert.bio.slice(0, 87)}…` : expert.bio;

  return (
    <section
      className={decisionCardClass}
      aria-labelledby="expert-heading"
    >
      <p
        id="expert-heading"
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
      >
        Expert
      </p>
      <div className="mt-3 flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={expert.avatar}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full border border-white/10 bg-slate-800 object-cover ring-2 ring-white/5"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate font-semibold text-white">
            <span className="truncate">{expert.name}</span>
            <VerifiedBadge />
          </p>
          <p className="truncate text-sm text-slate-400">@{expert.handle}</p>
          {bioOneLine ? (
            <p className="mt-1 truncate text-xs text-slate-500">{bioOneLine}</p>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{text}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PredictionBadge prediction={expert.prediction} />
      </div>
    </section>
  );
}
