import { commitThreshold, swipeSideFromDelta } from './swipe';

describe('swipe helpers', () => {
  it('commitThreshold returns 28% of viewport width with a 90px floor', () => {
    expect(commitThreshold(1000)).toBe(280);
    expect(commitThreshold(375)).toBeCloseTo(105);
  });

  it("swipeSideFromDelta returns 'left' for delta below -threshold, 'right' for above +threshold, null otherwise", () => {
    expect(swipeSideFromDelta(-140, 120)).toBe('left');
    expect(swipeSideFromDelta(140, 120)).toBe('right');
    expect(swipeSideFromDelta(-119, 120)).toBeNull();
    expect(swipeSideFromDelta(119, 120)).toBeNull();
  });
});
