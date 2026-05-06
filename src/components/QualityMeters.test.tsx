import { render, screen } from '@testing-library/react';
import QualityMeters from './QualityMeters';
import { makeState } from '../engine/testFixtures';

describe('QualityMeters', () => {
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
});
