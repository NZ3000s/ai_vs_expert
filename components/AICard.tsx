"use client";

import { decisionCardClass, PredictionBadge } from "@/components/ExpertCard";
import type { AIView } from "@/lib/types";
import { useI18n } from "@shared/i18n/provider";

export function AICard({ view }: { view: AIView }) {
  const { t } = useI18n();

  return (
    <section
      className={`${decisionCardClass} p-3 lg:p-4`}
      aria-labelledby="ai-heading"
    >
      <p
        id="ai-heading"
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
      >
        {t("main.cards.aiModel")}
      </p>
      <div className="mt-2 flex gap-2 lg:mt-3 lg:gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#2563eb] ring-2 ring-white/5 lg:h-12 lg:w-12">
          {/* eslint-disable-next-line @next/next/no-img-element -- static asset; same 48px frame as ExpertCard */}
          <img
            src="/ai-robot-avatar.png"
            alt="AI assistant"
            width={48}
            height={48}
            draggable={false}
            className="size-full origin-center scale-[1.22] object-cover object-center will-change-transform"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">{t("main.cards.aiModel")}</p>
          <p className="truncate text-sm text-slate-400">
            {t("main.cards.systemGenerated")}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs leading-snug text-slate-200 lg:mt-3 lg:text-sm lg:leading-relaxed">
        {view.explanation}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 lg:mt-4">
        <PredictionBadge
          prediction={view.prediction}
          label={t("main.cards.prediction")}
        />
      </div>
    </section>
  );
}
