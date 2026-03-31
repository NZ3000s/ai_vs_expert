"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-6 py-12 text-center">
      <h1 className="text-lg font-semibold text-slate-100">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mx-auto rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
      >
        Try again
      </button>
    </main>
  );
}
