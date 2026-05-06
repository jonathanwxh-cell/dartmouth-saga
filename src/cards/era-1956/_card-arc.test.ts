import { cardSchema, type Card } from '../../engine/schema';

const modules = import.meta.glob('./**/*.json', { eager: true });

function payloadFromModule(moduleValue: unknown) {
  if (moduleValue && typeof moduleValue === 'object' && 'default' in moduleValue) {
    return (moduleValue as { default: unknown }).default;
  }

  return moduleValue;
}

function loadEraCards() {
  return Object.values(modules)
    .map((moduleValue) => cardSchema.parse(payloadFromModule(moduleValue)))
    .sort((left, right) => left.id.localeCompare(right.id));
}

describe('1956 card arc', () => {
  const cards = loadEraCards();
  const cardById = new Map(cards.map((card) => [card.id, card]));

  it('contains the full 80-card outline and no scaffold card', () => {
    expect(cards).toHaveLength(80);
    expect(cardById.has('scaffolding-placeholder')).toBe(false);
  });

  it('the four arc-anchor cards (#01, #26, #56, #80) all have weight 100', () => {
    for (const id of [
      'arrival-mccarthy-greeting',
      'middle-newell-simon-arrival',
      'closing-proposal-opening-paragraph',
      'closing-the-summer-ends',
    ]) {
      expect(cardById.get(id)?.weight).toBe(100);
    }
  });

  it('the Rockefeller letter anchor has weight 100', () => {
    expect(cardById.get('closing-rockefeller-letter-arrives')?.weight).toBe(100);
  });

  it('nextCardId chains resolve to existing card IDs in the pool', () => {
    expect(cardById.get('arrival-mccarthy-greeting')?.left.nextCardId).toBe('arrival-the-proposal');
    expect(cardById.get('arrival-mccarthy-greeting')?.right.nextCardId).toBe(
      'arrival-the-proposal',
    );
    expect(cardById.get('middle-logic-theorist-demo-1')?.left.nextCardId).toBe(
      'middle-logic-theorist-result',
    );
    expect(cardById.get('middle-logic-theorist-demo-1')?.right.nextCardId).toBe(
      'middle-logic-theorist-result',
    );
    expect(cardById.get('closing-rockefeller-letter-arrives')?.left.nextCardId).toBe(
      'closing-trim-the-budget',
    );
    expect(cardById.get('closing-rockefeller-letter-arrives')?.right.nextCardId).toBe(
      'closing-trim-the-budget',
    );
  });

  it('every flag referenced in flags_required or flags_forbidden is set by some other card', () => {
    const referenced = new Set<string>();
    const setByCard = new Map<string, Set<string>>();

    for (const card of cards) {
      for (const flag of [...(card.flags_required ?? []), ...(card.flags_forbidden ?? [])]) {
        referenced.add(flag);
      }

      for (const choice of [card.left, card.right]) {
        for (const flag of choice.flags ?? []) {
          const cardIds = setByCard.get(flag) ?? new Set<string>();
          cardIds.add(card.id);
          setByCard.set(flag, cardIds);
        }
      }
    }

    for (const flag of referenced) {
      const setters = setByCard.get(flag) ?? new Set<string>();
      expect(setters.size, `Expected ${flag} to be set by a card`).toBeGreaterThan(0);
    }
  });

  it('every nextCardId points to a real card', () => {
    for (const card of cards) {
      for (const choice of [card.left, card.right]) {
        if (choice.nextCardId) {
          expect(cardById.has(choice.nextCardId), `${card.id} -> ${choice.nextCardId}`).toBe(true);
        }
      }
    }
  });

  it('every portrait reference uses a png filename', () => {
    for (const card of cards as Card[]) {
      expect(card.speaker.portrait).toMatch(/^[a-z0-9-]+\.png$/);
    }
  });
});
