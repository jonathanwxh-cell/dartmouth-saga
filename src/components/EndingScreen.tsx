import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { ALL_ENDINGS, selectEnding } from '../endings/era-1956';
import { useGameStore } from '../state/store';

function EndingScreen() {
  const gameOver = useGameStore((s) => s.gameOver);
  const qualities = useGameStore((s) => s.qualities);
  const flags = useGameStore((s) => s.flags);
  const seenIds = useGameStore((s) => s.seenIds);
  const currentCard = useGameStore((s) => s.currentCard);
  const era = useGameStore((s) => s.era);
  const endingStats = useGameStore((s) => s.endingStats);
  const lastDiscoveryWasNew = useGameStore((s) => s.lastDiscoveryWasNew);
  const swipesThisRun = useGameStore((s) => s.swipesThisRun);
  const reset = useGameStore((s) => s.reset);

  if (!gameOver) return null;

  const ending = selectEnding(
    { qualities, flags, seenIds, currentCard, era },
    gameOver
  );
  const discoveredCount = Object.keys(endingStats.discovered).length;
  const wasNewDiscovery =
    lastDiscoveryWasNew && endingStats.discovered[ending.id]?.count === 1;

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
          Endings: {discoveredCount} / {ALL_ENDINGS.length} · This run lasted {swipesThisRun}{' '}
          swipes
        </p>
        <button className="primary-action" type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" size={18} />
          Begin again
        </button>
      </section>
    </main>
  );
}

export default EndingScreen;
