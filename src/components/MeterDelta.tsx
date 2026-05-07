import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { qualityFullNames } from './QualityMeters';
import type { Quality, QualityChange } from '../engine/types';

interface MeterDeltaProps {
  quality: Quality;
  change: QualityChange;
  eventId: string;
}

function formatDelta(delta: number) {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `−${Math.abs(delta)}`;
  return '0';
}

function MeterDelta({ quality, change, eventId }: MeterDeltaProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(timeout);
  }, [eventId]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.span
          key={eventId}
          className="meter-delta"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 0, -18] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, times: [0, 0.25, 1], ease: 'easeOut' }}
        >
          {qualityFullNames[quality]} {formatDelta(change.delta)}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

export default MeterDelta;
