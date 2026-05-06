import { applyChoice } from './resolver';
import { makeCard, makeState } from './testFixtures';

describe('applyChoice', () => {
  it('applies effects additively and clamps to 0..100', () => {
    const state = makeState({ qualities: { ...makeState().qualities, funding: 95, compute: 3 } });
    const card = makeCard({
      left: { label: 'Spend', effects: { funding: 20, compute: -8 } }
    });

    const result = applyChoice(state, card, 'left');

    expect(result.state.qualities.funding).toBe(100);
    expect(result.state.qualities.compute).toBe(0);
    expect(result.event.changes.funding).toEqual({ from: 95, to: 100, delta: 20 });
  });

  it('adds flags from the chosen side', () => {
    const card = makeCard({ right: { label: 'Signal', effects: {}, flags: ['letter-sent'] } });

    const result = applyChoice(makeState(), card, 'right');

    expect(result.state.flags.has('letter-sent')).toBe(true);
    expect(result.event.flagsAdded).toEqual(['letter-sent']);
  });

  it('records the card id in seenIds', () => {
    const result = applyChoice(makeState(), makeCard({ id: 'seen-card' }), 'left');

    expect(result.state.seenIds.has('seen-card')).toBe(true);
  });

  it('does not mutate the input state', () => {
    const state = makeState({ flags: new Set(['original']) });
    const card = makeCard({
      left: { label: 'Shift', effects: { funding: -70 }, flags: ['new-flag'] }
    });

    applyChoice(state, card, 'left');

    expect(state.qualities.funding).toBe(50);
    expect(state.flags).toEqual(new Set(['original']));
    expect(state.seenIds.size).toBe(0);
  });

  it('throws clearly when nextCardId points to a one-shot card already in seenIds', () => {
    const state = makeState({ seenIds: new Set(['already-seen']) });
    const card = makeCard({
      right: { label: 'Continue', effects: {}, nextCardId: 'already-seen' }
    });

    expect(() => applyChoice(state, card, 'right')).toThrow(/already-seen.*one-shot/i);
  });
});
