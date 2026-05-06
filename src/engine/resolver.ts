import type { Card, ChoiceSide, EngineEvent, GameState, Quality } from './types';

const clampQuality = (value: number) => Math.min(100, Math.max(0, value));

export function applyChoice(state: GameState, card: Card, side: ChoiceSide) {
  const choice = card[side];

  if (choice.nextCardId && state.seenIds.has(choice.nextCardId)) {
    throw new Error(`nextCardId "${choice.nextCardId}" points to an already seen one-shot card.`);
  }

  const qualities = { ...state.qualities };
  const changes: EngineEvent['changes'] = {};

  for (const [quality, delta] of Object.entries(choice.effects) as Array<[Quality, number]>) {
    const from = qualities[quality];
    const to = clampQuality(from + delta);
    qualities[quality] = to;
    changes[quality] = { from, to, delta };
  }

  const flags = new Set(state.flags);
  const flagsAdded: string[] = [];

  for (const flag of choice.flags ?? []) {
    if (!flags.has(flag)) flagsAdded.push(flag);
    flags.add(flag);
  }

  const seenIds = new Set(state.seenIds);
  seenIds.add(card.id);

  return {
    state: {
      ...state,
      qualities,
      flags,
      seenIds
    },
    event: {
      cardId: card.id,
      side,
      changes,
      flagsAdded,
      nextCardId: choice.nextCardId
    }
  };
}
