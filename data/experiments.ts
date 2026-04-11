/**
 * Study rounds: expert/AI copy and outcomes.
 * Daily OHLC arrays are preloaded from `chartData.generated.ts` (run
 * `npm run fetch-historical` once to regenerate from Binance).
 */
import type { Candle, Prediction } from "@/lib/types";
import { buildExpert } from "./fixedExpertIdentity";
import { CHART_BY_ROUND } from "./chartData.generated";

export type ExperimentAsset = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";

export interface ExperimentExpert {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  text: string;
  prediction: Prediction;
}

export interface ExperimentAI {
  prediction: Prediction;
  text: string;
}

export interface ExperimentRound {
  id: number;
  asset: ExperimentAsset;
  displayAsset: string;
  timeframe: "1D";
  chartData: Candle[];
  scenarioLabel: string;
  expert: ExperimentExpert;
  ai: ExperimentAI;
  outcome: Prediction;
}

function assertOpposite(expert: Prediction, ai: Prediction): void {
  if (expert === ai) {
    throw new Error(`Round: AI must oppose expert (got ${expert})`);
  }
}

function assertOutcomeMatches(
  expert: Prediction,
  ai: Prediction,
  outcome: Prediction
): void {
  if (outcome !== expert && outcome !== ai) {
    throw new Error(
      `Round: outcome must match expert or AI (expert=${expert} ai=${ai} outcome=${outcome})`
    );
  }
}

/**
 * 10 rounds: real preloaded Binance daily OHLC (see chartData.generated.ts).
 * Outcome = net direction first open → last close over the visible window.
 * Expert correct on rounds 1–5; wrong on 6–10 (balanced 50% / 50% vs ground truth).
 */
