import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { audioEngine } from '../audio/audioEngine';
import { selectNextCard } from '../engine/deck';
import { checkBoundaryEnd } from '../engine/endings';
import { selectEnding } from '../endings/era-1956';
import { loadCards } from '../engine/loadCards';
import { applyChoice } from '../engine/resolver';
import { createRng, type Rng } from '../engine/rng';
import type { Card, EngineEvent, Era, GameState, Quality } from '../engine/types';
import {
  clearEndingStats as clearEndingStatsStorage,
  loadEndingStats,
  recordEndingDiscovered,
  saveEndingStats,
  type EndingStats
} from './endingStats';
import { clearSnapshot, loadSnapshot, saveSnapshot, type LoadedSnapshot } from './save';

const qualityKeys: Quality[] = [
  'symbolic_progress', 'funding', 'public_trust',
  'academic_credibility', 'compute', 'team_morale'
];

type SwipeSide = 'left' | 'right';
type BoundaryKind = 'collapse' | 'overheat';
const tutorialKey = 'dartmouth-saga:tutorial-seen';

export type GameOver =
  | { reason: 'boundary'; quality: Quality; kind: BoundaryKind }
  | { reason: 'pool-exhausted' };

export interface GameStore extends GameState {
  gameOver: GameOver | null;
  rng: Rng;
  pool: Card[];
  audioMuted: boolean;
  seed: number;
  lastEvent: EngineEvent | null;
  tutorialSeen: boolean;
  hasSave: boolean;
  endingStats: EndingStats;
  swipesThisRun: number;
  lastDiscoveryWasNew: boolean;
  init: (seed?: number) => void;
  reset: () => void;
  setAudioMuted: (muted: boolean) => void;
  swipe: (side: SwipeSide) => void;
  markTutorialSeen: () => void;
  continueSavedGame: () => Promise<boolean>;
  refreshSaveStatus: () => Promise<void>;
  clearEndingStats: () => void;
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

function readTutorialSeen() {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(tutorialKey) === '1';
}

function writeTutorialSeen() {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(tutorialKey, '1');
}

function buildRun(seed: number) {
  const rng = createRng(seed);
  const pool = loadCards();
  const state = baseState();
  const currentCard = selectNextCard(state, pool, rng);

  return {
    ...state,
    currentCard,
    gameOver: null,
    pool,
    rng,
    seed,
    lastEvent: null,
    swipesThisRun: 0,
    lastDiscoveryWasNew: false
  };
}

function hasPlayableSnapshot(snapshot: LoadedSnapshot | null) {
  return Boolean(snapshot?.currentCardId || snapshot?.gameOver);
}

function rebuildFromSnapshot(snapshot: LoadedSnapshot) {
  const rng = createRng(snapshot.seed);
  const pool = loadCards();
  const seenIds = new Set(snapshot.seenIds);
  const state = {
    qualities: snapshot.qualities,
    flags: new Set(snapshot.flags),
    seenIds,
    currentCard: null,
    era: snapshot.era
  };

  const draws = seenIds.size + (snapshot.currentCardId ? 1 : 0);
  for (let index = 0; index < draws; index += 1) rng();

  const savedCard = snapshot.currentCardId
    ? pool.find((card) => card.id === snapshot.currentCardId) ?? null
    : null;
  const currentCard = savedCard ?? (snapshot.gameOver ? null : selectNextCard(state, pool, rng));

  return {
    ...state,
    currentCard,
    gameOver: snapshot.gameOver,
    pool,
    rng,
    seed: snapshot.seed,
    lastEvent: null,
    tutorialSeen: snapshot.tutorialSeen || readTutorialSeen(),
    endingStats: loadEndingStats(),
    swipesThisRun: snapshot.swipesThisRun,
    lastDiscoveryWasNew: false
  };
}

function endingProgressFor(
  state: GameState,
  gameOver: GameOver,
  endingStats: EndingStats
): Pick<GameStore, 'endingStats' | 'lastDiscoveryWasNew'> {
  const ending = selectEnding(state, gameOver);
  const previousCount = endingStats.discovered[ending.id]?.count ?? 0;
  const nextEndingStats = recordEndingDiscovered(endingStats, ending.id);
  saveEndingStats(nextEndingStats);

  return {
    endingStats: nextEndingStats,
    lastDiscoveryWasNew: previousCount === 0
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...baseState(),
      gameOver: null,
      rng: createRng(1956),
      pool: [],
      audioMuted: audioEngine.getMuted(),
      seed: 1956,
      lastEvent: null,
      tutorialSeen: readTutorialSeen(),
      hasSave: false,
      endingStats: loadEndingStats(),
      swipesThisRun: 0,
      lastDiscoveryWasNew: false,
      init: (seed = 1956) => {
        void clearSnapshot().catch(() => undefined);
        set({ ...buildRun(seed), hasSave: false, endingStats: loadEndingStats() }, false, 'game/init');
      },
      reset: () => {
        get().init();
      },
      setAudioMuted: (muted) => {
        audioEngine.setMuted(muted);
        set({ audioMuted: audioEngine.getMuted() }, false, 'audio/set-muted');
        void saveSnapshot(get()).catch(() => undefined);
      },
      swipe: (side) => {
        const { currentCard, gameOver, pool, rng, swipesThisRun, endingStats, qualities, flags, seenIds, era } = get();
        if (gameOver || !currentCard) return;

        const result = applyChoice({ qualities, flags, seenIds, currentCard, era }, currentCard, side);
        const nextSwipeCount = swipesThisRun + 1;
        const boundary = checkBoundaryEnd(result.state);
        if (boundary) {
          const nextGameOver: GameOver = { reason: 'boundary', ...boundary };
          set(
            {
              ...result.state,
              gameOver: nextGameOver,
              lastEvent: result.event,
              hasSave: true,
              swipesThisRun: nextSwipeCount,
              ...endingProgressFor(result.state, nextGameOver, endingStats)
            },
            false,
            'game/swipe-boundary-end'
          );
          void saveSnapshot(get()).catch(() => undefined);
          return;
        }

        const nextCard = selectNextCard(result.state, pool, rng, result.event.nextCardId);
        if (!nextCard) {
          const nextGameOver: GameOver = { reason: 'pool-exhausted' };
          set(
            {
              ...result.state,
              currentCard: null,
              gameOver: nextGameOver,
              lastEvent: result.event,
              hasSave: true,
              swipesThisRun: nextSwipeCount,
              ...endingProgressFor(result.state, nextGameOver, endingStats)
            },
            false,
            'game/swipe-pool-exhausted'
          );
          void saveSnapshot(get()).catch(() => undefined);
          return;
        }

        set(
          {
            ...result.state,
            currentCard: nextCard,
            gameOver: null,
            lastEvent: result.event,
            hasSave: true,
            swipesThisRun: nextSwipeCount,
            lastDiscoveryWasNew: false
          },
          false,
          'game/swipe'
        );
        void saveSnapshot(get()).catch(() => undefined);
      },
      markTutorialSeen: () => {
        writeTutorialSeen();
        set({ tutorialSeen: true }, false, 'tutorial/seen');
        void saveSnapshot(get()).catch(() => undefined);
      },
      continueSavedGame: async () => {
        const snapshot = await loadSnapshot().catch(() => null);
        if (!snapshot) {
          set({ hasSave: false }, false, 'save/missing');
          return false;
        }

        set(
          { ...rebuildFromSnapshot(snapshot), hasSave: hasPlayableSnapshot(snapshot) },
          false,
          'save/continue'
        );
        return true;
      },
      refreshSaveStatus: async () => {
        const snapshot = await loadSnapshot().catch(() => null);
        set({ hasSave: hasPlayableSnapshot(snapshot) }, false, 'save/status');
      },
      clearEndingStats: () => {
        clearEndingStatsStorage();
        set({ endingStats: loadEndingStats() }, false, 'ending-stats/clear');
      }
    }),
    { name: 'Dartmouth Saga' }
  )
);
