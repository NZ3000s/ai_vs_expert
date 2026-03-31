import type { Candle } from "@/lib/types";
import type { CandlestickData, UTCTimestamp } from "lightweight-charts";

/** Convert preloaded daily candles to lightweight-charts series data. */
export function candlesToCandlestickSeries(candles: Candle[]): CandlestickData[] {
  return candles.map((c) => ({
    time: c.time as UTCTimestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));
}
