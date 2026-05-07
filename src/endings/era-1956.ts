import type { GameState, Quality } from '../engine/types';

export interface Ending {
  id: string;
  kind: 'main' | 'boundary';
  title: string;
  narrative: string;
  footer?: string;
}

type MainEndingId = 'proposal-funded' | 'partial' | 'canceled';
type BoundaryKind = 'collapse' | 'overheat';

interface BoundaryGameOver {
  reason: 'boundary';
  quality: Quality;
  kind: BoundaryKind;
}

interface PoolExhaustedGameOver {
  reason: 'pool-exhausted';
}

type EndingGameOver = BoundaryGameOver | PoolExhaustedGameOver;

export const MAIN_ENDINGS: Record<MainEndingId, Ending> = {
  'proposal-funded': {
    id: 'proposal-funded',
    kind: 'main',
    title: 'The proposal is funded.',
    narrative:
      'The Rockefeller Foundation grants $7,500 to the workshop. McCarthy keeps the term — “artificial intelligence” — and Shannon’s name on the cover sheet earns the field its first respectability. The summer ends with seven men, three secretaries, and a typewritten claim that machines will reason, learn, and improve themselves. None of them will be right about the timeline.',
    footer: 'Hanover, NH — September 1956'
  },
  partial: {
    id: 'partial',
    kind: 'main',
    title: 'You leave with half a field.',
    narrative:
      'McCarthy gets a smaller grant; Minsky returns to Princeton; Newell and Simon publish the Logic Theorist alone in IRE Transactions. The phrase “artificial intelligence” survives only because someone has to call the program something, and you happen to be the one writing the cover memo.',
    footer: 'Hanover, NH — September 1956'
  },
  canceled: {
    id: 'canceled',
    kind: 'main',
    title: 'The summer was a summer school.',
    narrative:
      'Rockefeller passes; the participants disperse. Shannon goes back to MIT, Minsky to Lincoln Lab, McCarthy to a teaching load that won’t allow another summer like this. In the official correspondence the workshop becomes “an interesting series of meetings,” and the term you proposed never enters the literature.',
    footer: 'Hanover, NH — September 1956'
  }
};

export const BOUNDARY_ENDINGS: Record<string, Ending> = {
  'funding-collapse': {
    id: 'funding-collapse',
    kind: 'boundary',
    title: 'You ran out of grant money.',
    narrative:
      'The Rockefeller line item is cut by August. You write the cover memo on Dartmouth letterhead anyway, but no one mails it.'
  },
  'public_trust-collapse': {
    id: 'public_trust-collapse',
    kind: 'boundary',
    title: 'The Times runs the story.',
    narrative:
      'A reporter at the New York Times calls the workshop “men who claim machines will think.” Funders go quiet. Shannon takes his name off the proposal.'
  },
  'academic_credibility-collapse': {
    id: 'academic_credibility-collapse',
    kind: 'boundary',
    title: 'Norbert Wiener writes the letter.',
    narrative:
      'A note from MIT arrives describing the workshop as “numerology dressed in computation.” After it circulates, no department wants its faculty associated with the proposal.'
  },
  'symbolic_progress-collapse': {
    id: 'symbolic_progress-collapse',
    kind: 'boundary',
    title: 'Nothing runs.',
    narrative:
      'Three weeks in, no program executes more than a toy proof. Newell and Simon take the Logic Theorist back to RAND; the term “artificial intelligence” becomes a footnote in someone else’s field.'
  },
  'compute-collapse': {
    id: 'compute-collapse',
    kind: 'boundary',
    title: 'The IBM 704 is offline.',
    narrative:
      'Rochester’s loaner machine spends August in maintenance. By the time it returns, the participants have already booked September flights.'
  },
  'team_morale-collapse': {
    id: 'team_morale-collapse',
    kind: 'boundary',
    title: 'The lab burns itself out.',
    narrative:
      'Three of the seven leave Hanover before the workshop officially ends. McCarthy keeps writing alone; the joint authorship the proposal needed never materializes.'
  },
  'symbolic_progress-overheat': {
    id: 'symbolic_progress-overheat',
    kind: 'boundary',
    title: 'You promised too much.',
    narrative:
      'The proposal claims thinking machines within a generation. Even Shannon refuses to sign. The grant arrives but the field begins life with a debt of credibility no one can repay.'
  },
  'funding-overheat': {
    id: 'funding-overheat',
    kind: 'boundary',
    title: 'Rockefeller doubles the grant.',
    narrative:
      'And quietly attaches three program officers. The proposal becomes their proposal; you write what they want written. A field exists. It is not yours.'
  },
  'public_trust-overheat': {
    id: 'public_trust-overheat',
    kind: 'boundary',
    title: 'Life Magazine arrives.',
    narrative:
      'A photographer spends a week shooting Minsky next to the IBM 704. The workshop becomes a press event. The participants leave; no actual research gets done.'
  },
  'academic_credibility-overheat': {
    id: 'academic_credibility-overheat',
    kind: 'boundary',
    title: 'You become the establishment.',
    narrative:
      'The proposal is canonized before it can be tested. By 1958 every grant in the field cites you, and any disagreement reads as a heresy you cannot afford to entertain.'
  },
  'compute-overheat': {
    id: 'compute-overheat',
    kind: 'boundary',
    title: 'You bury yourselves in tape.',
    narrative:
      'Rochester ships an extra IBM 704. Six weeks of program runs produce ten thousand pages of output. Nobody reads them. Nobody writes the proposal.'
  },
  'team_morale-overheat': {
    id: 'team_morale-overheat',
    kind: 'boundary',
    title: 'A summer school after all.',
    narrative:
      'The participants are happy. Nobody disagrees with anybody. No one publishes anything. The field needs an argument; this summer didn’t produce one.'
  }
};

