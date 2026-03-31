export type Prediction = "UP" | "DOWN";
export type FollowSource = "Expert" | "AI";

/** OHLCV from a single daily candle (Binance-style); `time` is unix seconds UTC. */
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface AIView {
  prediction: Prediction;
  explanation: string;
}

export interface RoundRecord {
  participant_id: string;
  round_number: number;
  asset: string;
  expert_prediction: Prediction;
  ai_prediction: Prediction;
  /** Prespecified realized outcome for this round (study ground truth). */
  outcome: Prediction;
  followed_source: FollowSource;
  response_time_ms: number;
  /** ISO 8601 timestamp when the participant submitted this round. */
  answered_at?: string;
  tweet_id: null;
  tweet_url: null;
  expert_handle: string;
}
