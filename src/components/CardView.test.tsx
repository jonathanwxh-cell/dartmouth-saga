import { render, screen } from '@testing-library/react';
import CardView from './CardView';
import { makeCard } from '../engine/testFixtures';

describe('CardView', () => {
  it('renders the standard layout when card has no form field', () => {
    const card = makeCard({
      speaker: {
        name: 'John McCarthy',
        title: 'Dartmouth',
        portrait: 'mccarthy.png',
      },
      prompt: 'The workshop needs another box of chalk.',
    });

    const { container } = render(<CardView card={card} />);

    expect(container.querySelector('.card-header')).toBeInTheDocument();
    expect(container.querySelector('.portrait-slot')).toBeInTheDocument();
    expect(screen.getByText('The workshop needs another box of chalk.')).toHaveClass('card-prompt');
  });

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

  it('renders the letter form with no portrait when card.form === "letter"', () => {
    const card = {
      ...makeCard({
        speaker: {
          name: 'Norbert Wiener',
          title: 'MIT',
          portrait: 'missing-portrait.png',
        },
        prompt: 'A careful letter arrives with a colder answer than expected.',
      }),
      form: 'letter' as const,
    };

    const { container } = render(<CardView card={card} />);

    expect(container.querySelector('.card-view--letter')).toBeInTheDocument();
    expect(container.querySelector('.portrait-slot')).not.toBeInTheDocument();
    expect(screen.getByText('From MIT')).toBeInTheDocument();
    expect(screen.getByText('1956')).toBeInTheDocument();
    expect(screen.getByText('Norbert Wiener')).toHaveClass('card-letter-signature');
  });

  it('renders the newswire form when card.form === "newswire"', () => {
    const card = {
      ...makeCard({
        speaker: {
          name: 'Reporter',
          title: 'Boston Globe',
          portrait: 'reporter-generic.png',
        },
        prompt: 'A short item runs under the science column.',
      }),
      form: 'newswire' as const,
    };

    const { container } = render(<CardView card={card} />);

    expect(container.querySelector('.card-view--newswire')).toBeInTheDocument();
    expect(container.querySelector('.portrait-slot')).not.toBeInTheDocument();
    expect(screen.getByText('WIRE')).toBeInTheDocument();
    expect(screen.getByText('Reporter · 1956')).toBeInTheDocument();
  });

  it('renders the notebook form when card.form === "notebook"', () => {
    const card = {
      ...makeCard({
        speaker: {
          name: 'Your notebook',
          portrait: '',
        },
        prompt: 'A pencil note gets tucked into the back of the drawer.',
      }),
      form: 'notebook' as const,
    };

    const { container } = render(<CardView card={card} />);

    expect(container.querySelector('.card-view--notebook')).toBeInTheDocument();
    expect(container.querySelector('.portrait-slot')).not.toBeInTheDocument();
    expect(screen.getByText('From your notebook')).toBeInTheDocument();
  });

  it('renders the interstitial layout when card.is_interstitial is true', () => {
    const card = {
      ...makeCard({
        id: 'interstitial-week-one-ends',
        speaker: {
          name: '',
          portrait: '',
        },
        prompt: 'Week One ends. The chalk supply is holding up.',
        left: { label: 'Continue', effects: {} },
        right: { label: 'Continue', effects: {} },
      }),
      is_interstitial: true,
    };

    const { container } = render(<CardView card={card} />);

    expect(container.querySelector('.card-view--interstitial')).toBeInTheDocument();
    expect(container.querySelector('.portrait-slot')).not.toBeInTheDocument();
    expect(screen.getByText('JUNE 25 · WEEK ONE')).toBeInTheDocument();
  });
});
