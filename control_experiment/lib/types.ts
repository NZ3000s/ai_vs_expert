export type Prediction = "UP" | "DOWN";

/** OHLCV from a single daily candle (Binance-style); `time` is unix seconds UTC. */
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/** One row sent to Google Sheets (control payload). */
export interface ControlResponseRow {
  round_number: number;
  scenario_id: number;
  asset: string;
  user_choice: Prediction;
  correct_answer: Prediction;
  response_time_ms: number;
  /** ISO 8601 */
  timestamp: string;
}

