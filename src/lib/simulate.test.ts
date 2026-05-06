import { BOUNDARY_ENDINGS, MAIN_ENDINGS } from '../endings/era-1956';
import { simulateMany, simulateRun } from './simulate';

const validEndingIds = new Set([...Object.keys(MAIN_ENDINGS), ...Object.keys(BOUNDARY_ENDINGS)]);

describe('simulateRun', () => {
  it('is deterministic for a fixed seed and policy', () => {
    expect(simulateRun(42, 'random')).toEqual(simulateRun(42, 'random'));
    expect(simulateRun(42, 'right')).toEqual(simulateRun(42, 'right'));
  });

  it('returns a RunResult with valid endingId', () => {
    const result = simulateRun(1956, 'random');

    expect(validEndingIds.has(result.endingId)).toBe(true);
    expect(result.swipeCount).toBeGreaterThan(0);
    expect(result.finalQualities).toHaveProperty('symbolic_progress');
  });
});

describe('simulateMany', () => {
  it('aggregates correctly', () => {
    const expectedDistribution: Record<string, number> = {};
    const swipeCounts: number[] = [];

    for (let offset = 0; offset < 6; offset += 1) {
      const result = simulateRun(100 + offset);
      expectedDistribution[result.endingId] = (expectedDistribution[result.endingId] ?? 0) + 1;
      swipeCounts.push(result.swipeCount);
    }

    const result = simulateMany(6, 100);
    const sortedSwipes = [...swipeCounts].sort((left, right) => left - right);

    expect(result.distribution).toEqual(expectedDistribution);
    expect(result.medianSwipes).toBe((sortedSwipes[2]! + sortedSwipes[3]!) / 2);
  });
});
