import {
  clearEndingStats,
  loadEndingStats,
  recordEndingDiscovered,
  saveEndingStats,
  STORAGE_KEY
} from './endingStats';

describe('endingStats', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-07T04:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loadEndingStats returns empty stats when key is missing', () => {
    expect(loadEndingStats()).toEqual({ discovered: {}, totalRuns: 0 });
  });

  it('loadEndingStats returns empty stats when JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');

    expect(loadEndingStats()).toEqual({ discovered: {}, totalRuns: 0 });
  });

  it('saveEndingStats round-trips stats through localStorage', () => {
    const stats = {
      discovered: {
        'proposal-funded': { count: 2, firstSeen: '2026-05-07T04:30:00.000Z' }
      },
      totalRuns: 2
    };

    saveEndingStats(stats);

    expect(loadEndingStats()).toEqual(stats);
  });

  it('recordEndingDiscovered creates a new entry with count 1 and an ISO date', () => {
    const stats = recordEndingDiscovered({ discovered: {}, totalRuns: 0 }, 'proposal-funded');

    expect(stats.discovered['proposal-funded']).toEqual({
      count: 1,
      firstSeen: '2026-05-07T04:30:00.000Z'
    });
  });

  it('recordEndingDiscovered increments count when ending already discovered', () => {
    const stats = recordEndingDiscovered(
      {
        discovered: {
          'proposal-funded': { count: 1, firstSeen: '2026-05-01T00:00:00.000Z' }
        },
        totalRuns: 1
      },
      'proposal-funded'
    );

    expect(stats.discovered['proposal-funded']).toEqual({
      count: 2,
      firstSeen: '2026-05-01T00:00:00.000Z'
    });
  });

  it('recordEndingDiscovered increments totalRuns regardless of new vs repeat', () => {
    const first = recordEndingDiscovered({ discovered: {}, totalRuns: 0 }, 'proposal-funded');
    const second = recordEndingDiscovered(first, 'proposal-funded');

    expect(first.totalRuns).toBe(1);
    expect(second.totalRuns).toBe(2);
  });

  it('clearEndingStats removes the key', () => {
    saveEndingStats({
      discovered: {
        partial: { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' }
      },
      totalRuns: 1
    });

    clearEndingStats();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
