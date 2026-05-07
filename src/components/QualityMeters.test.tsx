import { fireEvent, render, screen } from '@testing-library/react';
import QualityMeters from './QualityMeters';
import type { EngineEvent } from '../engine/types';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

const storageKey = 'dartmouth-saga:audio-muted';

describe('QualityMeters', () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.setState({ audioMuted: false });
  });

  it('renders six progressbars with correct aria-valuenow', () => {
    render(<QualityMeters qualities={makeState().qualities} />);

    const meters = screen.getAllByRole('progressbar');

    expect(meters).toHaveLength(6);
    expect(meters.map((meter) => meter.getAttribute('aria-valuenow'))).toEqual([
      '50',
      '50',
      '50',
      '50',
      '50',
      '50'
    ]);
  });

  it('renders the new meter codes', () => {
    render(<QualityMeters qualities={makeState().qualities} />);

    expect(screen.getByText('PROG')).toBeInTheDocument();
    expect(screen.getByText('FUND')).toBeInTheDocument();
    expect(screen.getByText('TRUST')).toBeInTheDocument();
    expect(screen.getByText('CRED')).toBeInTheDocument();
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('TEAM')).toBeInTheDocument();
  });

  it('renders meter delta floater when lastEvent has a change', () => {
    const lastEvent: EngineEvent = {
      cardId: 'sample-card',
      side: 'right',
      changes: {
        funding: { from: 50, to: 55, delta: 5 },
        public_trust: { from: 50, to: 47, delta: -3 }
      },
      flagsAdded: []
    };

    render(<QualityMeters qualities={makeState().qualities} lastEvent={lastEvent} />);

    expect(screen.getByText('Funding +5')).toBeInTheDocument();
    expect(screen.getByText('Public trust −3')).toBeInTheDocument();
  });

  it('clamps display when a quality is at 100', () => {
    const qualities = { ...makeState().qualities, compute: 140 };

    render(<QualityMeters qualities={qualities} />);

    expect(screen.getByLabelText('IBM 704 compute hours')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders a mute toggle that persists the muted state', () => {
    render(<QualityMeters qualities={makeState().qualities} />);

    fireEvent.click(screen.getByRole('button', { name: /mute audio/i }));

    expect(useGameStore.getState().audioMuted).toBe(true);
    expect(localStorage.getItem(storageKey)).toBe('1');
    expect(screen.getByRole('button', { name: /unmute audio/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
