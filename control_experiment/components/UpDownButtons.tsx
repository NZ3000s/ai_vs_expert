"use client";

import type { Prediction } from "@/lib/types";
import { useI18n } from "../../shared/i18n/provider";

export function UpDownButtons({
  onChoose,
  disabled = false,
}: {
  onChoose: (p: Prediction) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const base =
    "min-h-[2.65rem] w-full rounded-lg px-3 py-2 text-sm font-bold transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none lg:min-h-[3.25rem] lg:rounded-xl lg:px-4 lg:py-3.5 lg:text-base";
  const up = `${base} bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[var(--glow-green)]`;
  const down = `${base} bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[var(--glow-blue)]`;

  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 lg:gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("UP")}
        className={up}
      >
        {t("control.buttons.up")}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose("DOWN")}
        className={down}
      >
        {t("control.buttons.down")}
      </button>
    </div>
  );
}
