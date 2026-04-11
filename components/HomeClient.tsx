"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlreadyCompletedScreen } from "@/components/AlreadyCompletedScreen";
import {
  ExperimentScreen,
  type DecisionPayload,
} from "@/components/ExperimentScreen";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ExpertModelIntroScreen } from "@/components/ExpertModelIntroScreen";
import { LandingScreen } from "@/components/LandingScreen";
import { EXPERIMENT_ROUNDS, TOTAL_ROUNDS } from "@/data/experiments";
import {
  readCompleted,
  readProgress,
  SESSION_TIMER_START_KEY,
  setExperimentCompleted,
  writeProgress,
  type PersistedProgress,
} from "@/lib/experimentStorage";
import { fisherYatesShuffle } from "@/lib/shuffle";
import {
  resetWebhookSendStateForNewSession,
  submitExperimentWebhook,
} from "@/lib/experimentWebhook";
import { assignNewParticipantId, getParticipantId } from "@/lib/participantId";
import { useI18n } from "@shared/i18n/provider";
import type { RoundRecord } from "@/lib/types";

type Step = "landing" | "sourcesIntro" | "experiment" | "final";

type FlowState = {
  step: Step;
  currentRound: number;
  records: RoundRecord[];
};

const DEFAULT_SCENARIO_ORDER: number[] = EXPERIMENT_ROUNDS.map((r) => r.id);

function resolveScenarioOrder(p: PersistedProgress): number[] {
  if (p.scenarioOrder?.length === TOTAL_ROUNDS) {
    return p.scenarioOrder;
  }
  return [...DEFAULT_SCENARIO_ORDER];
}

/** In experiment: index of active round; records completed so far always equals currentRound. */
function isValidResume(p: PersistedProgress): boolean {
  if (p.currentRoundIndex < 0 || p.currentRoundIndex >= TOTAL_ROUNDS) {
    return false;
  }
  if (p.records.length > TOTAL_ROUNDS) return false;
  if (p.records.length !== p.currentRoundIndex) return false;
  if (
    p.scenarioOrder !== undefined &&
    p.scenarioOrder.length !== TOTAL_ROUNDS
  ) {
    return false;
  }
  return true;
}

