import { dailySeed } from './dailyChallenge';

describe('dailySeed', () => {
  it('same date produces same seed', () => {
    const date = new Date(1956, 5, 18, 9, 30);

    expect(dailySeed(date)).toBe(dailySeed(date));
  });

  it('consecutive dates produce different seeds', () => {
    expect(dailySeed(new Date(1956, 5, 18))).not.toBe(dailySeed(new Date(1956, 5, 19)));
  });
});
