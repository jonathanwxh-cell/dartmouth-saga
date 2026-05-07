import { fireEvent, render, screen } from '@testing-library/react';
import Onboarding from './Onboarding';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function arrangeStore(tutorialSeen: boolean, markTutorialSeen = vi.fn()) {
  useGameStore.setState({
    ...makeState(),
    gameOver: null,
    rng: () => 0,
    pool: [],
    audioMuted: false,
    tutorialSeen,
    lastEvent: null,
    init: vi.fn(),
    reset: vi.fn(),
    setAudioMuted: vi.fn(),
    swipe: vi.fn(),
    markTutorialSeen
  });

  return { markTutorialSeen };
}

describe('Onboarding', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the three-paragraph guide on first mount', () => {
    arrangeStore(false);

    render(<Onboarding />);

    expect(screen.getByText(/^It is June 1956\./)).toBeInTheDocument();
    expect(screen.getByText(/^The summer runs eight weeks\./)).toBeInTheDocument();
    expect(screen.getByText(/^Each card is a moment\./)).toBeInTheDocument();
    expect(screen.getByText('PROG')).toBeInTheDocument();
    expect(screen.getByText('Symbolic progress')).toBeInTheDocument();
  });

  it('does not render when tutorialSeen is true', () => {
    arrangeStore(true);

    const { container } = render(<Onboarding />);

    expect(container).toBeEmptyDOMElement();
  });

  it('clicking Begin the workshop calls markTutorialSeen', () => {
    const { markTutorialSeen } = arrangeStore(false);

    render(<Onboarding />);
    fireEvent.click(screen.getByRole('button', { name: /begin the workshop/i }));

    expect(markTutorialSeen).toHaveBeenCalledTimes(1);
  });
});
