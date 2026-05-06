import { RotateCcw } from 'lucide-react';
import { selectEnding } from '../endings/era-1956';
import { useGameStore } from '../state/store';

function EndingScreen() {
  const state = useGameStore();

  if (!state.gameOver) return null;

  const ending = selectEnding(state, state.gameOver);

  return (
    <main className="ending-screen" aria-labelledby="ending-title">
      <section className="ending-panel">
        <p className="screen-label">Run ended</p>
        <h1 id="ending-title">{ending.title}</h1>
        <p>{ending.narrative}</p>
        {ending.footer ? <p className="ending-footer">{ending.footer}</p> : null}
        <button className="primary-action" type="button" onClick={state.reset}>
          <RotateCcw aria-hidden="true" size={18} />
          Begin again
        </button>
      </section>
    </main>
  );
}

export default EndingScreen;
