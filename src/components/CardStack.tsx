import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import CardView from './CardView';
import { commitThreshold, swipeSideFromDelta, type SwipeSide } from '../lib/swipe';
import { useGameStore } from '../state/store';

const viewport = () => (typeof window === 'undefined' ? 375 : window.innerWidth);

function CardStack() {
  const currentCard = useGameStore((state) => state.currentCard);
  const gameOver = useGameStore((state) => state.gameOver);
  const swipe = useGameStore((state) => state.swipe);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, 0, 300], [0.4, 1, 0.4]);
  const [viewportWidth, setViewportWidth] = useState(viewport);
  const threshold = commitThreshold(viewportWidth);
  const leftOpacity = useTransform(x, [-threshold, 0], [1, 0.16]);
  const rightOpacity = useTransform(x, [0, threshold], [0.16, 1]);

  useEffect(() => {
    const onResize = () => setViewportWidth(viewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const commit = useCallback(
    async (side: SwipeSide) => {
      if (gameOver || !currentCard) return;
      const direction = side === 'right' ? 1 : -1;
      await animate(x, direction * viewportWidth, { duration: 0.3 }).finished;
      swipe(side);
      x.set(0);
    },
    [currentCard, gameOver, swipe, viewportWidth, x]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        return;
      }
      if (event.key === 'ArrowLeft') void commit('left');
      if (event.key === 'ArrowRight') void commit('right');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commit]);

  if (!currentCard) return null;

  return (
    <section className="card-stage" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentCard.id}
          className="swipe-card-shell"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="swipe-card"
            drag="x"
            dragDirectionLock
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              const side = swipeSideFromDelta(info.offset.x, threshold);
              if (side) void commit(side);
              else void animate(x, 0, { type: 'spring', stiffness: 420, damping: 32 });
            }}
            style={{ x, rotate, opacity }}
          >
            <CardView card={currentCard} leftOpacity={leftOpacity} rightOpacity={rightOpacity} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <nav className="card-actions" aria-label="Card choices">
        <button
          type="button"
          className="card-action card-action--left"
          onClick={() => void commit('left')}
          disabled={!!gameOver}
        >
          <ChevronLeft aria-hidden size={18} />
          <span>{currentCard.left.label}</span>
        </button>
        <button
          type="button"
          className="card-action card-action--right"
          onClick={() => void commit('right')}
          disabled={!!gameOver}
        >
          <span>{currentCard.right.label}</span>
          <ChevronRight aria-hidden size={18} />
        </button>
      </nav>
    </section>
  );
}

export default CardStack;
