import { useEffect } from 'react';
import EndingsArchive from './EndingsArchive';
import { audioEngine } from '../audio/audioEngine';
import { ALL_ENDINGS } from '../endings/era-1956';
import { dailySeed } from '../lib/dailyChallenge';
import { useGameStore } from '../state/store';

function Landing() {
  const continueSavedGame = useGameStore((state) => state.continueSavedGame);
  const discoveredCount = useGameStore((state) => Object.keys(state.endingStats.discovered).length);
  const hasSave = useGameStore((state) => state.hasSave);
  const init = useGameStore((state) => state.init);
  const refreshSaveStatus = useGameStore((state) => state.refreshSaveStatus);

  useEffect(() => {
    void refreshSaveStatus();
  }, [refreshSaveStatus]);

  return (
    <main className="landing-screen" aria-labelledby="project-title">
      <section className="landing-panel">
        <h1 id="project-title">The Dartmouth Saga</h1>
        <p>A card-swipe game about 70 years of AI history. v0.1 — coming soon.</p>
        <div className="landing-actions">
          {hasSave ? (
            <button
              className="primary-action"
              type="button"
              onClick={() => {
                audioEngine.unlock();
                void continueSavedGame();
              }}
            >
              Continue
            </button>
          ) : null}
          <button
            className="primary-action primary-action--secondary"
            type="button"
            onClick={() => {
              audioEngine.unlock();
              init();
            }}
          >
            New game
          </button>
          <button
            className="primary-action primary-action--quiet"
            type="button"
            onClick={() => {
              audioEngine.unlock();
              init(dailySeed());
            }}
          >
            Today&apos;s challenge
          </button>
        </div>
        <p className="ending-discovered-counter">
          Endings discovered: {discoveredCount} / {ALL_ENDINGS.length}
        </p>
        <EndingsArchive />
      </section>
      <footer>Hanover, NH · Summer 1956</footer>
    </main>
  );
}

export default Landing;
