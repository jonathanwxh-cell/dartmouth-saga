import type { Card } from './schema';

export type { Card };

export type Quality =
  | 'symbolic_progress'
  | 'funding'
  | 'public_trust'
  | 'academic_credibility'
  | 'compute'
  | 'team_morale';

export type Era = '1956' | '1974' | '1980' | '1987' | '1993' | '2012' | '2020';

export type ChoiceSide = 'left' | 'right';

export type CardForm = 'standard' | 'letter' | 'newswire' | 'notebook';

export interface Choice {
  label: string;
  effects: Partial<Record<Quality, number>>;
  flags?: string[];
  nextCardId?: string;
}

export interface GameState {
  qualities: Record<Quality, number>;
  flags: Set<string>;
  seenIds: Set<string>;
  currentCard: Card | null;
  era: Era;
}

export interface QualityChange {
  from: number;
  to: number;
  delta: number;
}

export interface EngineEvent {
  cardId: string;
  side: ChoiceSide;
  changes: Partial<Record<Quality, QualityChange>>;
  flagsAdded: string[];
  nextCardId?: string;
}
