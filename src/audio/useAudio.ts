import { useEffect } from 'react';
import { audioEngine } from './audioEngine';
import { useGameStore } from '../state/store';

const eraTrack = '/audio/era-1956.mp3';

export function useAudio() {
  const currentCard = useGameStore((state) => state.currentCard);
  const muted = useGameStore((state) => state.audioMuted);

  useEffect(() => {
    audioEngine.load(eraTrack);
    return audioEngine.subscribeMuted((nextMuted) => {
      useGameStore.setState({ audioMuted: nextMuted }, false, 'audio/sync-muted');
    });
  }, []);

  useEffect(() => {
    audioEngine.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (currentCard) audioEngine.play();
  }, [currentCard]);
}
