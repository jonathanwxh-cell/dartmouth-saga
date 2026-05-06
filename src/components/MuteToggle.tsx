import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../state/store';

function MuteToggle() {
  const muted = useGameStore((state) => state.audioMuted);
  const setAudioMuted = useGameStore((state) => state.setAudioMuted);
  const Icon = muted ? VolumeX : Volume2;
  const label = muted ? 'Unmute audio' : 'Mute audio';

  return (
    <button
      aria-label={label}
      aria-pressed={muted}
      className="mute-toggle"
      onClick={() => setAudioMuted(!muted)}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" size={18} />
    </button>
  );
}

export default MuteToggle;
