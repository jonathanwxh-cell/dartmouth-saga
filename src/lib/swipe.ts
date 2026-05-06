export type SwipeSide = 'left' | 'right';

export function commitThreshold(viewportWidth: number) {
  return Math.max(90, viewportWidth * 0.28);
}

export function swipeSideFromDelta(delta: number, threshold: number): SwipeSide | null {
  if (delta <= -threshold) return 'left';
  if (delta >= threshold) return 'right';
  return null;
}
