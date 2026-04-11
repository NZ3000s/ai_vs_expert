"use client";

import { useEffect, useMemo, useRef } from "react";
import { AICard } from "@/components/AICard";
import { DecisionButtons } from "@/components/DecisionButtons";
import { ExpertCard } from "@/components/ExpertCard";
import { TradingHeader } from "@/components/TradingHeader";
import { TOTAL_ROUNDS, type ExperimentRound } from "@/data/experiments";
import { useLocalChartData } from "@/hooks/useLocalChartData";
import { RealChart } from "@/components/RealChart";
import type { AIView, FollowSource, Prediction } from "@/lib/types";
import { useI18n } from "@shared/i18n/provider";

export type DecisionPayload = {
  source: FollowSource;
  responseTimeMs: number;
  expert_prediction: Prediction;
  ai_prediction: Prediction;
  expert_handle: string;
};

export function ExperimentScreen({
  round,
  sessionRoundNumber,
  onChoose,
}: {
  round: ExperimentRound;
  /** 1-based index within the current session (order may be shuffled). */
  sessionRoundNumber: number;
  onChoose: (payload: DecisionPayload) => void;
}) {
  const { t } = useI18n();
  const chart = useLocalChartData(round);

  const aiView: AIView = useMemo(
    () => ({
      prediction: round.ai.prediction,
      explanation: round.ai.text,
    }),
    [round.ai.prediction, round.ai.text]
  );

  const chartReady = chart.data.length > 0;

  const decisionStartRef = useRef<number | null>(null);
  useEffect(() => {
    if (chartReady) {
      decisionStartRef.current = Date.now();
    }
  }, [chartReady, round.id]);

  const handleFollow = (source: FollowSource) => {
    const start = decisionStartRef.current ?? Date.now();
    onChoose({
      source,
      responseTimeMs: Math.max(0, Date.now() - start),
      expert_prediction: round.expert.prediction,
      ai_prediction: round.ai.prediction,
      expert_handle: round.expert.handle,
    });
  };

  return (
    <div className="mx-auto flex max-h-dvh min-h-dvh max-w-[90rem] flex-col overflow-hidden px-2 py-2 lg:min-h-0 lg:max-h-none lg:overflow-visible lg:px-4 lg:py-6">
      <div className="shrink-0 text-center lg:mb-6 lg:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 lg:text-[11px]">
          {t("main.experiment.roundOf", {
            current: sessionRoundNumber,
            total: TOTAL_ROUNDS,
          })}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-500 lg:mt-2 lg:hidden">
          {t("main.experiment.mobileHint")}
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
              {t("main.experiment.historicalScenario")}
            </span>
            {round.scenarioLabel ? (
              <span className="text-slate-500"> · {round.scenarioLabel}</span>
            ) : null}
          </p>
        </div>

        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden lg:flex-none lg:gap-5 lg:overflow-visible">
          <div className="hidden border-b border-white/[0.08] pb-4 lg:block">
            <h1 className="text-lg font-bold tracking-tight text-white">
              {t("main.experiment.desktopTitle")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {t("main.experiment.desktopP1")}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {t("main.experiment.desktopP2")}
            </p>
          </div>

          <ExpertCard expert={round.expert} />

          <AICard view={aiView} />

          <p className="shrink-0 text-center text-sm font-semibold leading-snug text-slate-100 lg:text-base">
            {t("main.experiment.whichSignal")}
          </p>

          <div className="shrink-0 pb-1 pt-0.5 lg:pt-1">
            <DecisionButtons onChoose={handleFollow} disabled={!chartReady} />
          </div>
        </div>
      </div>
    </div>
  );
}
