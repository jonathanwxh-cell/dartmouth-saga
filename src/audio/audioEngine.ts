import { Howl } from 'howler';

const DEFAULT_VOLUME = 0.4;
const FADE_IN_MS = 2000;

export const AUDIO_MUTED_STORAGE_KEY = 'dartmouth-saga:audio-muted';

type MutedSubscriber = (muted: boolean) => void;

function readStoredMuted() {
  try {
    return globalThis.localStorage?.getItem(AUDIO_MUTED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeStoredMuted(muted: boolean) {
  try {
    globalThis.localStorage?.setItem(AUDIO_MUTED_STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Private browsing or locked-down embeds can reject storage writes.
  }
}

class AudioEngine {
  private muted = readStoredMuted();
  private sound: Howl | null = null;
  private src: string | null = null;
  private subscribers = new Set<MutedSubscriber>();

  load(src: string) {
    if (this.sound && this.src === src) return;

    this.sound?.unload();
    this.src = src;
    this.sound = new Howl({
      src: [src],
      loop: true,
      volume: DEFAULT_VOLUME,
      html5: true,
      mute: this.muted
    });
  }

  play() {
    if (!this.sound || this.sound.playing()) return;

    const id = this.sound.play();
    this.sound.volume(0, id);
    this.sound.fade(0, DEFAULT_VOLUME, FADE_IN_MS, id);
  }

  unlock() {
    if (!this.sound || this.sound.playing()) return;

    const id = this.sound.play();
    this.sound.volume(0, id);
    this.sound.fade(0, DEFAULT_VOLUME, FADE_IN_MS, id);
  }

  stop() {
    this.sound?.stop();
  }

  setMuted(muted: boolean) {
    if (this.muted === muted) return;

    this.muted = muted;
    writeStoredMuted(muted);
    this.sound?.mute(muted);
    this.subscribers.forEach((subscriber) => subscriber(muted));
  }

  getMuted() {
    return this.muted;
  }

  subscribeMuted(subscriber: MutedSubscriber) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
}

export const audioEngine = new AudioEngine();
