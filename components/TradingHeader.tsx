"use client";

import { formatAssetPrice } from "@/lib/format";

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
  const formatted =
    price !== null ? formatAssetPrice(asset, price) : null;

  return (
    <header className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3.5 shadow-lg backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-white">
            {asset}
          </span>
          <span
            className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-base font-semibold tabular-nums text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            aria-live="polite"
          >
            {loading || error || formatted === null ? "—" : formatted}
          </span>
        </div>
        <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs font-medium text-slate-300">
          1D
        </span>
      </div>
    </header>
  );
}
