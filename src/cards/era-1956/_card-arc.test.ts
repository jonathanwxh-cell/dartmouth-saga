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

const qualityKeys = [
  'symbolic_progress',
  'funding',
  'public_trust',
  'academic_credibility',
  'compute',
  'team_morale',
] as const;

const trajectoryIds = [
  'trajectory-mid-careful',
  'trajectory-mid-bold',
  'trajectory-mid-stable',
  'trajectory-late-establishment',
  'trajectory-late-rival',
  'trajectory-late-bureaucrat',
  'trajectory-warn-cred-high',
  'trajectory-warn-cred-low',
  'trajectory-warn-fund-high',
  'trajectory-warn-fund-low',
  'trajectory-warn-trust-high',
  'trajectory-warn-trust-low',
  'trajectory-warn-prog-high',
  'trajectory-warn-prog-low',
  'trajectory-warn-cpu-high',
  'trajectory-warn-cpu-low',
  'trajectory-warn-mor-high',
  'trajectory-warn-mor-low',
] as const;

function rangesOverlap(left: [number, number], right: [number, number]) {
  return left[0] <= right[1] && right[0] <= left[1];
}

function requirementsCanOverlap(left: Card, right: Card) {
  const leftRequires = left.requires ?? {};
  const rightRequires = right.requires ?? {};

  return qualityKeys.every((quality) => {
    const leftRange = leftRequires[quality] ?? [0, 100];
    const rightRange = rightRequires[quality] ?? [0, 100];
    return rangesOverlap(leftRange, rightRange);
  });
}

describe('1956 card arc', () => {
  const cards = loadEraCards();
  const cardById = new Map(cards.map((card) => [card.id, card]));

  it('contains the full 105-card outline and no scaffold card', () => {
    expect(cards).toHaveLength(105);
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

  it('includes the pacing interstitials and notebook cards', () => {
    for (const id of [
      'interstitial-week-one-ends',
      'interstitial-mid-july',
      'interstitial-august',
      'interstitial-september-coming',
    ]) {
      expect(cardById.get(id)?.is_interstitial, id).toBe(true);
    }

    for (const id of [
      'notebook-day-three',
      'notebook-after-logic-theorist',
      'notebook-night-before',
    ]) {
      expect(cardById.get(id)?.form, id).toBe('notebook');
    }
  });

  it('marks selected existing cards with their pacing forms', () => {
    expect(cardById.get('middle-wiener-letter-arrives')?.form).toBe('letter');
    expect(cardById.get('closing-rockefeller-letter-arrives')?.form).toBe('letter');
    expect(cardById.get('closing-shannon-final-letter')?.form).toBe('letter');
    expect(cardById.get('middle-press-time-magazine')?.form).toBe('newswire');
    expect(cardById.get('opening-press-call-1')?.form).toBe('newswire');
  });

  it('includes trajectory hint cards as content-only interstitials', () => {
    for (const id of trajectoryIds) {
      const card = cardById.get(id);
      expect(card, id).toBeDefined();
      expect(card?.weight, id).toBe(100);
      expect(card?.is_interstitial, id).toBe(true);
      expect(card?.form, id).toBe('standard');
      expect(card?.left.effects, id).toEqual({});
      expect(card?.right.effects, id).toEqual({});
      expect(card?.left.label, id).toBe('Continue');
      expect(card?.right.label, id).toBe('Continue');
    }
  });

  it('keeps mid-trajectory requirements mutually exclusive', () => {
    const ids = ['trajectory-mid-careful', 'trajectory-mid-bold', 'trajectory-mid-stable'];

    for (let leftIndex = 0; leftIndex < ids.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < ids.length; rightIndex += 1) {
        const left = cardById.get(ids[leftIndex]!);
        const right = cardById.get(ids[rightIndex]!);
        expect(left).toBeDefined();
        expect(right).toBeDefined();
        expect(requirementsCanOverlap(left!, right!), `${left?.id} overlaps ${right?.id}`).toBe(
          false,
        );
      }
    }
  });

  it('keeps late-trajectory requirements mutually exclusive', () => {
    const ids = [
      'trajectory-late-establishment',
      'trajectory-late-rival',
      'trajectory-late-bureaucrat',
    ];

    for (let leftIndex = 0; leftIndex < ids.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < ids.length; rightIndex += 1) {
        const left = cardById.get(ids[leftIndex]!);
        const right = cardById.get(ids[rightIndex]!);
        expect(left).toBeDefined();
        expect(right).toBeDefined();
        expect(requirementsCanOverlap(left!, right!), `${left?.id} overlaps ${right?.id}`).toBe(
          false,
        );
      }
    }
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
      if (
        card.is_interstitial ||
        card.form === 'letter' ||
        card.form === 'newswire' ||
        card.form === 'notebook'
      ) {
        continue;
      }

      expect(card.speaker.portrait).toMatch(/^[a-z0-9-]+\.png$/);
    }
  });
});
