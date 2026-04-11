"use client";

import { useI18n } from "./provider";
import { messages } from "./messages";

type Variant = "main" | "control";

const ctaBase =
  "flex min-h-[2.75rem] w-full max-w-full items-center justify-center rounded-lg px-4 text-sm font-bold transition hover:brightness-110 active:scale-[0.99]";

export function LanguageSelectScreen({ variant }: { variant: Variant }) {
  const { setLocale } = useI18n();

  const subtitle =
    variant === "control"
      ? messages.en.control.languageSelect.subtitle
      : messages.en.languageSelect.subtitle;

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      {/* Narrow fixed cap: same compact block on phone and desktop (onboarding-style) */}
      <div className="mx-auto flex min-w-0 w-full max-w-[16.25rem] shrink-0 flex-col items-center">
        <div className="mb-5 flex w-full min-w-0 justify-center sm:mb-6">
          <img
            src="/kse-logo.svg"
            alt="Kyiv School of Economics"
            decoding="async"
            className="mx-auto block h-auto w-auto max-w-[11rem] object-contain object-center sm:max-w-[11.5rem]"
          />
        </div>

        <h1 className="m-0 w-full max-w-full text-balance text-center text-[0.875rem] font-semibold leading-snug tracking-tight text-white sm:text-[0.9375rem]">
          {messages.en.languageSelect.title}
        </h1>

        <p className="m-0 mt-2 w-full max-w-full text-balance text-center text-[0.6875rem] font-normal leading-snug text-slate-400 sm:text-xs">
          {subtitle}
        </p>

        <div className="mt-6 flex w-full max-w-full flex-col gap-3 sm:mt-7 sm:gap-3">
          <button
            type="button"
            className={`${ctaBase} bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-[var(--glow-blue)]`}
            onClick={() => setLocale("en")}
          >
            {messages.en.languageSelect.english}
          </button>
          <button
            type="button"
            className={`${ctaBase} bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[var(--glow-green)]`}
            onClick={() => setLocale("ua")}
          >
            {messages.ua.languageSelect.ukrainian}
          </button>
        </div>
      </div>
    </div>
  );
}
