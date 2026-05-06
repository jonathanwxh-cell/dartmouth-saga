import type { Card, GameState, Quality } from './types';

export const qualities: Quality[] = [
  'symbolic_progress',
  'funding',
  'public_trust',
  'academic_credibility',
  'compute',
  'team_morale'
];

export const initialQualities = Object.fromEntries(qualities.map((quality) => [quality, 50])) as Record<
  Quality,
  number
>;

export function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    qualities: { ...initialQualities },
    flags: new Set(),
    seenIds: new Set(),
    currentCard: null,
    era: '1956',
    ...overrides
  };
}

export function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'sample-card',
    era: '1956',
    weight: 1,
    speaker: { name: 'Claude Shannon', portrait: 'shannon.png', title: 'Researcher' },
    prompt: 'A useful placeholder prompt for the engine tests.',
    left: {
      label: 'Conserve',
      effects: { funding: -5 }
    },
    right: {
      label: 'Commit',
      effects: { symbolic_progress: 5 }
    },
    ...overrides
  };
}
