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
    <div className="mx-auto max-w-[90rem] px-4 py-6">
      <div className="mb-6 text-center lg:text-left">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Round {sessionRoundNumber} of {TOTAL_ROUNDS}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 lg:hidden">
          Read both views, then choose which signal you would follow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(340px,460px)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,480px)]">
        {/* Left: chart + secondary scenario line */}
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

        {/* Right: light instructions → balanced cards → decision */}
        <div className="flex w-full min-w-0 flex-col gap-5">
          <div className="border-b border-white/[0.08] pb-4">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Decision Experiment
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Read two conflicting market views based on the same historical
              chart.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Choose which signal you would follow.
            </p>
          </div>

          <ExpertCard expert={round.expert} />

          <AICard view={aiView} />

          <p className="text-center text-base font-semibold leading-snug text-slate-100">
            Which signal would you follow for this scenario?
          </p>

          <div className="pt-1">
            <DecisionButtons onChoose={handleFollow} disabled={!chartReady} />
          </div>
        </div>
      </div>
    </div>
  );
}
