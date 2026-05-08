import type { Card } from '../src/engine/schema';
import { loadCardsFromFs } from './loadCardsFromFs';

function assertUniqueIds(cards: Card[]) {
  const seen = new Set<string>();

  for (const card of cards) {
    if (seen.has(card.id)) throw new Error(`Duplicate card id: ${card.id}`);
    seen.add(card.id);
  }
}

async function main() {
  const cards = await loadCardsFromFs();
  assertUniqueIds(cards);
  console.log(`✓ ${cards.length} cards validated`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
