import { motion, type MotionValue } from 'framer-motion';
import type { Card } from '../engine/types';

interface CardViewProps {
  card: Card;
  leftOpacity?: MotionValue<number> | number;
  rightOpacity?: MotionValue<number> | number;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function CardView({ card, leftOpacity = 0.16, rightOpacity = 0.16 }: CardViewProps) {
  return (
    <article className="card-view">
      <motion.span className="choice-hint choice-hint--left" style={{ opacity: leftOpacity }}>
        {card.left.label}
      </motion.span>
      <motion.span className="choice-hint choice-hint--right" style={{ opacity: rightOpacity }}>
        {card.right.label}
      </motion.span>
      <header className="card-header">
        <p className="speaker-title">{card.speaker.title ?? 'Dartmouth workshop'}</p>
        <h2>{card.speaker.name}</h2>
      </header>
      <figure className="portrait-slot" aria-label={`${card.speaker.name} portrait placeholder`}>
        <span>{initials(card.speaker.name)}</span>
      </figure>
      <p className="card-prompt">{card.prompt}</p>
    </article>
  );
}

export default CardView;
