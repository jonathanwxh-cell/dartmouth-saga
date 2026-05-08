export interface EndingDiscoveryRecord {
  count: number;
  firstSeen: string;
}

export interface EndingStats {
  discovered: Record<string, EndingDiscoveryRecord>;
  totalRuns: number;
}

export const STORAGE_KEY = 'dartmouth-saga:ending-stats:v1';

const emptyEndingStats = (): EndingStats => ({ discovered: {}, totalRuns: 0 });

function hasLocalStorage() {
  return typeof localStorage !== 'undefined';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDiscoveryRecord(value: unknown): value is EndingDiscoveryRecord {
  return (
    isRecord(value) &&
    typeof value.count === 'number' &&
    Number.isFinite(value.count) &&
    value.count > 0 &&
    typeof value.firstSeen === 'string'
  );
}

function isEndingStats(value: unknown): value is EndingStats {
  if (!isRecord(value) || !isRecord(value.discovered) || !Number.isFinite(value.totalRuns)) {
    return false;
  }

  return Object.values(value.discovered).every(isDiscoveryRecord);
}

export function loadEndingStats(): EndingStats {
  if (!hasLocalStorage()) return emptyEndingStats();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyEndingStats();

    const parsed = JSON.parse(raw) as unknown;
    if (!isEndingStats(parsed)) return emptyEndingStats();

    return parsed;
  } catch {
    return emptyEndingStats();
  }
}

export function saveEndingStats(stats: EndingStats) {
  if (!hasLocalStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Quota or locked-down embeds can reject storage writes; ending
    // stats are non-critical, so swallow.
  }
}

export function recordEndingDiscovered(stats: EndingStats, endingId: string): EndingStats {
  const existing = stats.discovered[endingId];

  return {
    discovered: {
      ...stats.discovered,
      [endingId]: existing
        ? { ...existing, count: existing.count + 1 }
        : { count: 1, firstSeen: new Date().toISOString() }
    },
    totalRuns: stats.totalRuns + 1
  };
}

export function clearEndingStats() {
  if (!hasLocalStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
}
