"use client";

export function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex w-full max-w-full flex-shrink-0 justify-center px-0 sm:px-0">
      <div className="w-full max-w-4xl rounded-2xl border border-white/[0.12] bg-slate-900/45 px-7 py-8 shadow-[0_20px_56px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-xl sm:rounded-[1.65rem] sm:px-10 sm:py-8 md:max-w-[52rem] md:px-11 md:py-9 [@media(max-height:820px)]:px-6 [@media(max-height:820px)]:py-7">
        {/* Branding — centered stack */}
        <div className="mb-4 flex justify-center sm:mb-5 [@media(max-height:820px)]:mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local SVG; white fills in public/kse-logo.svg */}
          <img
            src="/kse-logo.svg"
            alt="Kyiv School of Economics"
            className="h-9 w-auto max-w-[min(248px,82vw)] sm:h-10 [@media(max-height:820px)]:h-8 [@media(max-height:820px)]:max-w-[min(220px,82vw)]"
          />
        </div>

        <p className="text-center text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500 sm:text-[11px]">
          Behavioral Economics · KSE
        </p>

        <h1 className="mx-auto mt-2.5 max-w-2xl text-center text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:mt-3 sm:text-[1.85rem] md:text-[2.1rem] md:leading-[1.12] [@media(max-height:820px)]:text-[1.5rem] [@media(max-height:820px)]:sm:text-[1.65rem]">
          Decision Experiment
        </h1>

        {/* Single readable column: consistent width, all centered */}
        <div className="mx-auto mt-5 max-w-[34rem] text-center sm:mt-6 [@media(max-height:820px)]:mt-4">
          <div className="space-y-4 text-[15px] leading-[1.65] text-slate-300 sm:text-base sm:leading-[1.7] md:text-[17px]">
            <p>
              You will complete 10 short rounds using real market data.
            </p>
            <p>
              Each round presents two conflicting signals: one from a market
              expert and one from an AI model.
            </p>
          </div>

          {/* Core instruction — emphasized */}
          <p className="my-7 border-y border-white/[0.08] py-5 text-[17px] font-semibold leading-relaxed text-white sm:my-8 sm:text-[1.05rem] sm:leading-[1.55] md:text-[1.125rem] [@media(max-height:820px)]:my-5 [@media(max-height:820px)]:py-4">
            Read both carefully and choose which signal you would follow.
          </p>

          {/* Rules — secondary, separated, centered */}
          <div className="space-y-2.5 text-[12.5px] leading-relaxed text-slate-400 sm:text-[13px] md:text-sm">
            <p>No right or wrong answers</p>
            <p>Complete only once per participant</p>
            <p>Estimated time: 2–3 minutes</p>
          </div>
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-[34rem] flex-col items-center sm:mt-8 [@media(max-height:820px)]:mt-6">
          <button
            type="button"
            onClick={onStart}
            className="w-full max-w-md rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-2.5 text-[0.95rem] font-semibold text-white shadow-[0_5px_18px_-6px_rgba(59,130,246,0.32)] transition hover:brightness-110 active:scale-[0.995] sm:px-7 sm:py-3 sm:text-base"
          >
            Start Experiment
          </button>
          <p className="mt-3 w-full max-w-[34rem] text-center text-[10px] leading-relaxed text-slate-600 sm:mt-3.5 sm:text-[11px]">
            Responses are used for academic research.
          </p>
        </div>
      </div>
    </div>
  );
}
