"use client";

import { useEffect, useRef, useState } from "react";
import RealChart from "@/components/RealChart";
import { TradingHeader } from "@/components/TradingHeader";
import { UpDownButtons } from "@/components/UpDownButtons";
import { TOTAL_ROUNDS, type ExperimentRound } from "@/data/experiments";
import { useLocalChartData } from "@/hooks/useLocalChartData";
import type { Prediction } from "@/lib/types";
import { useI18n } from "../../shared/i18n/provider";

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
  const { t } = useI18n();
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
    <div className="mx-auto flex max-h-dvh min-h-dvh max-w-[90rem] flex-col overflow-hidden px-2 py-2 lg:min-h-0 lg:max-h-none lg:overflow-visible lg:px-4 lg:py-6">
      <div className="shrink-0 text-center lg:mb-6 lg:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 lg:text-[11px]">
          {t("control.round.roundOf", {
            current: sessionRoundNumber,
            total: TOTAL_ROUNDS,
          })}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-500 lg:mt-2 lg:hidden">
          {t("control.round.mobileHint")}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(340px,460px)] lg:items-start lg:gap-10 lg:overflow-visible xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,480px)]">
        <div className="flex min-h-0 shrink-0 flex-col space-y-1.5 lg:min-w-0 lg:space-y-3">
          <TradingHeader
            asset={round.displayAsset}
            price={chart.lastClose}
            loading={false}
            error={false}
          />
          <div className="rounded-xl border border-white/10 bg-[#070a0d]/80 p-1 shadow-xl backdrop-blur-sm lg:rounded-2xl lg:p-2">
            {chartReady && <RealChart data={chart.data} />}
          </div>
          <p className="line-clamp-2 text-[10px] leading-relaxed text-slate-500 lg:line-clamp-none lg:text-[11px]">
            <span className="font-medium text-slate-600">
              {t("control.round.historicalScenario")}
            </span>
            {round.scenarioLabel ? (
              <span className="text-slate-500"> · {round.scenarioLabel}</span>
            ) : null}
          </p>
        </div>

        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden lg:flex-none lg:gap-5 lg:overflow-visible">
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3 shadow-inner backdrop-blur-sm lg:rounded-2xl lg:p-5">
            <p className="text-center text-sm font-semibold leading-snug text-slate-100 lg:text-base">
              {t("control.round.question")}
            </p>
            <div className="mt-3 shrink-0 pt-0.5 lg:mt-6 lg:pt-1">
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
