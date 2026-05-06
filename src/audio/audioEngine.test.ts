import { vi } from 'vitest';

vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    fade: vi.fn(),
    mute: vi.fn(),
    play: vi.fn(() => 1),
    playing: vi.fn(() => false),
    stop: vi.fn(),
    unload: vi.fn(),
    volume: vi.fn()
  }))
}));

const storageKey = 'dartmouth-saga:audio-muted';

describe('audioEngine', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it('setMuted(true) sets internal state and notifies subscribers', async () => {
    const { audioEngine } = await import('./audioEngine');
    const subscriber = vi.fn();

    const unsubscribe = audioEngine.subscribeMuted(subscriber);
    audioEngine.setMuted(true);

    expect(audioEngine.getMuted()).toBe(true);
    expect(localStorage.getItem(storageKey)).toBe('1');
    expect(subscriber).toHaveBeenCalledWith(true);

    unsubscribe();
    audioEngine.setMuted(false);

    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it('getMuted reads from localStorage on init when key is set', async () => {
    localStorage.setItem(storageKey, '1');

    const { audioEngine } = await import('./audioEngine');

    expect(audioEngine.getMuted()).toBe(true);
  });
});
