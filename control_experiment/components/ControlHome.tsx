"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ControlAlreadyCompleted } from "@/components/ControlAlreadyCompleted";
import { ControlIntro } from "@/components/ControlIntro";
import { ControlResults } from "@/components/ControlResults";
import { ControlRoundScreen } from "@/components/ControlRoundScreen";
import { EXPERIMENT_ROUNDS, TOTAL_ROUNDS } from "@/data/experiments";
import { submitControlWebhook } from "@/lib/controlWebhook";
import {
  readControlCompleted,
  readControlProgress,
  writeControlProgress,
} from "@/lib/controlStorage";
import { getParticipantId } from "@/lib/participantId";
import { fisherYatesShuffle } from "@/lib/shuffle";
import type { ControlResponseRow, Prediction } from "@/lib/types";
import { useI18n } from "../../shared/i18n/provider";

type Step = "intro" | "experiment" | "final";

const DEFAULT_ORDER: number[] = EXPERIMENT_ROUNDS.map((r) => r.id);

const START_DEBOUNCE_MS = 600;

export function ControlHome() {
  const { t } = useI18n();
  const [hydrated, setHydrated] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [scenarioOrder, setScenarioOrder] = useState<number[] | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [records, setRecords] = useState<ControlResponseRow[]>([]);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);
  const [sessionEndMs, setSessionEndMs] = useState<number | null>(null);
  const [startCooldown, setStartCooldown] = useState(false);
  const submitOnce = useRef(false);
  const recordsRef = useRef<ControlResponseRow[]>([]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  useEffect(() => {
    if (!hydrated) return;
    if (readControlCompleted()) {
      setBlocked(true);
      return;
    }
    const p = readControlProgress();
    if (p) {
      setScenarioOrder(p.scenarioOrder);
      setRecords(p.records);
      recordsRef.current = p.records;
      setCurrentRound(p.currentRoundIndex);
      setSessionStartMs(p.sessionStartMs);
      setStep(
        p.records.length === TOTAL_ROUNDS && p.currentRoundIndex === TOTAL_ROUNDS
          ? "final"
          : "experiment"
      );
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || blocked) return;
    getParticipantId();
  }, [hydrated, blocked]);

  useEffect(() => {
    if (step !== "final" || records.length !== TOTAL_ROUNDS) return;
    setSessionEndMs((prev) => (prev == null ? Date.now() : prev));
  }, [step, records.length]);

  useEffect(() => {
    if (!hydrated || blocked) return;
    if (step !== "final" || records.length !== TOTAL_ROUNDS) return;
    if (submitOnce.current) return;
    submitOnce.current = true;
    submitControlWebhook(records);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- submit once per completion
  }, [hydrated, blocked, step, records.length]);

  const start = useCallback(() => {
    if (startCooldown) return;
    setStartCooldown(true);
    window.setTimeout(() => setStartCooldown(false), START_DEBOUNCE_MS);

    const order = fisherYatesShuffle(DEFAULT_ORDER);
    const t = Date.now();
    setScenarioOrder(order);
    setRecords([]);
    recordsRef.current = [];
    setCurrentRound(0);
    setSessionStartMs(t);
    setSessionEndMs(null);
    setStep("experiment");
    writeControlProgress({
      scenarioOrder: order,
      currentRoundIndex: 0,
      records: [],
      sessionStartMs: t,
    });
  }, [startCooldown]);

  const handleDecision = useCallback(
    (payload: { user_choice: Prediction; responseTimeMs: number }) => {
      if (!scenarioOrder || currentRound >= scenarioOrder.length) return;
      const sid = scenarioOrder[currentRound];
      const scenario = EXPERIMENT_ROUNDS.find((r) => r.id === sid);
      if (!scenario) return;

      const row: ControlResponseRow = {
        round_number: currentRound + 1,
        scenario_id: scenario.id,
        asset: scenario.asset,
        user_choice: payload.user_choice,
        correct_answer: scenario.outcome,
        response_time_ms: payload.responseTimeMs,
        timestamp: new Date().toISOString(),
      };

      const next = [...recordsRef.current, row];
      recordsRef.current = next;
      setRecords(next);

      if (next.length === TOTAL_ROUNDS) {
        const startMs = sessionStartMs ?? Date.now();
        writeControlProgress({
          scenarioOrder,
          currentRoundIndex: TOTAL_ROUNDS,
          records: next,
          sessionStartMs: startMs,
        });
        setStep("final");
        return;
      }

      const startMs = sessionStartMs ?? Date.now();
      writeControlProgress({
        scenarioOrder,
        currentRoundIndex: next.length,
        records: next,
        sessionStartMs: startMs,
      });
      setCurrentRound(next.length);
    },
    [scenarioOrder, currentRound, sessionStartMs]
  );

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
      <main className="relative z-10 mx-auto min-h-dvh max-w-7xl">
        <ControlAlreadyCompleted />
      </main>
    );
  }

  return (
    <main
      className={
        step === "intro"
          ? "relative z-10 mx-auto flex min-h-dvh max-h-dvh w-full max-w-7xl flex-col items-center justify-start overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-4 sm:items-center sm:justify-center sm:overflow-visible sm:px-8 sm:py-8"
          : step === "experiment"
            ? "relative z-10 mx-auto max-h-dvh min-h-0 max-w-7xl overflow-hidden px-0 pt-1 pb-2 lg:min-h-screen lg:max-h-none lg:overflow-visible lg:pb-14 lg:pt-12"
            : "relative z-10 mx-auto min-h-dvh max-w-7xl px-3 pb-8 pt-4 sm:px-4 sm:pb-14 sm:pt-8 sm:pt-12"
      }
    >
      {step === "intro" && (
        <ControlIntro onStart={start} startDisabled={startCooldown} />
      )}

      {step === "experiment" && round !== undefined && (
        <ControlRoundScreen
          key={`${round.id}-${currentRound}`}
          round={round}
          sessionRoundNumber={currentRound + 1}
          onChoose={({ user_choice, response_time_ms }) =>
            handleDecision({
              user_choice,
              responseTimeMs: response_time_ms,
            })
          }
        />
      )}

      {step === "final" && (
        <ControlResults
          records={records}
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
