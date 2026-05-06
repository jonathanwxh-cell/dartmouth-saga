import { commitThreshold, swipeSideFromDelta } from './swipe';

describe('swipe helpers', () => {
  it('commitThreshold returns ~35% of viewport width', () => {
    expect(commitThreshold(1000)).toBe(350);
    expect(commitThreshold(375)).toBeCloseTo(131.25);
  });

  it("swipeSideFromDelta returns 'left' for delta below -threshold, 'right' for above +threshold, null otherwise", () => {
    expect(swipeSideFromDelta(-140, 120)).toBe('left');
    expect(swipeSideFromDelta(140, 120)).toBe('right');
    expect(swipeSideFromDelta(-119, 120)).toBeNull();
    expect(swipeSideFromDelta(119, 120)).toBeNull();
  });
});
