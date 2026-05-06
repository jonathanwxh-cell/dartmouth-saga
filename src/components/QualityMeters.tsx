import type { CSSProperties } from 'react';
import type { Quality } from '../engine/types';

const qualityMeta: Array<{ key: Quality; label: string; short: string }> = [
  { key: 'symbolic_progress', label: 'Symbolic progress', short: 'SYM' },
  { key: 'funding', label: 'Funding', short: 'FND' },
  { key: 'public_trust', label: 'Public trust', short: 'TRU' },
  { key: 'academic_credibility', label: 'Academic credibility', short: 'CRD' },
  { key: 'compute', label: 'Compute', short: 'CMP' },
  { key: 'team_morale', label: 'Team morale', short: 'MOR' }
];

interface QualityMetersProps {
  qualities: Record<Quality, number>;
}

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

function QualityMeters({ qualities }: QualityMetersProps) {
  return (
    <section className="quality-strip" aria-label="Quality meters">
      {qualityMeta.map(({ key, label, short }) => {
        const value = clamp(qualities[key]);
        const style = { '--meter-value': `${value}%` } as CSSProperties;

        return (
          <div
            key={key}
            className="quality-meter"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
          >
            <span className="quality-label">{short}</span>
            <span className="quality-track" style={style}>
              <span className="quality-fill" />
            </span>
            <span className="quality-value">{value}</span>
          </div>
        );
      })}
    </section>
  );
}

export default QualityMeters;
