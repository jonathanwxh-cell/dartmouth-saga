import { useEffect } from 'react';
import { dailySeed } from '../lib/dailyChallenge';
import { useGameStore } from '../state/store';

function Landing() {
  const continueSavedGame = useGameStore((state) => state.continueSavedGame);
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
            <button className="primary-action" type="button" onClick={() => void continueSavedGame()}>
              Continue
            </button>
          ) : null}
          <button className="primary-action primary-action--secondary" type="button" onClick={() => init()}>
            New game
          </button>
          <button
            className="primary-action primary-action--quiet"
            type="button"
            onClick={() => init(dailySeed())}
          >
            Today&apos;s challenge
          </button>
        </div>
      </section>
      <footer>Hanover, NH · Summer 1956</footer>
    </main>
  );
}

export default Landing;
