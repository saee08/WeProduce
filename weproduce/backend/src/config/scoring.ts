/**
 * Single source of truth for the WeProduce scoring system.
 * There is only ONE unified score — never split this per platform in the UI.
 */
export const SCORING_RULES = {
  leetcode: {
    easy: 5,
    medium: 10,
    hard: 20,
  },
  hackerrank: {
    challenge: 8,
  },
  github: {
    push: 2,
  },
  streak: {
    dailyBonus: 5,
  },
} as const;

export function pointsForLeetCode(difficulty: "easy" | "medium" | "hard"): number {
  return SCORING_RULES.leetcode[difficulty];
}

export function pointsForHackerRank(): number {
  return SCORING_RULES.hackerrank.challenge;
}

export function pointsForGithubPush(): number {
  return SCORING_RULES.github.push;
}

export function pointsForStreakBonus(): number {
  return SCORING_RULES.streak.dailyBonus;
}
