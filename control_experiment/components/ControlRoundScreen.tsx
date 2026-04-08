"use client";

import { useEffect, useRef, useState } from "react";
import RealChart from "@/components/RealChart";
import { TradingHeader } from "@/components/TradingHeader";
import { UpDownButtons } from "@/components/UpDownButtons";
import { TOTAL_ROUNDS, type ExperimentRound } from "@/data/experiments";
import { useLocalChartData } from "@/hooks/useLocalChartData";
import type { Prediction } from "@/lib/types";

export function ControlRoundScreen({
  round,
  sessionRoundNumber,
  onChoose,
}: {
  round: ExperimentRound;
  sessionRoundNumber: number;
  onChoose: (payload: {
    user_choice: Prediction;
    response_time_ms: number;
  }) => void;
}) {
  const chart = useLocalChartData(round);
  const chartReady = chart.data.length > 0;
  const startMsRef = useRef<number | null>(null);
  const [choiceLocked, setChoiceLocked] = useState(false);

  useEffect(() => {
    startMsRef.current = Date.now();
    setChoiceLocked(false);
  }, [round.id]);

  const handleChoice = (user_choice: Prediction) => {
    if (choiceLocked) return;
    setChoiceLocked(true);
    const start = startMsRef.current ?? Date.now();
    onChoose({
      user_choice,
      response_time_ms: Math.max(0, Date.now() - start),
    });
  };

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-6">
      <div className="mb-6 text-center lg:text-left">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Round {sessionRoundNumber} of {TOTAL_ROUNDS}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 lg:hidden">
          Chart only — no predictions. Choose UP or DOWN.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(340px,460px)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,460px)]">
        <div className="space-y-3 lg:min-w-0">
          <TradingHeader
            asset={round.displayAsset}
            price={chart.lastClose}
            loading={false}
            error={false}
          />
          <div className="rounded-2xl border border-white/10 bg-[#070a0d]/80 p-2 shadow-xl backdrop-blur-sm">
            {chartReady && <RealChart data={chart.data} />}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            <span className="font-medium text-slate-600">
              Historical market scenario
            </span>
            {round.scenarioLabel ? (
              <span className="text-slate-500"> · {round.scenarioLabel}</span>
            ) : null}
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-inner backdrop-blur-sm">
            <p className="text-center text-base font-semibold leading-snug text-slate-100">
              Where do you think the price will go?
            </p>
            <div className="mt-6 pt-1">
              <UpDownButtons
                onChoose={handleChoice}
                disabled={!chartReady || choiceLocked}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
