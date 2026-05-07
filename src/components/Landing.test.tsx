import { fireEvent, render, screen } from '@testing-library/react';
import Landing from './Landing';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function arrangeStore(hasSave: boolean) {
  const init = vi.fn();
  const continueSavedGame = vi.fn();
  const refreshSaveStatus = vi.fn();

  useGameStore.setState({
    ...makeState(),
    gameOver: null,
    rng: () => 0,
    pool: [],
    audioMuted: false,
    tutorialSeen: true,
    lastEvent: null,
    hasSave,
    endingStats: { discovered: {}, totalRuns: 0 },
    swipesThisRun: 0,
    lastDiscoveryWasNew: false,
    init,
    reset: vi.fn(),
    setAudioMuted: vi.fn(),
    swipe: vi.fn(),
    markTutorialSeen: vi.fn(),
    continueSavedGame,
    refreshSaveStatus,
    clearEndingStats: vi.fn()
  });

  return { init, continueSavedGame, refreshSaveStatus };
}

describe('Landing', () => {
  it('renders New game and Today challenge actions', () => {
    arrangeStore(false);

    render(<Landing />);

    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /today's challenge/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument();
  });

  it('renders Continue when a saved run exists', () => {
    arrangeStore(true);

    render(<Landing />);

    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('clicking Continue asks the store to hydrate a saved game', () => {
    const { continueSavedGame } = arrangeStore(true);

    render(<Landing />);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(continueSavedGame).toHaveBeenCalledTimes(1);
  });

  it('clicking Today challenge initializes with a deterministic daily seed', () => {
    const { init } = arrangeStore(false);

    render(<Landing />);
    fireEvent.click(screen.getByRole('button', { name: /today's challenge/i }));

    expect(init).toHaveBeenCalledWith(expect.any(Number));
  });

  it('renders the endings discovered counter below the action buttons', () => {
    arrangeStore(false);
    useGameStore.setState({
      endingStats: {
        discovered: {
          'proposal-funded': { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' },
          partial: { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' },
          canceled: { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' }
        },
        totalRuns: 3
      }
    });

    render(<Landing />);

    expect(screen.getByText('Endings discovered: 3 / 15')).toBeInTheDocument();
  });
});