export const endingHints: Record<string, string> = {
  // main endings (3)
  'proposal-funded':
    'Reach the end of the workshop with progress, funding, and credibility intact.',
  partial: 'Reach the end of the workshop with mid-range progress and modest funding.',
  canceled: 'Reach the end of the workshop with low progress or low funding.',

  // boundary collapse (6)
  'symbolic_progress-collapse': 'Let symbolic progress fall to zero.',
  'funding-collapse': 'Let funding fall to zero.',
  'public_trust-collapse': 'Let public trust fall to zero.',
  'academic_credibility-collapse': 'Let academic credibility fall to zero.',
  'compute-collapse': 'Let compute hours fall to zero.',
  'team_morale-collapse': 'Let team morale fall to zero.',

  // boundary overheat (6)
  'symbolic_progress-overheat': 'Push symbolic progress to its limit.',
  'funding-overheat': 'Push funding to its limit.',
  'public_trust-overheat': 'Push public trust to its limit.',
  'academic_credibility-overheat': 'Push academic credibility to its limit.',
  'compute-overheat': 'Push compute hours to its limit.',
  'team_morale-overheat': 'Push team morale to its limit.'
};

export const ALL_ENDINGS = [...Object.values(MAIN_ENDINGS), ...Object.values(BOUNDARY_ENDINGS)];

export function endingCategoryLabel(ending: Ending): string {
  return ending.kind === 'main' ? 'Three main endings' : 'Twelve boundary endings';
}

export function selectEnding(state: GameState, gameOver: EndingGameOver): Ending {
  if (gameOver.reason === 'boundary') {
    const key = `${gameOver.quality}-${gameOver.kind}`;
    const ending = BOUNDARY_ENDINGS[key];
    if (!ending) throw new Error(`Missing boundary ending for "${key}".`);
    return ending;
  }

  const { academic_credibility, funding, symbolic_progress } = state.qualities;

  if (symbolic_progress >= 70 && funding >= 50 && academic_credibility >= 50) {
    return MAIN_ENDINGS['proposal-funded'];
  }

  if (symbolic_progress >= 50 && funding >= 30) return MAIN_ENDINGS.partial;

  return MAIN_ENDINGS.canceled;
}
