"use client";

import { useMemo } from "react";
import { candlesToCandlestickSeries } from "@/lib/chartSeries";
import type { ExperimentRound } from "@/data/experiments";

export function useLocalChartData(round: ExperimentRound) {
  return useMemo(() => {
    const data = candlesToCandlestickSeries(round.chartData);
    const lastClose = data[data.length - 1]?.close ?? 0;
    return { data, lastClose };
  }, [round]);
}
