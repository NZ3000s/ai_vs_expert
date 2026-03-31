"use client";

import { decisionCardClass, PredictionBadge } from "@/components/ExpertCard";
import type { AIView } from "@/lib/types";

export function AICard({ view }: { view: AIView }) {
  return (
    <section
      className={decisionCardClass}
      aria-labelledby="ai-heading"
    >
      <p
        id="ai-heading"
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"
      >
        AI model
      </p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#2563eb] ring-2 ring-white/5">
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
          <p className="font-semibold text-white">AI model</p>
          <p className="truncate text-sm text-slate-400">System-generated view</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">
        {view.explanation}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PredictionBadge prediction={view.prediction} />
      </div>
    </section>
  );
}
