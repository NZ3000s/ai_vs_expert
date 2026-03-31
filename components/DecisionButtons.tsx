"use client";

import type { FollowSource } from "@/lib/types";

export function DecisionButtons({
  onChoose,
  disabled = false,
}: {
  onChoose: (source: FollowSource) => void;
  disabled?: boolean;
}) {
  const base =
    "min-h-[3.25rem] w-full rounded-xl px-4 py-3.5 text-base font-bold transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none";
  const expert = `${base} bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[var(--glow-green)]`;
  const ai = `${base} bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[var(--glow-blue)]`;

  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("Expert")}
        className={expert}
      >
        Follow Expert
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("AI")}
        className={ai}
      >
        Follow AI
      </button>
    </div>
  );
}
