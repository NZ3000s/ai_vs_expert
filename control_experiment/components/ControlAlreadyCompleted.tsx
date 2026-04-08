"use client";

export function ControlAlreadyCompleted() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <p className="max-w-md text-lg leading-relaxed text-slate-300 sm:text-xl">
        You have already completed this experiment. Thank you.
      </p>
    </div>
  );
}
