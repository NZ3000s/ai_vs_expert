"use client";

import type { FollowSource } from "@/lib/types";
import { useI18n } from "@shared/i18n/provider";

export function DecisionButtons({
  onChoose,
  disabled = false,
}: {
  onChoose: (source: FollowSource) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const base =
    "min-h-[2.65rem] w-full rounded-lg px-3 py-2 text-sm font-bold transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none lg:min-h-[3.25rem] lg:rounded-xl lg:px-4 lg:py-3.5 lg:text-base";
  const expert = `${base} bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[var(--glow-green)]`;
  const ai = `${base} bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[var(--glow-blue)]`;

  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 lg:gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("Expert")}
        className={expert}
      >
        {t("main.buttons.followExpert")}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("AI")}
        className={ai}
      >
        {t("main.buttons.followAI")}
      </button>
    </div>
  );
}
