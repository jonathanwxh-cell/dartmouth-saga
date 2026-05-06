import { motion, type MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
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

const knownPortraits = new Set([
  'mccarthy.png',
  'shannon.png',
  'minsky.png',
  'rochester.png',
  'newell.png',
  'simon.png',
  'solomonoff.png',
  'selfridge.png',
  'samuel.png',
  'more.png',
  'weaver.png',
  'kemeny.png',
  'reporter-generic.png',
  'dean-secretary.png',
  'trustee.png',
]);

function portraitPath(portrait: string) {
  return knownPortraits.has(portrait) ? `/portraits/${portrait}` : null;
}

function CardView({ card, leftOpacity = 0.16, rightOpacity = 0.16 }: CardViewProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const portrait = portraitPath(card.speaker.portrait);

  useEffect(() => {
    setPortraitFailed(false);
  }, [card.id, card.speaker.portrait]);

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
      <figure className="portrait-slot" aria-label={`${card.speaker.name} portrait`}>
        {portrait && !portraitFailed ? (
          <img
            src={portrait}
            alt={`${card.speaker.name} portrait`}
            onError={() => setPortraitFailed(true)}
            style={{
              blockSize: '100%',
              inlineSize: '100%',
              borderRadius: 'inherit',
              objectFit: 'cover',
            }}
          />
        ) : (
          <span>{initials(card.speaker.name)}</span>
        )}
      </figure>
      <p className="card-prompt">{card.prompt}</p>
    </article>
  );
}

export default CardView;
