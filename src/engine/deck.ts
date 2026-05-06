import type { Card, GameState, Quality } from './types';
import type { Rng } from './rng';

function inRequiredRanges(card: Card, state: GameState) {
  const requirements = Object.entries(card.requires ?? {}) as Array<[Quality, [number, number]]>;

  return requirements.every(([quality, [min, max]]) => {
    const value = state.qualities[quality];
    return value >= min && value <= max;
  });
}

function hasRequiredFlags(card: Card, state: GameState) {
  return (card.flags_required ?? []).every((flag) => state.flags.has(flag));
}

function avoidsForbiddenFlags(card: Card, state: GameState) {
  return !(card.flags_forbidden ?? []).some((flag) => state.flags.has(flag));
}

function isEligible(card: Card, state: GameState) {
  if (card.era !== state.era) return false;
  if (card.one_shot && state.seenIds.has(card.id)) return false;
  return inRequiredRanges(card, state) && hasRequiredFlags(card, state) && avoidsForbiddenFlags(card, state);
}

function findOverrideCard(pool: Card[], state: GameState, nextCardId: string) {
  const card = pool.find((candidate) => candidate.id === nextCardId);

  if (!card) {
    throw new Error(`nextCardId "${nextCardId}" does not match any card in the pool.`);
  }

  if (card.one_shot && state.seenIds.has(card.id)) {
    throw new Error(`nextCardId "${nextCardId}" points to a one-shot card that was already seen.`);
  }

  return card;
}

export function selectNextCard(
  state: GameState,
  pool: Card[],
  rng: Rng,
  nextCardId?: string
): Card | null {
  if (nextCardId) return findOverrideCard(pool, state, nextCardId);

  const eligible = pool.filter((card) => isEligible(card, state));
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, card) => sum + card.weight, 0);
  const target = rng() * totalWeight;
  let cursor = 0;

  for (const card of eligible) {
    cursor += card.weight;
    if (target < cursor) return card;
  }

  const fallback = eligible.at(-1);
  if (!fallback) throw new Error('Weighted card selection failed with no eligible fallback.');
  return fallback;
}
