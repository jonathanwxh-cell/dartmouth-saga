import { render, screen, within } from '@testing-library/react';
import EndingsArchive from './EndingsArchive';
import { useGameStore } from '../state/store';
import { makeState } from '../engine/testFixtures';

function arrangeArchive() {
  useGameStore.setState({
    ...makeState(),
    gameOver: null,
    rng: () => 0,
    pool: [],
    audioMuted: false,
    tutorialSeen: true,
    lastEvent: null,
    hasSave: false,
    endingStats: {
      discovered: {
        'proposal-funded': { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' },
        'funding-collapse': { count: 2, firstSeen: '2026-05-06T04:30:00.000Z' }
      },
      totalRuns: 3
    },
    swipesThisRun: 0,
    lastDiscoveryWasNew: false,
    init: vi.fn(),
    reset: vi.fn(),
    setAudioMuted: vi.fn(),
    swipe: vi.fn(),
    markTutorialSeen: vi.fn(),
    continueSavedGame: vi.fn(),
    refreshSaveStatus: vi.fn(),
    clearEndingStats: vi.fn()
  });
}

describe('EndingsArchive', () => {
  it('renders all 15 ending rows', () => {
    arrangeArchive();

    render(<EndingsArchive />);

    expect(screen.getAllByRole('listitem')).toHaveLength(15);
  });

  it('locked endings show ??? and the matching mechanical hint', () => {
    arrangeArchive();

    render(<EndingsArchive />);

    expect(screen.getAllByText('???')).toHaveLength(13);
    expect(screen.getByText(/Push public trust to its limit\./)).toBeInTheDocument();
  });

  it('discovered endings show their title and excerpt', () => {
    arrangeArchive();

    render(<EndingsArchive />);

    expect(screen.getByRole('heading', { name: /the proposal is funded/i })).toBeInTheDocument();
    expect(
      screen.getByText(/The Rockefeller Foundation grants \$7,500 to the workshop\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /you ran out of grant money/i })).toBeInTheDocument();
    expect(screen.getByText(/Reached 2 times/i)).toBeInTheDocument();
  });

  it('category headers show the discovered/total fraction', () => {
    arrangeArchive();

    render(<EndingsArchive />);

    expect(screen.getByText('Three main endings (1 / 3)')).toBeInTheDocument();
    expect(screen.getByText('Twelve boundary endings (1 / 12)')).toBeInTheDocument();
  });

  it('starts collapsed behind a Show all endings summary', () => {
    arrangeArchive();

    render(<EndingsArchive />);

    const archive = screen.getByTestId('endings-archive');
    expect(within(archive).getByText('Show all endings')).toBeInTheDocument();
    expect(archive).not.toHaveAttribute('open');
  });
});
