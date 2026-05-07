import { motion, type MotionValue } from 'framer-motion';
import { Calendar } from 'lucide-react';
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

const interstitialDateLabels: Record<string, string> = {
  'interstitial-week-one-ends': 'JUNE 25 · WEEK ONE',
  'interstitial-mid-july': 'JULY 15 · MID-JULY',
  'interstitial-august': 'AUGUST 1 · AUGUST',
  'interstitial-september-coming': 'AUGUST 20 · THREE WEEKS LEFT',
};

function CardHints({
  card,
  leftOpacity,
  rightOpacity,
}: {
  card: Card;
  leftOpacity: MotionValue<number> | number;
  rightOpacity: MotionValue<number> | number;
}) {
  return (
    <>
      <motion.span className="choice-hint choice-hint--left" style={{ opacity: leftOpacity }}>
        {card.left.label}
      </motion.span>
      <motion.span className="choice-hint choice-hint--right" style={{ opacity: rightOpacity }}>
        {card.right.label}
      </motion.span>
    </>
  );
}

function StandardCard({
  card,
  portraitFailed,
  onPortraitError,
}: {
  card: Card;
  portraitFailed: boolean;
  onPortraitError: () => void;
}) {
  const portrait = portraitPath(card.speaker.portrait);

  return (
    <>
      <header className="card-header">
        <p className="speaker-title">{card.speaker.title ?? 'Dartmouth workshop'}</p>
        <h2>{card.speaker.name}</h2>
      </header>
      <figure className="portrait-slot" aria-label={`${card.speaker.name} portrait`}>
        {portrait && !portraitFailed ? (
          <img
            src={portrait}
            alt={`${card.speaker.name} portrait`}
            onError={onPortraitError}
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
    </>
  );
}

function LetterCard({ card }: { card: Card }) {
  return (
    <>
      <header className="card-letter-header">
        <p>From {card.speaker.title ?? card.speaker.name}</p>
        <span>1956</span>
      </header>
      <p className="card-prompt card-letter-prompt">{card.prompt}</p>
      <p className="card-letter-signature">{card.speaker.name}</p>
    </>
  );
}

function NewswireCard({ card }: { card: Card }) {
  const source = card.speaker.name || card.speaker.title || 'Dartmouth workshop';

  return (
    <>
      <header className="card-wire-header">
        <p>WIRE</p>
      </header>
      <p className="card-prompt card-wire-prompt">{card.prompt}</p>
      <p className="card-wire-source">
        {source} · {card.era}
      </p>
    </>
  );
}

function NotebookCard({ card }: { card: Card }) {
  return (
    <>
      <header className="card-notebook-header">
        <p>From your notebook</p>
      </header>
      <p className="card-prompt card-notebook-prompt">{card.prompt}</p>
    </>
  );
}

function InterstitialCard({ card }: { card: Card }) {
  return (
    <>
      <header className="card-interstitial-header">
        <Calendar aria-hidden size={16} />
        <span>{interstitialDateLabels[card.id] ?? 'SUMMER 1956'}</span>
      </header>
      <p className="card-prompt card-interstitial-prompt">{card.prompt}</p>
    </>
  );
}

function CardView({ card, leftOpacity = 0.16, rightOpacity = 0.16 }: CardViewProps) {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const form = card.is_interstitial ? 'interstitial' : (card.form ?? 'standard');

  useEffect(() => {
    setPortraitFailed(false);
  }, [card.id, card.speaker.portrait]);

  return (
    <article className={`card-view card-view--${form}`}>
      <CardHints card={card} leftOpacity={leftOpacity} rightOpacity={rightOpacity} />
      {form === 'interstitial' && <InterstitialCard card={card} />}
      {form === 'letter' && <LetterCard card={card} />}
      {form === 'newswire' && <NewswireCard card={card} />}
      {form === 'notebook' && <NotebookCard card={card} />}
      {form === 'standard' && (
        <StandardCard
          card={card}
          portraitFailed={portraitFailed}
          onPortraitError={() => setPortraitFailed(true)}
        />
      )}
    </article>
  );
}

export default CardView;
