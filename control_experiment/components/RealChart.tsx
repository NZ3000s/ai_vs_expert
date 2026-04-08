"use client";

import type { CandlestickData, IChartApi, Time } from "lightweight-charts";
import { useEffect, useRef } from "react";

const CHART_HEIGHT = 460;

function sanitizeData(raw: CandlestickData[]): CandlestickData[] {
  const rows = raw
    .filter((d) => {
      const t = d.time;
      const okTime = typeof t === "number" && Number.isFinite(t);
      return (
        okTime &&
        Number.isFinite(d.open) &&
        Number.isFinite(d.high) &&
        Number.isFinite(d.low) &&
        Number.isFinite(d.close)
      );
    })
    .sort((a, b) => (a.time as number) - (b.time as number));
  return rows;
}

function formatTickTime(time: Time): string | null {
  if (typeof time !== "number") return null;
  const d = new Date(time * 1000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export function RealChart({ data }: { data: CandlestickData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = containerRef.current;
    if (!el || data.length === 0) return;

    let disposed = false;
    let chart: IChartApi | null = null;
    let ro: ResizeObserver | null = null;
    let raf = 0;

    let layoutAttempts = 0;
    const maxLayoutAttempts = 50;

    const run = () => {
      const clean = sanitizeData(data);
      if (clean.length === 0) return;

      const measured = el.clientWidth || el.getBoundingClientRect().width;
      const width = Math.max(measured, 280);
      if (measured < 10 && layoutAttempts++ < maxLayoutAttempts) {
        raf = requestAnimationFrame(() => {
          if (!disposed) run();
        });
        return;
      }

      import("lightweight-charts")
        .then((LWC) => {
          if (disposed || !containerRef.current) return;

          const createChart = LWC.createChart;
          const ColorType = LWC.ColorType;
          const CandlestickSeries =
            LWC.CandlestickSeries ??
            (LWC as { candlestickSeries?: typeof LWC.CandlestickSeries })
              .candlestickSeries;

          if (typeof createChart !== "function" || !CandlestickSeries) {
            console.error("[RealChart] lightweight-charts exports:", Object.keys(LWC));
            return;
          }

          chart = createChart(el, {
            layout: {
              background: { type: ColorType.Solid, color: "#0b0e11" },
              textColor: "#94a3b8",
              fontSize: 11,
              fontFamily:
                "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
            },
            localization: {
              locale: "en-US",
              dateFormat: "dd MMM 'yy",
            },
            grid: {
              vertLines: { color: "#1e293b" },
              horzLines: { color: "#1e293b" },
            },
            crosshair: {
              vertLine: { color: "#475569", width: 1 },
              horzLine: { color: "#475569", width: 1 },
            },
            rightPriceScale: {
              borderColor: "#334155",
              scaleMargins: { top: 0.08, bottom: 0.08 },
            },
            timeScale: {
              borderColor: "#334155",
              timeVisible: true,
              secondsVisible: false,
              barSpacing: 5,
              minBarSpacing: 2,
              rightOffset: 10,
              tickMarkFormatter: (time: Time) => formatTickTime(time),
            },
            autoSize: false,
            width,
            height: CHART_HEIGHT,
          });

          const series = chart.addSeries(CandlestickSeries, {
            upColor: "#22c55e",
            downColor: "#ef4444",
            borderVisible: false,
            wickUpColor: "#16a34a",
            wickDownColor: "#dc2626",
          });
          series.setData(clean);
          chart.timeScale().fitContent();

          ro = new ResizeObserver(() => {
            if (!containerRef.current || !chart) return;
            const w = Math.max(
              containerRef.current.clientWidth,
              280
            );
            chart.applyOptions({ width: w });
          });
          ro.observe(el);
        })
        .catch((err) => {
          console.error("[RealChart] chart init failed", err);
        });
    };

    raf = requestAnimationFrame(() => {
      if (!disposed) run();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      chart?.remove();
    };
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full min-h-[460px] min-w-[280px] overflow-hidden rounded-xl border border-white/10"
      />
    </div>
  );
}

export default RealChart;
