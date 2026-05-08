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
    vi.clearAllMocks();
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

  it('loads sounds through the html5 audio path', async () => {
    const { Howl } = await import('howler');
    const { audioEngine } = await import('./audioEngine');

    audioEngine.load('/audio/test.mp3');

    expect(Howl).toHaveBeenCalledWith(
      expect.objectContaining({
        html5: true
      })
    );
  });

  it('unlock() does nothing when sound is not loaded', async () => {
    const { audioEngine } = await import('./audioEngine');

    expect(() => audioEngine.unlock()).not.toThrow();
  });

  it('unlock() calls play on the loaded sound when not already playing', async () => {
    const { Howl } = await import('howler');
    const { audioEngine } = await import('./audioEngine');

    audioEngine.load('/audio/test.mp3');
    audioEngine.unlock();

    const sound = vi.mocked(Howl).mock.results[0]?.value;
    expect(sound.play).toHaveBeenCalledOnce();
  });
});
