"use client";

import { decisionCardClass } from "@/components/ExpertCard";
import { FIXED_EXPERT_IDENTITY } from "@/data/fixedExpertIdentity";
import { useI18n } from "@shared/i18n/provider";

function VerifiedCheck({ title }: { title: string }) {
  return (
    <span
      className="inline-flex shrink-0 text-sky-400"
      title={title}
      aria-hidden
    >
      <svg
        className="h-3.5 w-3.5 lg:h-4 lg:w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

function StrengthList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 space-y-px text-[11px] leading-tight text-slate-300 lg:mt-2.5 lg:space-y-1.5 lg:text-[13px] lg:leading-snug">
      {items.map((line) => (
        <li key={line} className="flex gap-1.5 lg:gap-2">
          <span className="shrink-0 text-slate-500" aria-hidden>
            •
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export function ExpertModelIntroScreen({ onBegin }: { onBegin: () => void }) {
  const { t, tArray } = useI18n();
  const expertStrengths = tArray("main.expertIntro.expertStrengths");
  const modelStrengths = tArray("main.expertIntro.modelStrengths");

  return (
    <div className="flex w-full max-w-full flex-shrink-0 justify-center px-0 lg:px-0">
      <div className="w-full max-w-5xl rounded-xl border border-white/[0.12] bg-slate-900/45 px-3 py-3 shadow-[0_20px_56px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-xl sm:rounded-[1.65rem] sm:px-8 sm:py-8 md:px-10">
        <p className="text-center text-[9px] font-medium uppercase tracking-[0.22em] text-slate-500 lg:text-[11px] lg:tracking-[0.26em]">
          {t("main.expertIntro.kicker")}
        </p>
        <h1 className="mx-auto mt-0.5 max-w-2xl text-center text-[1.125rem] font-bold leading-tight tracking-tight text-white lg:mt-2 lg:text-2xl">
          {t("main.expertIntro.title")}
        </h1>
        <p className="mx-auto mt-1 max-w-xl px-0.5 text-center text-[11px] leading-snug text-slate-400 lg:mt-2 lg:text-[15px] lg:leading-relaxed">
          {t("main.expertIntro.subtitleMobile")}
        </p>

        <div className="mx-auto mt-2.5 grid max-w-4xl grid-cols-1 gap-2 lg:mt-8 lg:grid-cols-2 lg:gap-6">
          <section
            className={`${decisionCardClass} flex flex-col p-2.5 lg:min-h-[280px] lg:p-5`}
            aria-labelledby="intro-expert-title"
          >
            <p
              id="intro-expert-title"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:text-[11px] lg:tracking-[0.2em]"
            >
              {t("main.expertIntro.expertLabel")}
            </p>
            <div className="mt-1.5 flex gap-2 lg:mt-3 lg:gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote avatar URL from fixed expert identity */}
              <img
                src={FIXED_EXPERT_IDENTITY.avatar}
                alt=""
                width={56}
                height={56}
                className="h-11 w-11 shrink-0 rounded-full border border-white/10 bg-slate-800 object-cover ring-2 ring-white/5 lg:h-16 lg:w-16"
              />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-1 text-[13px] font-semibold leading-tight text-white lg:gap-1.5 lg:text-base">
                  <span>Marcus Chen</span>
                  <VerifiedCheck title={t("main.expertIntro.verified")} />
                </p>
                <p className="mt-px text-[11px] text-slate-400 lg:text-sm">
                  @{FIXED_EXPERT_IDENTITY.handle}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500 lg:mt-1 lg:text-[13px] lg:leading-relaxed">
                  {t("main.expertIntro.expertSubtitle")}
                </p>
              </div>
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-slate-200 lg:mt-3 lg:text-sm lg:leading-relaxed">
              {t("main.expertIntro.expertBio")}
            </p>
            <div className="mt-1 lg:mt-1">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 lg:text-[11px]">
                {t("main.expertIntro.strengths")}
              </p>
              <StrengthList items={expertStrengths} />
            </div>
          </section>

          <section
            className={`${decisionCardClass} flex flex-col p-2.5 lg:min-h-[280px] lg:p-5`}
            aria-labelledby="intro-model-title"
          >
            <p
              id="intro-model-title"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:text-[11px] lg:tracking-[0.2em]"
            >
              {t("main.expertIntro.modelLabel")}
            </p>
            <div className="mt-1.5 flex gap-2 lg:mt-3 lg:gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#2563eb] ring-2 ring-white/5 lg:h-16 lg:w-16">
                {/* eslint-disable-next-line @next/next/no-img-element -- static asset; matches AICard */}
                <img
                  src="/ai-robot-avatar.png"
                  alt="AI model"
                  width={64}
                  height={64}
                  draggable={false}
                  className="size-full origin-center scale-[1.22] object-cover object-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight text-white lg:text-base">
                  {t("main.expertIntro.modelName")}
                </p>
                <p className="mt-px text-[10px] leading-snug text-slate-500 lg:mt-1 lg:text-[13px] lg:leading-relaxed">
                  {t("main.expertIntro.modelSubtitle")}
                </p>
              </div>
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-slate-200 lg:mt-3 lg:text-sm lg:leading-relaxed">
              {t("main.expertIntro.modelBio")}
            </p>
            <div className="mt-1 lg:mt-1">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 lg:text-[11px]">
                {t("main.expertIntro.strengths")}
              </p>
              <StrengthList items={modelStrengths} />
            </div>
          </section>
        </div>

        <div className="mx-auto mt-2 max-w-xl border-y border-white/[0.08] py-2 text-center lg:mt-8 lg:py-5">
          <p className="px-1 text-[11px] font-semibold leading-snug text-white lg:hidden">
            {t("main.expertIntro.trustMobile")}
          </p>
          <div className="hidden lg:block">
            <p className="text-base font-semibold leading-relaxed text-white">
              {t("main.expertIntro.trustLine1")}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
              {t("main.expertIntro.trustLine2")}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-2 flex w-full max-w-md flex-col items-center lg:mt-7">
          <button
            type="button"
            onClick={onBegin}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-[0.875rem] font-semibold text-white shadow-[0_5px_18px_-6px_rgba(59,130,246,0.32)] transition hover:brightness-110 active:scale-[0.995] lg:rounded-xl lg:px-6 lg:py-3 lg:text-base"
          >
            {t("main.expertIntro.beginRounds")}
          </button>
        </div>
      </div>
    </div>
  );
}
