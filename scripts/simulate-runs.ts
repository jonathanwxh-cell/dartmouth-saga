import { simulateMany } from '../src/lib/simulate';
import { loadCardsFromFs } from './loadCardsFromFs';

function readNumberArg(name: string, fallback: number) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;

  const raw = process.argv[index + 1];
  const value = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isNaN(value) || value <= 0) {
    throw new Error(`${flag} must be a positive integer.`);
  }

  return value;
}

async function main() {
  const runs = readNumberArg('runs', 1000);
  const seedBase = readNumberArg('seed-base', 42);
  const pool = (await loadCardsFromFs()).filter((card) => card.era === '1956');
  const result = simulateMany(runs, seedBase, pool);
  const rows = Object.entries(result.distribution).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  console.log(`| Ending | Runs | Percent |`);
  console.log(`| --- | ---: | ---: |`);
  for (const [endingId, count] of rows) {
    console.log(`| ${endingId} | ${count} | ${((count / runs) * 100).toFixed(1)}% |`);
  }
  console.log(`\nMedian swipes: ${result.medianSwipes}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
