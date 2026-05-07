import { del, get, set } from 'idb-keyval';
import type { Era, GameState, Quality } from '../engine/types';
import type { GameOver } from './store';

const SNAPSHOT_KEY = 'dartmouth-saga:v2';
const LEGACY_SNAPSHOT_KEY = 'dartmouth-saga:v1';
const SNAPSHOT_VERSION = 2;

export interface SnapshotSource extends Pick<GameState, 'qualities' | 'flags' | 'seenIds' | 'currentCard' | 'era'> {
  gameOver: GameOver | null;
  seed: number;
  tutorialSeen: boolean;
  swipesThisRun: number;
}

interface PersistedSnapshot {
  version: 1 | typeof SNAPSHOT_VERSION;
  seed: number;
  qualities: Record<Quality, number>;
  flags: string[];
  seenIds: string[];
  currentCardId: string | null;
  era: Era;
  gameOver: GameOver | null;
  tutorialSeen: boolean;
  swipesThisRun?: number;
}

export interface LoadedSnapshot
  extends Omit<PersistedSnapshot, 'version' | 'flags' | 'seenIds' | 'swipesThisRun'> {
  flags: Set<string>;
  seenIds: Set<string>;
  swipesThisRun: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPersistedSnapshot(value: unknown): value is PersistedSnapshot {
  if (!isRecord(value)) return false;
  if (value.version !== SNAPSHOT_VERSION && value.version !== 1) return false;
  if (typeof value.seed !== 'number') return false;
  if (!isRecord(value.qualities)) return false;
  if (!Array.isArray(value.flags) || !Array.isArray(value.seenIds)) return false;
  if (typeof value.tutorialSeen !== 'boolean') return false;
  if (value.version === SNAPSHOT_VERSION && typeof value.swipesThisRun !== 'number') return false;
  if (typeof value.currentCardId !== 'string' && value.currentCardId !== null) return false;
  return typeof value.era === 'string';
}

export async function saveSnapshot(state: SnapshotSource) {
  const snapshot: PersistedSnapshot = {
    version: SNAPSHOT_VERSION,
    seed: state.seed,
    qualities: state.qualities,
    flags: Array.from(state.flags),
    seenIds: Array.from(state.seenIds),
    currentCardId: state.currentCard?.id ?? null,
    era: state.era,
    gameOver: state.gameOver,
    tutorialSeen: state.tutorialSeen,
    swipesThisRun: state.swipesThisRun
  };

  await set(SNAPSHOT_KEY, snapshot);
}

export async function loadSnapshot(): Promise<LoadedSnapshot | null> {
  const currentSnapshot = await get(SNAPSHOT_KEY);
  const snapshot = isPersistedSnapshot(currentSnapshot)
    ? currentSnapshot
    : await get(LEGACY_SNAPSHOT_KEY);
  if (!isPersistedSnapshot(snapshot)) return null;

  return {
    seed: snapshot.seed,
    qualities: snapshot.qualities,
    flags: new Set(snapshot.flags),
    seenIds: new Set(snapshot.seenIds),
    currentCardId: snapshot.currentCardId,
    era: snapshot.era,
    gameOver: snapshot.gameOver,
    tutorialSeen: snapshot.tutorialSeen,
    swipesThisRun: snapshot.swipesThisRun ?? 0
  };
}

export async function clearSnapshot() {
  await del(SNAPSHOT_KEY);
  await del(LEGACY_SNAPSHOT_KEY);
}
