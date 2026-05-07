import { useEffect } from 'react';
import { useGameStore } from '../state/store';

export function useActAttribute() {
  const currentCardId = useGameStore((state) => state.currentCard?.id);
  const flags = useGameStore((state) => state.flags);

  useEffect(() => {
    const act = flags.has('closing-started')
      ? 'closing'
      : flags.has('middle-started')
        ? 'middle'
        : 'opening';
    document.body.dataset.act = act;
  }, [currentCardId, flags]);
}
