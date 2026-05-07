import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { ALL_ENDINGS, selectEnding } from '../endings/era-1956';
import { useGameStore } from '../state/store';

function EndingScreen() {
  const state = useGameStore();

  if (!state.gameOver) return null;

  const ending = selectEnding(state, state.gameOver);
  const discoveredCount = Object.keys(state.endingStats.discovered).length;
  const wasNewDiscovery =
    state.lastDiscoveryWasNew && state.endingStats.discovered[ending.id]?.count === 1;

  return (
    <main className="ending-screen" aria-labelledby="ending-title">
      <section className="ending-panel">
        <p className="screen-label">Run ended</p>
        {wasNewDiscovery ? (
          <motion.p
            className="new-ending-flourish"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            ✦ New ending discovered
          </motion.p>
        ) : null}
        <h1 id="ending-title">{ending.title}</h1>
        <p>{ending.narrative}</p>
        {ending.footer ? <p className="ending-footer">{ending.footer}</p> : null}
        <p className="run-summary-line">
          Endings: {discoveredCount} / {ALL_ENDINGS.length} · This run lasted {state.swipesThisRun}{' '}
          swipes
        </p>
        <button className="primary-action" type="button" onClick={state.reset}>
          <RotateCcw aria-hidden="true" size={18} />
          Begin again
        </button>
      </section>
    </main>
  );
}

export default EndingScreen;
