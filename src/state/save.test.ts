import type { GameOver } from './store';
import { clearSnapshot, loadSnapshot, saveSnapshot } from './save';
import { makeCard, makeState } from '../engine/testFixtures';

const memory = new Map<string, unknown>();

vi.mock('idb-keyval', () => ({
  get: vi.fn((key: string) => Promise.resolve(memory.get(key))),
  set: vi.fn((key: string, value: unknown) => {
    memory.set(key, value);
    return Promise.resolve();
  }),
  del: vi.fn((key: string) => {
    memory.delete(key);
    return Promise.resolve();
  })
}));

function makeSnapshotSource() {
  const state = makeState({
    flags: new Set(['press-called', 'demo-promised']),
    seenIds: new Set(['arrival-mccarthy-greeting', 'arrival-the-proposal']),
    currentCard: makeCard({ id: 'middle-logic-theorist-demo-1' })
  });
  const gameOver: GameOver | null = null;

  return {
    ...state,
    gameOver,
    seed: 1956,
    tutorialSeen: true
  };
}

describe('saveSnapshot', () => {
  beforeEach(() => {
    memory.clear();
  });

  it('saveSnapshot then loadSnapshot returns equivalent state', async () => {
    const source = makeSnapshotSource();

    await saveSnapshot(source);
    const loaded = await loadSnapshot();

    expect(loaded).toMatchObject({
      qualities: source.qualities,
      currentCardId: source.currentCard?.id,
      era: source.era,
      gameOver: source.gameOver,
      seed: source.seed,
      tutorialSeen: source.tutorialSeen
    });
  });

  it('Set fields round-trip correctly through Array serialization', async () => {
    await saveSnapshot(makeSnapshotSource());
    const loaded = await loadSnapshot();

    expect(loaded?.flags).toEqual(new Set(['press-called', 'demo-promised']));
    expect(loaded?.seenIds).toEqual(new Set(['arrival-mccarthy-greeting', 'arrival-the-proposal']));
  });

  it('loadSnapshot returns null when key is missing', async () => {
    await expect(loadSnapshot()).resolves.toBeNull();
  });

  it('clearSnapshot removes the saved key', async () => {
    await saveSnapshot(makeSnapshotSource());

    await clearSnapshot();

    await expect(loadSnapshot()).resolves.toBeNull();
  });
});
