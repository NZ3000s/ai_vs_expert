"use client";

import { formatAssetPrice } from "@/lib/format";
import { useI18n } from "@shared/i18n/provider";

export function TradingHeader({
  asset,
  price,
  loading,
  error,
}: {
  asset: string;
  price: number | null;
  loading: boolean;
  error: boolean;
}) {
  const { t } = useI18n();
  const formatted =
    price !== null ? formatAssetPrice(asset, price) : null;

  return (
    <header className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2 shadow-lg backdrop-blur-xl lg:rounded-2xl lg:px-4 lg:py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 lg:gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2 lg:gap-3">
          <span className="truncate text-sm font-bold tracking-tight text-white lg:text-lg">
            {asset}
          </span>
          <span
            className="inline-flex shrink-0 items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.2)] lg:px-3 lg:py-1 lg:text-base"
            aria-live="polite"
          >
            {loading || error || formatted === null ? "—" : formatted}
          </span>
        </div>
        <span className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-300 lg:px-2.5 lg:py-1 lg:text-xs">
          {t("main.experiment.chartInterval")}
        </span>
      </div>
    </header>
  );
}
