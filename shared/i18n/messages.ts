import type { Locale } from "./constants";

/** Nested message tree per locale; use t("path.to.key") or tArray("path"). */
export const messages: Record<
  Locale,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, any>
> = {
  en: {
    loading: "Loading…",
    languageSelect: {
      title: "Behavioural Economics Experiment",
      subtitle: "Kyiv School of Economics",
      english: "English",
      ukrainian: "Українська",
    },
    main: {
      landing: {
        tagline: "Behavioral Economics · KSE",
        title: "Decision Experiment",
        body1:
          "You will complete 10 short rounds using real market data.",
        body2:
          "Each round presents two conflicting signals: one from a market expert and one from an AI model.",
        emphasis:
          "Read both carefully and choose which signal you would follow.",
        rule1: "No right or wrong answers",
        rule2: "Complete only once per participant",
        rule3: "Estimated time: 2–3 minutes",
        continue: "Continue",
        footnote: "Responses are used for academic research.",
      },
      expertIntro: {
        kicker: "Before you begin",
        title: "Expert vs model",
        subtitleMobile:
          "Two views per scenario — here is who they are.",
        expertLabel: "Expert",
        modelLabel: "Model",
        expertSubtitle:
          "Former desk trader · structure & flows",
        expertBio:
          "10+ years trading equities and derivatives. Specializes in market structure, liquidity, and risk signals.",
        modelName: "GPT-6 (OpenAI)",
        modelSubtitle: "Next-generation AI model",
        modelBio:
          "Trained on large-scale financial and general data. Optimized for pattern recognition, probability, and fast analysis.",
        strengths: "Strengths",
        expertStrengths: [
          "Reads market structure",
          "Interprets order flow",
          "Focuses on risk and downside",
        ],
        modelStrengths: [
          "Processes large datasets instantly",
          "Detects hidden patterns",
          "Consistent and unbiased",
        ],
        trustMobile:
          "Same scenarios — choose whose prediction you trust.",
        trustLine1: "Both will analyze the same scenarios.",
        trustLine2: "Your task is to decide whose prediction you trust.",
        beginRounds: "Begin rounds",
        verified: "Verified",
      },
      experiment: {
        roundOf: "Round {{current}} of {{total}}",
        mobileHint:
          "Read both views, then choose which signal you would follow.",
        historicalScenario: "Historical market scenario",
        desktopTitle: "Decision Experiment",
        desktopP1:
          "Read two conflicting market views based on the same historical chart.",
        desktopP2: "Choose which signal you would follow.",
        whichSignal: "Which signal would you follow for this scenario?",
        chartInterval: "1D",
      },
      cards: {
        expert: "Expert",
        aiModel: "AI model",
        systemGenerated: "System-generated view",
        prediction: "Prediction",
      },
      buttons: {
        followExpert: "Follow Expert",
        followAI: "Follow AI",
      },
      results: {
        thankYou: "Thank you for your participation",
        recorded: "Your responses have been recorded.",
        sessionDuration: "Session duration",
        yourResult: "Your result",
        yourResultHelp:
          "Rounds where your followed source matched the realized direction (UP/DOWN).",
        accuracy: "Accuracy",
        trustDistribution: "Trust distribution",
        trustHelp: "Share of decisions by source.",
        followExpert: "Follow Expert",
        followAI: "Follow AI",
        sourcePerformance: "Source performance",
        sourceHelp:
          "How often each source matched the prespecified outcome (UP/DOWN) in this study set.",
        expert: "Expert",
        aiModel: "AI model",
        roundFeedback: "Round-by-round feedback",
        roundFeedbackHelp:
          "Your chosen direction vs the realized outcome for each round (not shown during the task).",
        roundLine: "Round {{n}} · {{asset}}",
        outcome: "Outcome",
        youChose: "You chose",
        correct: "✓ Correct",
        incorrect: "✗ Incorrect",
        interpretation: {
          empty: "Your decisions were balanced between both sources.",
          expertHeavy: "You relied more on the expert commentary.",
          aiHeavy: "You relied more on the AI model.",
          balanced: "Your choices were balanced between expert and AI.",
        },
      },
      blocked: {
        kicker: "Behavioral research",
        title: "Thank you for your participation",
        body: "You have already completed this experiment.",
        note: "This study allows only one submission per participant.",
      },
    },
    control: {
      languageSelect: {
        title: "Behavioural Economics Experiment",
        subtitle: "Control group · Kyiv School of Economics",
      },
      intro: {
        tagline: "Behavioral Economics · KSE · Control group",
        title: "Control group experiment",
        p1: "You are participating in a behavioral experiment.",
        p2: "You are in the control group.",
        p3:
          "In this version, you will see only historical market charts without any additional predictions.",
        p4: "Your task is to decide whether the price will go UP or DOWN.",
        p5: "These scenarios are based on real market situations.",
        p6: "Please answer as carefully as possible.",
        start: "Start",
        footnote: "Responses are used for academic research.",
      },
      round: {
        roundOf: "Round {{current}} of {{total}}",
        mobileHint: "Chart only — no predictions. Choose UP or DOWN.",
        historicalScenario: "Historical market scenario",
        question: "Where do you think the price will go?",
        chartInterval: "1D",
      },
      buttons: {
        up: "UP",
        down: "DOWN",
      },
      results: {
        thankYou: "Thank you",
        recorded: "Your responses have been recorded.",
        sessionTime: "Session time",
        yourScore: "Your score",
        scoreHelp:
          "Rounds where your choice matched the realized market direction (UP / DOWN).",
        accuracy: "Accuracy",
      },
      blocked: {
        kicker: "Behavioral research",
        title: "Already completed",
        body: "You have already completed the control experiment.",
        note: "This study allows only one submission per participant.",
      },
    },
  },
  ua: {
    loading: "Завантаження…",
    languageSelect: {
      title: "Поведінковий економічний експеримент",
      subtitle: "Київська школа економіки",
      english: "English",
      ukrainian: "Українська",
    },
    main: {
      landing: {
        tagline: "Поведінкова економіка · KSE",
        title: "Експеримент з рішень",
        body1:
          "Ви пройдете 10 коротких раундів на основі реальних ринкових даних.",
        body2:
          "У кожному раунді буде два суперечливі сигнали: від ринкового експерта та від моделі ШІ.",
        emphasis:
          "Уважно прочитайте обидва й оберіть, якому сигналу ви довіряєте.",
        rule1: "Немає правильних чи неправильних відповідей",
        rule2: "Лише одне проходження на учасника",
        rule3: "Орієнтовний час: 2–3 хвилини",
        continue: "Продовжити",
        footnote: "Відповіді використовуються для наукових досліджень.",
      },
      expertIntro: {
        kicker: "Перед початком",
        title: "Експерт і модель",
        subtitleMobile:
          "Два погляди на кожен сценарій — ось хто вони.",
        expertLabel: "Експерт",
        modelLabel: "Модель",
        expertSubtitle:
          "Колишній деск-трейдер · структура та потоки",
        expertBio:
          "Понад 10 років торгівлі акціями та деривативами. Спеціалізується на ринковій структурі, ліквідності та сигналах ризику.",
        modelName: "GPT-6 (OpenAI)",
        modelSubtitle: "Модель нового покоління",
        modelBio:
          "Навчена на великих обсягах фінансових і загальних даних. Оптимізована для розпізнавання закономірностей, ймовірності та швидкого аналізу.",
        strengths: "Сильні сторони",
        expertStrengths: [
          "Читає ринкову структуру",
          "Інтерпретує потік заявок",
          "Фокус на ризику та просіданні",
        ],
        modelStrengths: [
          "Миттєво обробляє великі масиви даних",
          "Виявляє приховані закономірності",
          "Послідовна та неупереджена",
        ],
        trustMobile:
          "Ті самі сценарії — оберіть, чиєму прогнозу ви довіряєте.",
        trustLine1: "Обидва аналізуватимуть ті самі сценарії.",
        trustLine2:
          "Ваше завдання — вирішити, чиєму прогнозу ви довіряєте.",
        beginRounds: "Почати раунди",
        verified: "Підтверджено",
      },
      experiment: {
        roundOf: "Раунд {{current}} з {{total}}",
        mobileHint:
          "Прочитайте обидва погляди, потім оберіть, якому сигналу ви довіряєте.",
        historicalScenario: "Історичний ринковий сценарій",
        desktopTitle: "Експеримент з рішень",
        desktopP1:
          "Прочитайте два суперечливі погляди на той самий історичний графік.",
        desktopP2: "Оберіть, якому сигналу ви довіряєте.",
        whichSignal: "Якому сигналу ви довіряєте в цьому сценарії?",
        chartInterval: "1D",
      },
      cards: {
        expert: "Експерт",
        aiModel: "Модель ШІ",
        systemGenerated: "Системне формулювання",
        prediction: "Прогноз",
      },
      buttons: {
        followExpert: "Довіряю експерту",
        followAI: "Довіряю ШІ",
      },
      results: {
        thankYou: "Дякуємо за участь",
        recorded: "Ваші відповіді збережено.",
        sessionDuration: "Тривалість сесії",
        yourResult: "Ваш результат",
        yourResultHelp:
          "Раунди, коли обране джерело збігалося з реалізованим напрямком (UP/DOWN).",
        accuracy: "Точність",
        trustDistribution: "Розподіл довіри",
        trustHelp: "Частка рішень за джерелом.",
        followExpert: "Довіряю експерту",
        followAI: "Довіряю ШІ",
        sourcePerformance: "Якість джерел",
        sourceHelp:
          "Як часто кожне джерело збігалося із заданим результатом (UP/DOWN) у цьому наборі.",
        expert: "Експерт",
        aiModel: "Модель ШІ",
        roundFeedback: "За раундами",
        roundFeedbackHelp:
          "Ваш вибір проти реалізованого результату в кожному раунді (не показувалося під час завдання).",
        roundLine: "Раунд {{n}} · {{asset}}",
        outcome: "Результат",
        youChose: "Ваш вибір",
        correct: "✓ Вірно",
        incorrect: "✗ Невірно",
        interpretation: {
          empty: "Ваші рішення були збалансовані між джерелами.",
          expertHeavy: "Ви більше покладалися на коментарі експерта.",
          aiHeavy: "Ви більше покладалися на модель ШІ.",
          balanced: "Ваші вибори були збалансовані між експертом і ШІ.",
        },
      },
      blocked: {
        kicker: "Поведінкові дослідження",
        title: "Дякуємо за участь",
        body: "Ви вже завершили цей експеримент.",
        note: "Дослідження дозволяє лише одне проходження на учасника.",
      },
    },
    control: {
      languageSelect: {
        title: "Поведінковий економічний експеримент",
        subtitle: "Контрольна група · Київська школа економіки",
      },
      intro: {
        tagline: "Поведінкова економіка · KSE · Контрольна група",
        title: "Експеримент контрольної групи",
        p1: "Ви берете участь у поведінковому експерименті.",
        p2: "Ви в контрольній групі.",
        p3:
          "У цій версії ви бачите лише історичні ринкові графіки без додаткових прогнозів.",
        p4: "Ваше завдання — визначити, чи ціна піде ВГОРУ чи ВНИЗ.",
        p5: "Сценарії базуються на реальних ринкових ситуаціях.",
        p6: "Будь ласка, відповідайте якомога уважніше.",
        start: "Почати",
        footnote: "Відповіді використовуються для наукових досліджень.",
      },
      round: {
        roundOf: "Раунд {{current}} з {{total}}",
        mobileHint:
          "Лише графік — без прогнозів. Оберіть ВГОРУ чи ВНИЗ.",
        historicalScenario: "Історичний ринковий сценарій",
        question: "Куди, на вашу думку, рухатиметься ціна?",
        chartInterval: "1D",
      },
      buttons: {
        up: "ВГОРУ",
        down: "ВНИЗ",
      },
      results: {
        thankYou: "Дякуємо",
        recorded: "Ваші відповіді збережено.",
        sessionTime: "Час сесії",
        yourScore: "Ваш рахунок",
        scoreHelp:
          "Раунди, коли ваш вибір збігався з реалізованим напрямком ринку (UP / DOWN).",
        accuracy: "Точність",
      },
      blocked: {
        kicker: "Поведінкові дослідження",
        title: "Вже завершено",
        body: "Ви вже завершили експеримент контрольної групи.",
        note: "Дослідження дозволяє лише одне проходження на учасника.",
      },
    },
  },
};
