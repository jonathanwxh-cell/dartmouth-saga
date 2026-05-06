import { useGameStore } from './store';

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().init(1);
  });

  it('init(seed) populates currentCard and resets qualities to 50', () => {
    const state = useGameStore.getState();

    expect(state.currentCard).not.toBeNull();
    expect(Object.values(state.qualities)).toEqual([50, 50, 50, 50, 50, 50]);
  });

  it("swipe('left') applies effects and advances to a new card", () => {
    const first = useGameStore.getState().currentCard;
    if (!first) throw new Error('Expected an opening card.');

    useGameStore.getState().swipe('left');
    const state = useGameStore.getState();

    expect(state.seenIds.has(first.id)).toBe(true);
    expect(state.qualities).not.toEqual(Object.fromEntries(Object.keys(state.qualities).map((key) => [key, 50])));
    expect(state.currentCard?.id).not.toBe(first.id);
  });

  it('swipe sequence ends with currentCard === null when pool exhausted', () => {
    for (let index = 0; index < 10; index += 1) {
      if (!useGameStore.getState().currentCard) break;
      useGameStore.getState().swipe('left');
    }

    expect(useGameStore.getState().currentCard).toBeNull();
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
});
