import card01 from './opening/arrival-mccarthy-greeting.json';
import card02 from './opening/arrival-the-proposal.json';
import card03 from './opening/arrival-shannon-cabin.json';
import card04 from './opening/arrival-minsky-snarc.json';
import card05 from './opening/arrival-rochester-ibm.json';
import card06 from './opening/arrival-solomonoff-knock.json';
import card07 from './opening/opening-naming-debate-1.json';
import card08 from './opening/opening-typewriter-broken.json';
import card09 from './opening/opening-room-assignment.json';
import card10 from './opening/opening-cybernetics-shadow.json';
import card11 from './opening/opening-rochester-704-tape.json';
import card12 from './opening/opening-minsky-coffee.json';
import card13 from './opening/opening-dartmouth-dean.json';
import card14 from './opening/opening-shannon-side-bet.json';
import card15 from './opening/opening-rockefeller-letter-1.json';
import card16 from './opening/opening-mccarthy-pen.json';
import card17 from './opening/opening-bench-space-minsky.json';
import card18 from './opening/opening-press-call-1.json';
import card19 from './opening/opening-shannon-cover-sheet.json';
import card20 from './opening/opening-trenchard-more.json';
import card21 from './opening/opening-rochester-ibm-pressure.json';
import card22 from './opening/opening-mccarthy-naming-2.json';
import card23 from './opening/opening-funding-balance.json';
import card24 from './opening/opening-bell-labs-call.json';
import card25 from './opening/opening-end-of-week-2.json';
import card26 from './middle/middle-newell-simon-arrival.json';
import card27 from './middle/middle-logic-theorist-demo-1.json';
import card28 from './middle/middle-logic-theorist-result.json';
import card29 from './middle/middle-naming-newell-counter.json';
import card30 from './middle/middle-shannon-skeptic.json';
import card31 from './middle/middle-solomonoff-paper.json';
import card32 from './middle/middle-minsky-snarc-progress.json';
import card33 from './middle/middle-room-cleanup.json';
import card34 from './middle/middle-rockefeller-progress-1.json';
import card35 from './middle/middle-selfridge-pandemonium.json';
import card36 from './middle/middle-arthur-samuel-checkers.json';
import card37 from './middle/middle-ibm-704-down.json';
import card38 from './middle/middle-minsky-newell-clash.json';
import card39 from './middle/middle-mccarthy-lisp-germ.json';
import card40 from './middle/middle-press-noticed-followup.json';
import card41 from './middle/middle-wiener-letter-arrives.json';
import card42 from './middle/middle-funding-shortfall.json';
import card43 from './middle/middle-newell-wants-credit.json';
import card44 from './middle/middle-solomonoff-quiet-progress.json';
import card45 from './middle/middle-trenchard-more-arrival.json';
import card46 from './middle/middle-mccarthy-overworked.json';
import card47 from './middle/middle-rochester-paper-promise.json';
import card48 from './middle/middle-shannon-departure-talk.json';
import card49 from './middle/middle-late-night-debate.json';
import card50 from './middle/middle-press-time-magazine.json';
import card51 from './middle/middle-rockefeller-progress-2.json';
import card52 from './middle/middle-bench-fire-scare.json';
import card53 from './middle/middle-program-list.json';
import card54 from './middle/middle-minsky-leaves-early-rumor.json';
import card55 from './middle/middle-end-of-july.json';
import card56 from './closing/closing-proposal-opening-paragraph.json';
import card57 from './closing/closing-naming-final.json';
import card58 from './closing/closing-shannon-leaves.json';
import card59 from './closing/closing-rockefeller-letter-arrives.json';
import card60 from './closing/closing-trim-the-budget.json';
import card61 from './closing/closing-newell-simon-departure.json';
import card62 from './closing/closing-minsky-snarc-publication.json';
import card63 from './closing/closing-press-handling.json';
import card64 from './closing/closing-rochester-paper-due.json';
import card65 from './closing/closing-wiener-response.json';
import card66 from './closing/closing-final-paragraph-claim.json';
import card67 from './closing/closing-solomonoff-finishes.json';
import card68 from './closing/closing-the-list-of-attendees.json';
import card69 from './closing/closing-mccarthy-leaving.json';
import card70 from './closing/closing-second-progress-report.json';
import card71 from './closing/closing-the-term-survives.json';
import card72 from './closing/closing-the-term-doesnt.json';
import card73 from './closing/closing-press-distance.json';
import card74 from './closing/closing-final-week-tedium.json';
import card75 from './closing/closing-shannon-final-letter.json';
import card76 from './closing/closing-mccarthy-thanks.json';
import card77 from './closing/closing-the-cover-memo.json';
import card78 from './closing/closing-departures-final.json';
import card79 from './closing/closing-the-dean-debrief.json';
import card80 from './closing/closing-the-summer-ends.json';
import { cardSchema, type Card } from '../../engine/schema';

const rawCards = [
  card01,
  card02,
  card03,
  card04,
  card05,
  card06,
  card07,
  card08,
  card09,
  card10,
  card11,
  card12,
  card13,
  card14,
  card15,
  card16,
  card17,
  card18,
  card19,
  card20,
  card21,
  card22,
  card23,
  card24,
  card25,
  card26,
  card27,
  card28,
  card29,
  card30,
  card31,
  card32,
  card33,
  card34,
  card35,
  card36,
  card37,
  card38,
  card39,
  card40,
  card41,
  card42,
  card43,
  card44,
  card45,
  card46,
  card47,
  card48,
  card49,
  card50,
  card51,
  card52,
  card53,
  card54,
  card55,
  card56,
  card57,
  card58,
  card59,
  card60,
  card61,
  card62,
  card63,
  card64,
  card65,
  card66,
  card67,
  card68,
  card69,
  card70,
  card71,
  card72,
  card73,
  card74,
  card75,
  card76,
  card77,
  card78,
  card79,
  card80,
];

export const era1956Cards: Card[] = rawCards.map((card) => cardSchema.parse(card));
