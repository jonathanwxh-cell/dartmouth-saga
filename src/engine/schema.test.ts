import { cardSchema } from './schema';
import { makeCard } from './testFixtures';

describe('cardSchema', () => {
  it('accepts a fully-specified valid card', () => {
    const card = makeCard({
      requires: { funding: [10, 80], compute: [25, 100] },
      flags_required: ['workshop-opened'],
      flags_forbidden: ['winter-ended'],
      one_shot: true,
      left: {
        label: 'Write letter',
        effects: { funding: -12, academic_credibility: 8 },
        flags: ['funding-letter-sent'],
        nextCardId: 'followup-card',
      },
    });

    expect(cardSchema.parse(card).id).toBe('sample-card');
  });

  it('accepts a minimal valid card', () => {
    const card = makeCard({
      speaker: { name: 'John McCarthy', portrait: 'mccarthy.png' },
      left: { label: 'Pause', effects: {} },
    });

    expect(cardSchema.parse(card).speaker.title).toBeUndefined();
  });

  it('accepts a card with is_interstitial: true and empty speaker fields', () => {
    const card = {
      ...makeCard({
        id: 'interstitial-week-one-ends',
        speaker: { name: '', portrait: '' },
        left: { label: 'Continue', effects: {}, flags: ['interstitial-week-one-shown'] },
        right: { label: 'Continue', effects: {}, flags: ['interstitial-week-one-shown'] },
      }),
      is_interstitial: true,
    };

    expect(cardSchema.parse(card).is_interstitial).toBe(true);
  });

  it.each(['letter', 'newswire', 'notebook'] as const)('accepts a card with form: "%s"', (form) => {
    const card = { ...makeCard(), form };

    expect(cardSchema.parse(card).form).toBe(form);
  });

  it('rejects a card with form: "unknown"', () => {
    const card = { ...makeCard(), form: 'unknown' };

    expect(() => cardSchema.parse(card)).toThrow(/form/);
  });

  it('rejects a card with an unknown quality key', () => {
    const card = {
      ...makeCard(),
      left: {
        label: 'Invent',
        effects: { charisma: 10 },
      },
    };

    expect(() => cardSchema.parse(card)).toThrow(/charisma/);
  });

  it('rejects a card with weight 0', () => {
    expect(() => cardSchema.parse(makeCard({ weight: 0 }))).toThrow(/weight/);
  });

  it('rejects a card with extra unknown top-level fields', () => {
    const card = { ...makeCard(), soundtrack: 'none' };

    expect(() => cardSchema.parse(card)).toThrow(/soundtrack/);
  });
});
