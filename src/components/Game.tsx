import CardStack from './CardStack';
import EndingScreen from './EndingScreen';
import Landing from './Landing';
import Onboarding from './Onboarding';
import QualityMeters from './QualityMeters';
import { useAudio } from '../audio/useAudio';
import { useGameStore } from '../state/store';
import { useEraAttribute } from '../styles/useEraAttribute';

function Game() {
  useEraAttribute();
  useAudio();

  const currentCard = useGameStore((state) => state.currentCard);
  const gameOver = useGameStore((state) => state.gameOver);
  const lastEvent = useGameStore((state) => state.lastEvent);
  const qualities = useGameStore((state) => state.qualities);
  const tutorialSeen = useGameStore((state) => state.tutorialSeen);

  if (!currentCard && !gameOver && !tutorialSeen) return <Onboarding />;
  if (gameOver) return <EndingScreen />;
  if (!currentCard) return <Landing />;

  return (
    <main className="game-shell" aria-label="The Dartmouth Saga">
      <QualityMeters qualities={qualities} lastEvent={lastEvent} />
      <CardStack />
    </main>
  );
}

export default Game;
