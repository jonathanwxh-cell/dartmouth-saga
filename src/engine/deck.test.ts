import { selectNextCard } from './deck';
import { createRng } from './rng';
import { makeCard, makeState } from './testFixtures';

describe('selectNextCard', () => {
  it('filters cards by era', () => {
    const state = makeState({ era: '1956' });
    const pool = [makeCard({ id: 'a', era: '1956' }), makeCard({ id: 'b', era: '1974' })];

    expect(selectNextCard(state, pool, () => 0)?.id).toBe('a');
  });

  it('filters by requires range (inclusive on both ends)', () => {
    const low = makeCard({ id: 'low', requires: { funding: [10, 50] } });
    const high = makeCard({ id: 'high', requires: { funding: [50, 90] } });
    const out = makeCard({ id: 'out', requires: { funding: [51, 100] } });

    const picks = new Set([
      selectNextCard(makeState(), [low, high, out], () => 0)?.id,
      selectNextCard(makeState(), [low, high, out], () => 0.51)?.id
    ]);

    expect(picks).toEqual(new Set(['low', 'high']));
  });

  it('filters by flags_required (all must match) and flags_forbidden (none may match)', () => {
    const state = makeState({ flags: new Set(['ready', 'warned']) });
    const pool = [
      makeCard({ id: 'match', flags_required: ['ready'], flags_forbidden: ['blocked'] }),
      makeCard({ id: 'missing', flags_required: ['ready', 'funded'] }),
      makeCard({ id: 'forbidden', flags_forbidden: ['warned'] })
    ];

    expect(selectNextCard(state, pool, () => 0)?.id).toBe('match');
  });

  it('respects one_shot via seenIds', () => {
    const pool = [makeCard({ id: 'seen', one_shot: true }), makeCard({ id: 'repeatable' })];
    const state = makeState({ seenIds: new Set(['seen']) });

    expect(selectNextCard(state, pool, () => 0)?.id).toBe('repeatable');
  });

  it('weighted selection is deterministic for a given seed', () => {
    const pool = [makeCard({ id: 'light', weight: 1 }), makeCard({ id: 'heavy', weight: 3 })];
    const rngA = createRng(42);
    const rngB = createRng(42);
    const counts = { light: 0, heavy: 0 };
    const sequenceA: string[] = [];
    const sequenceB: string[] = [];

    for (let index = 0; index < 1000; index += 1) {
      const pickA = selectNextCard(makeState(), pool, rngA);
      const pickB = selectNextCard(makeState(), pool, rngB);
      if (!pickA || !pickB) throw new Error('Expected a weighted pick.');
      counts[pickA.id as 'light' | 'heavy'] += 1;
      sequenceA.push(pickA.id);
      sequenceB.push(pickB.id);
    }

    expect(sequenceA).toEqual(sequenceB);
    expect(counts.light / 1000).toBeGreaterThan(0.2);
    expect(counts.light / 1000).toBeLessThan(0.3);
    expect(counts.heavy / 1000).toBeGreaterThan(0.7);
    expect(counts.heavy / 1000).toBeLessThan(0.8);
  });

  it('returns null when no cards are eligible', () => {
    const state = makeState({ era: '1956' });

    expect(selectNextCard(state, [makeCard({ era: '1974' })], () => 0)).toBeNull();
  });

  it('nextCardId override selects the named card directly', () => {
    const pool = [makeCard({ id: 'other', weight: 100 }), makeCard({ id: 'target' })];

    expect(selectNextCard(makeState(), pool, () => 0, 'target')?.id).toBe('target');
  });
});
