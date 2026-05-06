import { fireEvent, render, screen } from '@testing-library/react';
import QualityMeters from './QualityMeters';
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

  it('clamps display when a quality is at 100', () => {
    const qualities = { ...makeState().qualities, compute: 140 };

    render(<QualityMeters qualities={qualities} />);

    expect(screen.getByLabelText('Compute')).toHaveAttribute('aria-valuenow', '100');
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
