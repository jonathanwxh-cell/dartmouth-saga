import { checkBoundaryEnd } from './endings';
import { makeState } from './testFixtures';

describe('checkBoundaryEnd', () => {
  it('returns null when all qualities are between 1 and 99', () => {
    expect(checkBoundaryEnd(makeState())).toBeNull();
  });

  it('returns collapse for quality at 0', () => {
    const state = makeState({ qualities: { ...makeState().qualities, funding: 0 } });

    expect(checkBoundaryEnd(state)).toEqual({ quality: 'funding', kind: 'collapse' });
  });

  it('returns overheat for quality at 100', () => {
    const state = makeState({ qualities: { ...makeState().qualities, compute: 100 } });

    expect(checkBoundaryEnd(state)).toEqual({ quality: 'compute', kind: 'overheat' });
  });

  it('returns the first quality found when multiple are at extremes', () => {
    const state = makeState({
      qualities: { ...makeState().qualities, symbolic_progress: 100, funding: 0 }
    });

    expect(checkBoundaryEnd(state)).toEqual({ quality: 'symbolic_progress', kind: 'overheat' });
  });
});
