"use client";

import { ControlHome } from "@/components/ControlHome";
import { LanguageSelectScreen } from "../../shared/i18n/LanguageSelectScreen";
import { messages } from "../../shared/i18n/messages";
import { I18nProvider, useI18n } from "../../shared/i18n/provider";

function ControlAppGate() {
  const { ready, locale } = useI18n();

  if (!ready) {
    return (
      <main className="relative z-10 mx-auto flex min-h-dvh max-w-7xl items-center justify-center">
        <p className="text-sm text-slate-500" role="status">
          {messages.en.loading}
        </p>
      </main>
    );
  }

  if (!locale) {
    return (
      <main className="relative z-10 mx-auto min-h-dvh w-full max-w-none">
        <LanguageSelectScreen variant="control" />
      </main>
    );
  }

  return <ControlHome />;
}

export function ControlShell() {
  return (
    <I18nProvider>
      <ControlAppGate />
    </I18nProvider>
  );
}
