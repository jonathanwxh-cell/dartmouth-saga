import { RotateCcw } from 'lucide-react';
import type { Quality } from '../engine/types';
import { useGameStore } from '../state/store';

const labels: Record<Quality, string> = {
  symbolic_progress: 'Symbolic progress',
  funding: 'Funding',
  public_trust: 'Public trust',
  academic_credibility: 'Academic credibility',
  compute: 'Compute',
  team_morale: 'Team morale'
};

function boundaryMessage(quality: Quality, kind: 'collapse' | 'overheat') {
  if (quality === 'funding' && kind === 'collapse') return 'You ran out of grant money.';
  if (quality === 'team_morale') return 'The lab burned itself out.';
  if (quality === 'academic_credibility' && kind === 'collapse') {
    return 'The summer ended without a proposal.';
  }
  return kind === 'collapse' ? 'The summer ended without a proposal.' : 'The lab burned itself out.';
}

function EndingScreen() {
  const gameOver = useGameStore((state) => state.gameOver);
  const reset = useGameStore((state) => state.reset);

  if (!gameOver) return null;

  const message =
    gameOver.reason === 'pool-exhausted'
      ? 'The pool exhausted.'
      : boundaryMessage(gameOver.quality, gameOver.kind);

  return (
    <main className="ending-screen" aria-labelledby="ending-title">
      <section className="ending-panel">
        <p className="screen-label">Run ended</p>
        <h1 id="ending-title">{message}</h1>
        {gameOver.reason === 'boundary' ? (
          <p>{`${labels[gameOver.quality]} reached ${gameOver.kind}.`}</p>
        ) : (
          <p>The workshop has no eligible cards left to draw.</p>
        )}
        <button className="primary-action" type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" size={18} />
          Begin again
        </button>
      </section>
    </main>
  );
}

export default EndingScreen;