export const EXPERIMENT_ROUNDS: ExperimentRound[] = (() => {
  const rounds: ExperimentRound[] = [
    {
      id: 1,
      asset: "BTCUSDT",
      displayAsset: "BTC/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[1]!,
      scenarioLabel: "BTC post-FTX stabilization (daily)",
      outcome: "UP",
      expert: buildExpert(
        "Daily structure is repairing after the shock: higher lows into resistance without a clean distribution signature. I expect continuation higher through the local range.",
        "UP"
      ),
      ai: {
        prediction: "DOWN",
        text: "The bounce is narrow and participation is thin; a failed retest here should unwind quickly toward prior support.",
      },
    },
    {
      id: 2,
      asset: "ETHUSDT",
      displayAsset: "ETH/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[2]!,
      scenarioLabel: "ETH Q1 2023 (daily)",
      outcome: "UP",
      expert: buildExpert(
        "ETH is reclaiming structure—buyers are absorbing dips into the event window. I stay constructive while the last major swing low holds.",
        "UP"
      ),
      ai: {
        prediction: "DOWN",
        text: "This advance looks extended; fading momentum favors a mean-reversion lower before the next leg.",
      },
    },
    {
      id: 3,
      asset: "SOLUSDT",
      displayAsset: "SOL/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[3]!,
      scenarioLabel: "SOL late 2022–early 2023 (daily)",
      outcome: "DOWN",
      expert: buildExpert(
        "Liquidity is still fragile on the daily—failed rallies are selling off. I lean lower until breadth and follow-through improve.",
        "DOWN"
      ),
      ai: {
        prediction: "UP",
        text: "Compression after the washout usually resolves with a squeeze; the path of least resistance is up into the next liquidity pocket.",
      },
    },
    {
      id: 4,
      asset: "BNBUSDT",
      displayAsset: "BNB/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[4]!,
      scenarioLabel: "BNB spring–summer 2023 (daily)",
      outcome: "DOWN",
      expert: buildExpert(
        "Headline overhang is showing up in price: lower highs and weak closes. I do not fight the trend until character changes.",
        "DOWN"
      ),
      ai: {
        prediction: "UP",
        text: "Long lower wicks show absorption; a quiet base can still resolve as a higher low before the next leg.",
      },
    },
    {
      id: 5,
      asset: "BTCUSDT",
      displayAsset: "BTC/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[5]!,
      scenarioLabel: "BTC Q4 2023–Q1 2024 (daily)",
      outcome: "UP",
      expert: buildExpert(
        "This leg sits inside a larger weekly uptrend into the halving cycle. Pullbacks look positional, not structural.",
        "UP"
      ),
      ai: {
        prediction: "DOWN",
        text: "Lower highs on the daily and thinning upside thrust suggest the pullback may still be incomplete.",
      },
    },
    {
      id: 6,
      asset: "ETHUSDT",
      displayAsset: "ETH/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[6]!,
      scenarioLabel: "ETH Q2–Q3 2024 (daily)",
      outcome: "UP",
      expert: buildExpert(
        "We are extended into resistance with narrowing breadth—this looks like a classic failed breakout setup. I expect a sharp mean-reversion lower from here.",
        "DOWN"
      ),
      ai: {
        prediction: "UP",
        text: "Trend structure is intact: buyers defend dips and each pullback is shallower. Continuation is still the base case.",
      },
    },
    {
      id: 7,
      asset: "SOLUSDT",
      displayAsset: "SOL/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[7]!,
      scenarioLabel: "SOL H1 2024 rally window (daily)",
      outcome: "UP",
      expert: buildExpert(
        "Momentum is rolling over with bearish divergence into the highs—this rally has the hallmarks of a late-stage exhaustion print. I fade strength.",
        "DOWN"
      ),
      ai: {
        prediction: "UP",
        text: "Impulsive character off the lows; while the last higher low holds, trend continuation remains the cleaner read.",
      },
    },
    {
      id: 8,
      asset: "BNBUSDT",
      displayAsset: "BNB/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[8]!,
      scenarioLabel: "BNB mid-2022 stress (daily)",
      outcome: "DOWN",
      expert: buildExpert(
        "Selling is getting disorderly—elongated wicks and volume spikes usually mark a local washout. I look for a relief bounce into congestion.",
        "UP"
      ),
      ai: {
        prediction: "DOWN",
        text: "Credit stress feeds through as lower highs; bounces are still selling opportunities until balance returns.",
      },
    },
    {
      id: 9,
      asset: "ETHUSDT",
      displayAsset: "ETH/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[9]!,
      scenarioLabel: "ETH merge aftermath (daily)",
      outcome: "UP",
      expert: buildExpert(
        "Price is churning under the highs with weak upside follow-through—this reads like distribution, not continuation. I expect a break lower.",
        "DOWN"
      ),
      ai: {
        prediction: "UP",
        text: "Higher lows into resistance with shrinking supply on dips; resolution higher is still the higher-probability path.",
      },
    },
    {
      id: 10,
      asset: "BTCUSDT",
      displayAsset: "BTC/USDT",
      timeframe: "1D",
      chartData: CHART_BY_ROUND[10]!,
      scenarioLabel: "BTC mid-2022 drawdown (daily)",
      outcome: "DOWN",
      expert: buildExpert(
        "Volatility is compressing after the leg down—markets rarely trend in a straight line. I expect a short-covering bounce before any new low.",
        "UP"
      ),
      ai: {
        prediction: "DOWN",
        text: "Bearish sequence of lower highs; shallow rallies keep getting sold. The path of least resistance stays down.",
      },
    },
  ];

  for (const r of rounds) {
    assertOpposite(r.expert.prediction, r.ai.prediction);
    assertOutcomeMatches(r.expert.prediction, r.ai.prediction, r.outcome);
    if (r.chartData.length < 60) {
      throw new Error(`Round ${r.id}: insufficient chartData length`);
    }
  }
  return rounds;
})();

export const TOTAL_ROUNDS = EXPERIMENT_ROUNDS.length;
