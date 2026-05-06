import { useGameStore } from './store';
import type { Card } from '../engine/types';

function neutralizeEffects(card: Card): Card {
  return {
    ...card,
    left: { ...card.left, effects: {} },
    right: { ...card.right, effects: {} },
  };
}

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().init(1);
  });

  it('init(seed) populates currentCard and resets qualities to 50', () => {
    const state = useGameStore.getState();

    expect(state.currentCard).not.toBeNull();
    expect(state.gameOver).toBeNull();
    expect(Object.values(state.qualities)).toEqual([50, 50, 50, 50, 50, 50]);
  });

  it("swipe('left') applies effects and advances to a new card", () => {
    const first = useGameStore.getState().currentCard;
    if (!first) throw new Error('Expected an opening card.');

    useGameStore.getState().swipe('left');
    const state = useGameStore.getState();

    expect(state.seenIds.has(first.id)).toBe(true);
    expect(state.qualities).not.toEqual(
      Object.fromEntries(Object.keys(state.qualities).map((key) => [key, 50])),
    );
    expect(state.currentCard?.id).not.toBe(first.id);
  });

  it('swipe sequence ends with currentCard === null when pool exhausted', () => {
    const state = useGameStore.getState();
    useGameStore.setState({
      currentCard: state.currentCard ? neutralizeEffects(state.currentCard) : null,
      pool: state.pool.map(neutralizeEffects),
    });

    for (let index = 0; index < 120; index += 1) {
      const state = useGameStore.getState();
      if (!state.currentCard || state.gameOver) break;
      useGameStore.getState().swipe('left');
    }

    expect(useGameStore.getState().currentCard).toBeNull();
    expect(useGameStore.getState().gameOver).toEqual({ reason: 'pool-exhausted' });
  });

  it('init(42) produces the same first card and same sequence over 10 swipes', () => {
    const readSequence = () => {
      useGameStore.getState().init(42);
      const ids: Array<string | null> = [];

      for (let index = 0; index < 10; index += 1) {
        ids.push(useGameStore.getState().currentCard?.id ?? null);
        useGameStore.getState().swipe('left');
      }

      return ids;
    };

    expect(readSequence()).toEqual(readSequence());
  });

  it("swipe sets gameOver with reason='boundary' when a quality crosses 0 or 100", () => {
    const card = useGameStore.getState().currentCard;
    if (!card) throw new Error('Expected a current card.');
    useGameStore.setState({
      currentCard: { ...card, left: { label: 'Crash', effects: { funding: -100 } } },
    });

    useGameStore.getState().swipe('left');

    expect(useGameStore.getState().gameOver).toEqual({
      reason: 'boundary',
      quality: 'funding',
      kind: 'collapse',
    });
  });

  it("swipe sets gameOver with reason='pool-exhausted' when no eligible cards remain and no boundary hit", () => {
    const card = useGameStore.getState().currentCard;
    if (!card) throw new Error('Expected a current card.');
    useGameStore.setState({
      currentCard: { ...card, left: { label: 'Nudge', effects: { funding: -1 } } },
      pool: [],
    });

    useGameStore.getState().swipe('left');

    expect(useGameStore.getState().currentCard).toBeNull();
    expect(useGameStore.getState().gameOver).toEqual({ reason: 'pool-exhausted' });
  });

  it('reset() clears gameOver and re-inits', () => {
    useGameStore.setState({ gameOver: { reason: 'pool-exhausted' }, currentCard: null });

    useGameStore.getState().reset();

    expect(useGameStore.getState().gameOver).toBeNull();
    expect(useGameStore.getState().currentCard).not.toBeNull();
  });
});
