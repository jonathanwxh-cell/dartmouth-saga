export type SwipeSide = 'left' | 'right';

export function commitThreshold(viewportWidth: number) {
  return viewportWidth * 0.35;
}

export function swipeSideFromDelta(delta: number, threshold: number): SwipeSide | null {
  if (delta <= -threshold) return 'left';
  if (delta >= threshold) return 'right';
  return null;
}
