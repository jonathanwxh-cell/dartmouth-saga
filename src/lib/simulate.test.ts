import { loadCards } from '../engine/loadCards';
import type { Card } from '../engine/schema';
import { BOUNDARY_ENDINGS, MAIN_ENDINGS } from '../endings/era-1956';
import { simulateMany, simulateRun } from './simulate';

const validEndingIds = new Set([...Object.keys(MAIN_ENDINGS), ...Object.keys(BOUNDARY_ENDINGS)]);
const pool = loadCards().filter((card) => card.era === '1956');
const midTrajectoryIds = new Set([
  'trajectory-mid-careful',
  'trajectory-mid-bold',
  'trajectory-mid-stable',
]);

describe('simulateRun', () => {
  it('is deterministic for a fixed seed and policy', () => {
    expect(simulateRun(42, pool, 'random')).toEqual(simulateRun(42, pool, 'random'));
    expect(simulateRun(42, pool, 'right')).toEqual(simulateRun(42, pool, 'right'));
  });

  it('returns a RunResult with valid endingId', () => {
    const result = simulateRun(1956, pool, 'random');

    expect(validEndingIds.has(result.endingId)).toBe(true);
    expect(result.swipeCount).toBeGreaterThan(0);
    expect(result.finalQualities).toHaveProperty('symbolic_progress');
  });

  it('reaches interstitials in the typical run', () => {
    const interstitialCounts = [42, 1956, 2026, 704].map((seed) => {
      const result = simulateRun(seed, pool, 'random') as ReturnType<typeof simulateRun> & {
        seenIds?: string[];
      };

      return (result.seenIds ?? []).filter((id) => id.startsWith('interstitial-')).length;
    });

    expect(Math.max(...interstitialCounts)).toBeGreaterThanOrEqual(2);
  });

  it('sets trajectory-mid-shown in at least 80% of random runs that complete past swipe 25', () => {
    const runsPastSwipe25 = Array.from({ length: 200 }, (_, offset) =>
      simulateRun(3000 + offset, pool, 'random'),
    ).filter((result) => result.swipeCount > 25);

    const runsWithMidTrajectory = runsPastSwipe25.filter((result) =>
      result.seenIds.some((id) => midTrajectoryIds.has(id)),
    );

    expect(runsPastSwipe25.length).toBeGreaterThan(0);
    expect(runsWithMidTrajectory.length / runsPastSwipe25.length).toBeGreaterThanOrEqual(0.8);
  });

  it('does not let identical-choice pause cards perturb later random decisions', () => {
    const decision: Card = {
      id: 'decision',
      era: '1956',
      weight: 100,
      one_shot: true,
      speaker: { name: 'John McCarthy', portrait: 'mccarthy.png' },
      prompt: 'Decision',
      left: { label: 'Left', effects: { symbolic_progress: 20 } },
      right: { label: 'Right', effects: { symbolic_progress: -20 } },
    };
    const gatedDecision: Card = {
      ...decision,
      flags_required: ['ready'],
    };
    const pause: Card = {
      id: 'pause',
      era: '1956',
      weight: 100,
      is_interstitial: true,
      one_shot: true,
      speaker: { name: '', portrait: '' },
      prompt: 'Pause',
      left: {
        label: 'Continue',
        effects: {},
        flags: ['ready'],
        nextCardId: 'decision',
      },
      right: {
        label: 'Continue',
        effects: {},
        flags: ['ready'],
        nextCardId: 'decision',
      },
    };

    const control = simulateRun(1, [decision], 'random');
    const withPause = simulateRun(1, [pause, gatedDecision], 'random');

    expect(withPause.finalQualities.symbolic_progress).toBe(
      control.finalQualities.symbolic_progress,
    );
    expect(withPause.swipeCount).toBe(control.swipeCount + 1);
  });
});

describe('simulateMany', () => {
  it('aggregates correctly', () => {
    const expectedDistribution: Record<string, number> = {};
    const swipeCounts: number[] = [];

    for (let offset = 0; offset < 6; offset += 1) {
      const result = simulateRun(100 + offset, pool);
      expectedDistribution[result.endingId] = (expectedDistribution[result.endingId] ?? 0) + 1;
      swipeCounts.push(result.swipeCount);
    }

    const result = simulateMany(6, 100, pool);
    const sortedSwipes = [...swipeCounts].sort((left, right) => left - right);

    expect(result.distribution).toEqual(expectedDistribution);
    expect(result.medianSwipes).toBe((sortedSwipes[2]! + sortedSwipes[3]!) / 2);
  });
});
