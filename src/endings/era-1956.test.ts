import {
  BOUNDARY_ENDINGS,
  MAIN_ENDINGS,
  endingCategoryLabel,
  endingHints,
  selectEnding
} from './era-1956';
import { makeState, qualities } from '../engine/testFixtures';
import { simulateRun } from '../lib/simulate';

describe('selectEnding', () => {
  it('pool-exhausted with high stats returns proposal-funded', () => {
    const state = makeState({
      qualities: {
        ...makeState().qualities,
        symbolic_progress: 70,
        funding: 50,
        academic_credibility: 50,
      },
    });

    expect(selectEnding(state, { reason: 'pool-exhausted' })).toBe(MAIN_ENDINGS['proposal-funded']);
  });

  it('pool-exhausted with mid stats returns partial', () => {
    const state = makeState({
      qualities: {
        ...makeState().qualities,
        symbolic_progress: 50,
        funding: 30,
        academic_credibility: 20,
      },
    });

    expect(selectEnding(state, { reason: 'pool-exhausted' })).toBe(MAIN_ENDINGS.partial);
  });

  it('pool-exhausted with low stats returns canceled', () => {
    const state = makeState({
      qualities: {
        ...makeState().qualities,
        symbolic_progress: 49,
        funding: 29,
        academic_credibility: 90,
      },
    });

    expect(selectEnding(state, { reason: 'pool-exhausted' })).toBe(MAIN_ENDINGS.canceled);
  });

  it('boundary funding-collapse returns the matching boundary ending', () => {
    expect(
      selectEnding(makeState(), { reason: 'boundary', quality: 'funding', kind: 'collapse' }),
    ).toBe(BOUNDARY_ENDINGS['funding-collapse']);
  });

  it('boundary compute-overheat returns the matching boundary ending', () => {
    expect(
      selectEnding(makeState(), { reason: 'boundary', quality: 'compute', kind: 'overheat' }),
    ).toBe(BOUNDARY_ENDINGS['compute-overheat']);
  });

  it('every BOUNDARY_ENDINGS key has both -collapse and -overheat variants for all 6 qualities', () => {
    const expectedKeys = qualities.flatMap((quality) => [
      `${quality}-collapse`,
      `${quality}-overheat`,
    ]);

    expect(Object.keys(BOUNDARY_ENDINGS).sort()).toEqual(expectedKeys.sort());
  });

  it('provides one mechanical hint for every ending', () => {
    const endingIds = [...Object.keys(MAIN_ENDINGS), ...Object.keys(BOUNDARY_ENDINGS)];

    expect(Object.keys(endingHints).sort()).toEqual(endingIds.sort());
    expect(endingHints['public_trust-overheat']).toBe('Push public trust to its limit.');
  });

  it('labels main and boundary ending categories', () => {
    expect(endingCategoryLabel(MAIN_ENDINGS.partial)).toBe('Three main endings');
    expect(endingCategoryLabel(BOUNDARY_ENDINGS['funding-collapse']!)).toBe(
      'Twelve boundary endings',
    );
  });

  it('proposal-funded ending is reachable from at least one seeded random-policy run', () => {
    const results = Array.from({ length: 500 }, (_, offset) => simulateRun(42 + offset, 'random'));

    expect(results.some((result) => result.endingId === 'proposal-funded')).toBe(true);
  });

  it('partial ending is reachable from at least one seeded random-policy run', () => {
    const results = Array.from({ length: 500 }, (_, offset) => simulateRun(42 + offset, 'random'));

    expect(results.some((result) => result.endingId === 'partial')).toBe(true);
  });

  it('canceled ending is reachable from at least one seeded random-policy run', () => {
    const results = Array.from({ length: 500 }, (_, offset) => simulateRun(42 + offset, 'random'));

    expect(results.some((result) => result.endingId === 'canceled')).toBe(true);
  });
});
