import CardStack from './CardStack';
import EndingScreen from './EndingScreen';
import Landing from './Landing';
import QualityMeters from './QualityMeters';
import { useAudio } from '../audio/useAudio';
import { useGameStore } from '../state/store';
import { useEraAttribute } from '../styles/useEraAttribute';

function Game() {
  useEraAttribute();
  useAudio();

  const currentCard = useGameStore((state) => state.currentCard);
  const gameOver = useGameStore((state) => state.gameOver);
  const qualities = useGameStore((state) => state.qualities);

  if (gameOver) return <EndingScreen />;
  if (!currentCard) return <Landing />;

  return (
    <main className="game-shell" aria-label="The Dartmouth Saga">
      <QualityMeters qualities={qualities} />
      <CardStack />
    </main>
  );
}

export default Game;
