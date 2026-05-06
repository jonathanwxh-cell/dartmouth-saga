import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { selectNextCard } from '../engine/deck';
import { loadCards } from '../engine/loadCards';
import { applyChoice } from '../engine/resolver';
import { createRng, type Rng } from '../engine/rng';
import type { Card, Era, GameState, Quality } from '../engine/types';

const qualityKeys: Quality[] = [
  'symbolic_progress',
  'funding',
  'public_trust',
  'academic_credibility',
  'compute',
  'team_morale'
];

type SwipeSide = 'left' | 'right';

interface GameStore extends GameState {
  rng: Rng;
  pool: Card[];
  init: (seed?: number) => void;
  swipe: (side: SwipeSide) => void;
}

function initialQualities() {
  return Object.fromEntries(qualityKeys.map((quality) => [quality, 50])) as Record<Quality, number>;
}

function baseState(era: Era = '1956'): GameState {
  return {
    qualities: initialQualities(),
    flags: new Set(),
    seenIds: new Set(),
    currentCard: null,
    era
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...baseState(),
      rng: createRng(1956),
      pool: [],
      init: (seed = 1956) => {
        const rng = createRng(seed);
        const pool = loadCards();
        const state = baseState();
        const currentCard = selectNextCard(state, pool, rng);
        set({ ...state, currentCard, pool, rng }, false, 'game/init');
      },
      swipe: (side) => {
        const { currentCard, pool, rng } = get();
        if (!currentCard) return;

        const result = applyChoice(get(), currentCard, side);
        const nextCard = selectNextCard(result.state, pool, rng, result.event.nextCardId);
        set({ ...result.state, currentCard: nextCard }, false, 'game/swipe');
      }
    }),
    { name: 'Dartmouth Saga' }
  )
);
