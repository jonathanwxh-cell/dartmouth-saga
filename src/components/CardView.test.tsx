import { render, screen } from '@testing-library/react';
import CardView from './CardView';
import { makeCard } from '../engine/testFixtures';

describe('CardView', () => {
  it('renders an image when the speaker portrait exists', () => {
    const card = makeCard({
      speaker: {
        name: 'John McCarthy',
        title: 'Dartmouth',
        portrait: 'mccarthy.png',
      },
    });

    render(<CardView card={card} />);

    expect(screen.getByRole('img', { name: /john mccarthy portrait/i })).toHaveAttribute(
      'src',
      expect.stringContaining('/portraits/mccarthy.png'),
    );
    expect(screen.queryByText('JM')).not.toBeInTheDocument();
  });

  it('keeps the monogram fallback when the portrait is missing', () => {
    const card = makeCard({
      speaker: {
        name: 'Ada Lovelace',
        title: 'Correspondence',
        portrait: 'missing-portrait.png',
      },
    });

    render(<CardView card={card} />);

    expect(screen.queryByRole('img', { name: /ada lovelace portrait/i })).not.toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });
});
