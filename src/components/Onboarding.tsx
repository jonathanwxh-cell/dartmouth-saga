import { qualityFullNames, qualityMeta } from './QualityMeters';
import { useGameStore } from '../state/store';

function Onboarding() {
  const tutorialSeen = useGameStore((state) => state.tutorialSeen);
  const markTutorialSeen = useGameStore((state) => state.markTutorialSeen);
  const init = useGameStore((state) => state.init);

  if (tutorialSeen) return null;

  const begin = () => {
    markTutorialSeen();
    init();
  };

  return (
    <main className="onboarding-screen" aria-labelledby="onboarding-title">
      <section className="onboarding-panel">
        <h1 id="onboarding-title">The Dartmouth Saga</h1>
        <div className="onboarding-copy">
          <p>
            It is June 1956. You are a research assistant John McCarthy hired to help organize the
            Dartmouth Summer Research Project on Artificial Intelligence. You have a desk in Steele Hall, an
            undergraduate science degree, and the unglamorous job of making sure the typewriters work and the
            right people are in the right rooms.
          </p>
          <p>
            The summer runs eight weeks. Six dials at the top of your desk track what is happening — your
            symbolic progress, the workshop&apos;s funding, the public&apos;s trust, your academic credibility, the
            IBM 704 hours you have left, and your team&apos;s morale. Push any one to its extreme and the run ends
            early; let any one collapse and the same.
          </p>
          <p>
            Each card is a moment. Swipe left or right, or tap the arrow buttons below. Around sixty-four
            swipes brings you to September. By then you will have either written your name onto a proposal
            that founds a field, into a footnote in someone else&apos;s career, or out of the field entirely.
          </p>
        </div>
        <div className="meter-guide" aria-label="Meter code guide">
          {qualityMeta.map(({ key, short }) => (
            <div className="meter-guide-row" key={key}>
              <span className="meter-guide-code">{short}</span>
              <span className="meter-guide-name">{qualityFullNames[key]}</span>
            </div>
          ))}
        </div>
        <button className="primary-action" type="button" onClick={begin}>
          Begin the workshop
        </button>
        <button className="onboarding-skip" type="button" onClick={begin}>
          Skip
        </button>
      </section>
    </main>
  );
}

export default Onboarding;
