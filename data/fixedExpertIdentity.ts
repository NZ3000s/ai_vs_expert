import type { Prediction } from "@/lib/types";

/**
 * Single expert identity for every round (avatar, name, handle, bio).
 * Per-round market commentary and prediction stay in `experiments.ts`.
 */
export const FIXED_EXPERT_IDENTITY = {
  name: "Marcus Chen",
  handle: "mchen_structure",
  avatar: "https://i.pravatar.cc/100?img=11",
  bio: "Former desk trader · structure & flows",
} as const;

export function buildExpert(
  text: string,
  prediction: Prediction
): typeof FIXED_EXPERT_IDENTITY & { text: string; prediction: Prediction } {
  return { ...FIXED_EXPERT_IDENTITY, text, prediction };
}
