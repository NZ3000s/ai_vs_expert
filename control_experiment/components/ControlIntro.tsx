"use client";

export function ControlIntro({
  onStart,
  startDisabled = false,
}: {
  onStart: () => void;
  startDisabled?: boolean;
}) {
  return (
    <div className="flex w-full max-w-full flex-shrink-0 justify-center px-0 sm:px-0">
      <div className="w-full max-w-4xl rounded-2xl border border-white/[0.12] bg-slate-900/45 px-7 py-8 shadow-[0_20px_56px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-xl sm:rounded-[1.65rem] sm:px-10 sm:py-8 md:max-w-[52rem] md:px-11 md:py-9 [@media(max-height:820px)]:px-6 [@media(max-height:820px)]:py-7">
        <div className="mb-4 flex justify-center sm:mb-5 [@media(max-height:820px)]:mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG, matches main experiment */}
          <img
            src="/kse-logo.svg"
            alt="Kyiv School of Economics"
            className="h-9 w-auto max-w-[min(248px,82vw)] sm:h-10 [@media(max-height:820px)]:h-8"
          />
        </div>

        <p className="text-center text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500 sm:text-[11px]">
          Behavioral Economics · KSE · Control group
        </p>

        <h1 className="mx-auto mt-2.5 max-w-2xl text-center text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:mt-3 sm:text-[1.85rem] md:text-[2.1rem] md:leading-[1.12]">
          Control group experiment
        </h1>

        <div className="mx-auto mt-5 max-w-[34rem] text-center sm:mt-6 [@media(max-height:820px)]:mt-4">
          <div className="space-y-4 text-[15px] leading-[1.65] text-slate-300 sm:text-base sm:leading-[1.7] md:text-[17px]">
            <p>You are participating in a behavioral experiment.</p>
            <p>You are in the control group.</p>
            <p>
              In this version, you will see only historical market charts without
              any additional predictions.
            </p>
            <p>
              Your task is to decide whether the price will go UP or DOWN.
            </p>
            <p>These scenarios are based on real market situations.</p>
            <p>Please answer as carefully as possible.</p>
          </div>
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-[34rem] flex-col items-center sm:mt-8 [@media(max-height:820px)]:mt-6">
          <button
            type="button"
            onClick={onStart}
            disabled={startDisabled}
            className="w-full max-w-md rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-2.5 text-[0.95rem] font-semibold text-white shadow-[0_5px_18px_-6px_rgba(59,130,246,0.32)] transition hover:brightness-110 active:scale-[0.995] enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:px-7 sm:py-3 sm:text-base"
          >
            Start
          </button>
          <p className="mt-3 w-full max-w-[34rem] text-center text-[10px] leading-relaxed text-slate-600 sm:mt-3.5 sm:text-[11px]">
            Responses are used for academic research.
          </p>
        </div>
      </div>
    </div>
  );
}
