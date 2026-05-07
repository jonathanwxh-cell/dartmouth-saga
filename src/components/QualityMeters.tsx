import type { CSSProperties } from 'react';
import MeterDelta from './MeterDelta';
import MuteToggle from './MuteToggle';
import type { EngineEvent, Quality } from '../engine/types';

export const qualityFullNames: Record<Quality, string> = {
  symbolic_progress: 'Symbolic progress',
  funding: 'Funding',
  public_trust: 'Public trust',
  academic_credibility: 'Academic credibility',
  compute: 'IBM 704 compute hours',
  team_morale: 'Team morale'
};

export const qualityMeta: Array<{ key: Quality; short: string }> = [
  { key: 'symbolic_progress', short: 'PROG' },
  { key: 'funding', short: 'FUND' },
  { key: 'public_trust', short: 'TRUST' },
  { key: 'academic_credibility', short: 'CRED' },
  { key: 'compute', short: 'CPU' },
  { key: 'team_morale', short: 'TEAM' }
];

interface QualityMetersProps {
  qualities: Record<Quality, number>;
  lastEvent?: EngineEvent | null;
}

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

function QualityMeters({ qualities, lastEvent = null }: QualityMetersProps) {
  return (
    <header className="quality-strip" aria-label="Quality meters">
      <div className="quality-strip-actions">
        <MuteToggle />
      </div>
      <div className="quality-meter-row">
        {qualityMeta.map(({ key, short }) => {
          const value = clamp(qualities[key]);
          const style = { '--meter-value': `${value}%` } as CSSProperties;
          const change = lastEvent?.changes[key];
          const eventId = lastEvent
            ? `${lastEvent.cardId}-${lastEvent.side}-${key}-${change?.from ?? value}-${change?.to ?? value}`
            : key;

          return (
            <div
              key={key}
              className="quality-meter"
              role="progressbar"
              aria-label={qualityFullNames[key]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
            >
              <span className="quality-label">{short}</span>
              <span className="quality-track" style={style}>
                <span className="quality-fill" />
              </span>
              <span className="quality-value">{value}</span>
              {change ? <MeterDelta quality={key} change={change} eventId={eventId} /> : null}
            </div>
          );
        })}
      </div>
    </header>
  );
}

export default QualityMeters;
