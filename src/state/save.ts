import { del, get, set } from 'idb-keyval';
import type { Era, GameState, Quality } from '../engine/types';
import type { GameOver } from './store';

const SNAPSHOT_KEY = 'dartmouth-saga:v1';
const SNAPSHOT_VERSION = 1;

export interface SnapshotSource extends Pick<GameState, 'qualities' | 'flags' | 'seenIds' | 'currentCard' | 'era'> {
  gameOver: GameOver | null;
  seed: number;
  tutorialSeen: boolean;
}

interface PersistedSnapshot {
  version: typeof SNAPSHOT_VERSION;
  seed: number;
  qualities: Record<Quality, number>;
  flags: string[];
  seenIds: string[];
  currentCardId: string | null;
  era: Era;
  gameOver: GameOver | null;
  tutorialSeen: boolean;
}

export interface LoadedSnapshot
  extends Omit<PersistedSnapshot, 'version' | 'flags' | 'seenIds'> {
  flags: Set<string>;
  seenIds: Set<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPersistedSnapshot(value: unknown): value is PersistedSnapshot {
  if (!isRecord(value)) return false;
  if (value.version !== SNAPSHOT_VERSION) return false;
  if (typeof value.seed !== 'number') return false;
  if (!isRecord(value.qualities)) return false;
  if (!Array.isArray(value.flags) || !Array.isArray(value.seenIds)) return false;
  if (typeof value.tutorialSeen !== 'boolean') return false;
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
    tutorialSeen: state.tutorialSeen
  };

  await set(SNAPSHOT_KEY, snapshot);
}

export async function loadSnapshot(): Promise<LoadedSnapshot | null> {
  const snapshot = await get(SNAPSHOT_KEY);
  if (!isPersistedSnapshot(snapshot)) return null;

  return {
    seed: snapshot.seed,
    qualities: snapshot.qualities,
    flags: new Set(snapshot.flags),
    seenIds: new Set(snapshot.seenIds),
    currentCardId: snapshot.currentCardId,
    era: snapshot.era,
    gameOver: snapshot.gameOver,
    tutorialSeen: snapshot.tutorialSeen
  };
}

export async function clearSnapshot() {
  await del(SNAPSHOT_KEY);
}
