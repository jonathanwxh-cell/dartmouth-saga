import type { GameState, Quality } from './types';

export function checkBoundaryEnd(
  state: GameState
): { quality: Quality; kind: 'collapse' | 'overheat' } | null {
  for (const [quality, value] of Object.entries(state.qualities) as Array<[Quality, number]>) {
    if (value <= 0) return { quality, kind: 'collapse' };
    if (value >= 100) return { quality, kind: 'overheat' };
  }

  return null;
}