export default function HomeClient() {
  const { t } = useI18n();
  /** Dedupes React effect re-runs for the same completed session payload. */
  const webhookPayloadKeyRef = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [scenarioOrder, setScenarioOrder] = useState<number[] | null>(null);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);
  const [sessionEndMs, setSessionEndMs] = useState<number | null>(null);
  const [flow, setFlow] = useState<FlowState>({
    step: "landing",
    currentRound: 0,
    records: [],
  });

  useEffect(() => {
    try {
      if (readCompleted()) {
        setBlocked(true);
        return;
      }

      const p = readProgress();
      if (p?.records.length === TOTAL_ROUNDS) {
        setFlow({
          step: "final",
          currentRound: 0,
          records: p.records,
        });
        return;
      }

      if (p && isValidResume(p)) {
        setScenarioOrder(resolveScenarioOrder(p));
        setFlow({
          step: "experiment",
          currentRound: p.currentRoundIndex,
          records: p.records,
        });
        try {
          const raw = sessionStorage.getItem(SESSION_TIMER_START_KEY);
          if (raw) {
            const n = parseInt(raw, 10);
            if (Number.isFinite(n)) setSessionStartMs(n);
          }
        } catch {
          /* ignore */
        }
      }
    } catch (e) {
      console.error("[experiment] hydrate storage failed", e);
    } finally {
      setHydrated(true);
    }
  }, []);

  /** Prime participant_id in localStorage as soon as the app is interactive. */
  useEffect(() => {
    if (!hydrated || blocked) return;
    getParticipantId();
  }, [hydrated, blocked]);

  useEffect(() => {
    if (flow.step !== "final" || flow.records.length !== TOTAL_ROUNDS) return;
    setSessionEndMs((prev) => (prev == null ? Date.now() : prev));
  }, [flow.step, flow.records.length]);

  useEffect(() => {
    if (!hydrated || blocked) return;
    if (flow.step === "final" && flow.records.length === TOTAL_ROUNDS) {
      setExperimentCompleted();
      return;
    }
    if (flow.step === "experiment" && scenarioOrder) {
      writeProgress({
        currentRoundIndex: flow.currentRound,
        records: flow.records,
        scenarioOrder,
      });
    }
  }, [hydrated, blocked, flow.step, flow.currentRound, flow.records, scenarioOrder]);

  useEffect(() => {
    if (!hydrated || blocked) return;
    if (flow.step !== "final" || flow.records.length !== TOTAL_ROUNDS) return;
    const key = flow.records
      .map(
        (r) =>
          `${r.round_number}:${r.answered_at}:${r.followed_source}:${r.response_time_ms}`
      )
      .join("|");
    if (webhookPayloadKeyRef.current === key) return;
    webhookPayloadKeyRef.current = key;
    submitExperimentWebhook(flow.records);
  }, [hydrated, blocked, flow.step, flow.records]);

  const goToSourcesIntro = useCallback(() => {
    if (blocked || readCompleted()) return;
    setFlow({
      step: "sourcesIntro",
      currentRound: 0,
      records: [],
    });
  }, [blocked]);

  const beginRounds = useCallback(() => {
    if (blocked || readCompleted()) return;
    resetWebhookSendStateForNewSession();
    assignNewParticipantId();
    webhookPayloadKeyRef.current = null;
    const t = Date.now();
    setSessionStartMs(t);
    setSessionEndMs(null);
    try {
      sessionStorage.setItem(SESSION_TIMER_START_KEY, String(t));
    } catch {
      /* ignore */
    }
    const order = fisherYatesShuffle(DEFAULT_SCENARIO_ORDER);
    setScenarioOrder(order);
    const next: FlowState = {
      step: "experiment",
      currentRound: 0,
      records: [],
    };
    setFlow(next);
    writeProgress({
      currentRoundIndex: next.currentRound,
      records: next.records,
      scenarioOrder: order,
    });
  }, [blocked]);

  const handleDecision = useCallback(
    (payload: DecisionPayload) => {
      setFlow((s) => {
        if (s.step !== "experiment") return s;
        if (!scenarioOrder || s.currentRound >= scenarioOrder.length) return s;
        const sid = scenarioOrder[s.currentRound];
        const scenario = EXPERIMENT_ROUNDS.find((r) => r.id === sid);
        if (!scenario) {
          return { ...s, step: "final" };
        }
        const record: RoundRecord = {
          participant_id: getParticipantId(),
          round_number: scenario.id,
          asset: scenario.asset,
          expert_prediction: payload.expert_prediction,
          ai_prediction: payload.ai_prediction,
          outcome: scenario.outcome,
          followed_source: payload.source,
          response_time_ms: payload.responseTimeMs,
          answered_at: new Date().toISOString(),
          tweet_id: null,
          tweet_url: null,
          expert_handle: payload.expert_handle,
        };
        const records = [...s.records, record];
        if (s.currentRound >= TOTAL_ROUNDS - 1) {
          queueMicrotask(() => setExperimentCompleted());
          return { ...s, records, step: "final", currentRound: 0 };
        }
        return { ...s, records, currentRound: s.currentRound + 1 };
      });
    },
    [scenarioOrder]
  );

  useEffect(() => {
    setFlow((s) => {
      if (
        s.step === "experiment" &&
        (s.currentRound < 0 || s.currentRound >= TOTAL_ROUNDS)
      ) {
        return { ...s, step: "final" };
      }
      return s;
    });
  }, [flow.step, flow.currentRound]);

  const { step, currentRound } = flow;
  const round =
    step === "experiment" &&
    scenarioOrder !== null &&
    currentRound >= 0 &&
    currentRound < scenarioOrder.length
      ? EXPERIMENT_ROUNDS.find((r) => r.id === scenarioOrder[currentRound])
      : undefined;

  if (!hydrated) {
    return (
      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center pb-14 pt-8 sm:pt-12">
        <p className="text-sm text-slate-500" role="status">
          {t("loading")}
        </p>
      </main>
    );
  }

  if (blocked) {
    return (
      <main className="relative z-10 mx-auto min-h-screen max-w-7xl">
        <AlreadyCompletedScreen />
      </main>
    );
  }

  return (
    <main
      className={
        step === "landing"
          ? "relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8"
          : step === "sourcesIntro"
            ? "relative z-10 mx-auto flex min-h-dvh max-h-dvh w-full max-w-7xl flex-col items-center justify-start overflow-x-hidden overflow-y-auto overscroll-y-contain px-2 pb-2 pt-1 sm:justify-center sm:overflow-visible sm:px-8 sm:py-8"
          : step === "experiment"
            ? "relative z-10 mx-auto max-h-dvh min-h-0 max-w-7xl overflow-hidden px-0 pt-1 pb-2 lg:min-h-screen lg:max-h-none lg:overflow-visible lg:px-0 lg:pb-14 lg:pt-12"
            : "relative z-10 mx-auto min-h-screen max-w-7xl pb-14 pt-8 sm:pt-12"
      }
    >
      {step === "landing" && (
        <LandingScreen onContinue={goToSourcesIntro} />
      )}

      {step === "sourcesIntro" && (
        <ExpertModelIntroScreen onBegin={beginRounds} />
      )}

      {step === "experiment" && round !== undefined && (
        <ExperimentScreen
          key={`${round.id}-${currentRound}`}
          round={round}
          sessionRoundNumber={currentRound + 1}
          onChoose={handleDecision}
        />
      )}

      {step === "final" && (
        <ResultsDashboard
          records={flow.records}
          sessionDurationMs={
            sessionStartMs != null && sessionEndMs != null
              ? sessionEndMs - sessionStartMs
              : null
          }
        />
      )}
    </main>
  );
}
