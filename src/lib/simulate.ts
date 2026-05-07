import { checkBoundaryEnd } from '../engine/endings';
import { selectNextCard } from '../engine/deck';
import { createRng } from '../engine/rng';
import { applyChoice } from '../engine/resolver';
import type { ChoiceSide, GameState, Quality } from '../engine/types';
import { selectEnding } from '../endings/era-1956';
import { era1956Cards } from '../cards/era-1956';

const qualityKeys: Quality[] = [
  'symbolic_progress',
  'funding',
  'public_trust',
  'academic_credibility',
  'compute',
  'team_morale',
];

export interface RunResult {
  endingId: string;
  swipeCount: number;
  finalQualities: Record<Quality, number>;
  seenIds: string[];
}

export type ChoicePolicy = 'random' | 'left' | 'right';

function initialQualities() {
  return Object.fromEntries(qualityKeys.map((quality) => [quality, 50])) as Record<Quality, number>;
}

function baseState(): GameState {
  return {
    qualities: initialQualities(),
    flags: new Set(),
    seenIds: new Set(),
    currentCard: null,
    era: '1956',
  };
}

function chooseSide(policy: ChoicePolicy, rng: () => number): ChoiceSide {
  if (policy === 'random') return rng() < 0.5 ? 'left' : 'right';
  return policy;
}

export function simulateRun(seed: number, choicePolicy: ChoicePolicy = 'random'): RunResult {
  const rng = createRng(seed);
  const pool = era1956Cards;
  let state = baseState();
  let currentCard = selectNextCard(state, pool, rng);
  let swipeCount = 0;

  while (currentCard) {
    const side = chooseSide(choicePolicy, rng);
    const result = applyChoice(state, currentCard, side);
    state = result.state;
    swipeCount += 1;

    const boundary = checkBoundaryEnd(state);
    if (boundary) {
      const ending = selectEnding(state, { reason: 'boundary', ...boundary });
      return {
        endingId: ending.id,
        swipeCount,
        finalQualities: state.qualities,
        seenIds: [...state.seenIds],
      };
    }

    currentCard = selectNextCard(state, pool, rng, result.event.nextCardId);
    if (!currentCard) {
      const ending = selectEnding(state, { reason: 'pool-exhausted' });
      return {
        endingId: ending.id,
        swipeCount,
        finalQualities: state.qualities,
        seenIds: [...state.seenIds],
      };
    }

    if (swipeCount > pool.length + 20) {
      throw new Error('Simulation exceeded the expected card pool length.');
    }
  }

  const ending = selectEnding(state, { reason: 'pool-exhausted' });
  return {
    endingId: ending.id,
    swipeCount,
    finalQualities: state.qualities,
    seenIds: [...state.seenIds],
  };
}

export function simulateMany(
  count: number,
  seedBase: number,
): { distribution: Record<string, number>; medianSwipes: number } {
  const distribution: Record<string, number> = {};
  const swipeCounts: number[] = [];

  for (let offset = 0; offset < count; offset += 1) {
    const result = simulateRun(seedBase + offset);
    distribution[result.endingId] = (distribution[result.endingId] ?? 0) + 1;
    swipeCounts.push(result.swipeCount);
  }

  if (swipeCounts.length === 0) return { distribution, medianSwipes: 0 };

  const sorted = swipeCounts.sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  const medianSwipes =
    sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;

  return { distribution, medianSwipes };
}
