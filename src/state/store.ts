import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { selectNextCard } from '../engine/deck';
import { checkBoundaryEnd } from '../engine/endings';
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
type BoundaryKind = 'collapse' | 'overheat';

export type GameOver =
  | { reason: 'boundary'; quality: Quality; kind: BoundaryKind }
  | { reason: 'pool-exhausted' };

interface GameStore extends GameState {
  gameOver: GameOver | null;
  rng: Rng;
  pool: Card[];
  init: (seed?: number) => void;
  reset: () => void;
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
      gameOver: null,
      rng: createRng(1956),
      pool: [],
      init: (seed = 1956) => {
        const rng = createRng(seed);
        const pool = loadCards();
        const state = baseState();
        const currentCard = selectNextCard(state, pool, rng);
        set({ ...state, currentCard, gameOver: null, pool, rng }, false, 'game/init');
      },
      reset: () => {
        get().init();
      },
      swipe: (side) => {
        const { currentCard, gameOver, pool, rng } = get();
        if (gameOver || !currentCard) return;

        const result = applyChoice(get(), currentCard, side);
        const boundary = checkBoundaryEnd(result.state);
        if (boundary) {
          set(
            { ...result.state, gameOver: { reason: 'boundary', ...boundary } },
            false,
            'game/swipe-boundary-end'
          );
          return;
        }

        const nextCard = selectNextCard(result.state, pool, rng, result.event.nextCardId);
        if (!nextCard) {
          set(
            { ...result.state, currentCard: null, gameOver: { reason: 'pool-exhausted' } },
            false,
            'game/swipe-pool-exhausted'
          );
          return;
        }

        set({ ...result.state, currentCard: nextCard, gameOver: null }, false, 'game/swipe');
      }
    }),
    { name: 'Dartmouth Saga' }
  )
);
