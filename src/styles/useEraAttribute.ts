import { useEffect } from 'react';
import { useGameStore } from '../state/store';

export function useEraAttribute() {
  const era = useGameStore((state) => state.era);

  useEffect(() => {
    document.body.dataset.era = era;
  }, [era]);
}
