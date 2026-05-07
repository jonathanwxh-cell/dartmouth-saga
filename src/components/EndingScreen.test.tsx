import { fireEvent, render, screen } from '@testing-library/react';
import EndingScreen from './EndingScreen';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function setEnding(
  gameOver: ReturnType<typeof useGameStore.getState>['gameOver'],
  stateOverrides: Partial<ReturnType<typeof makeState>> = {},
  storeOverrides: Partial<ReturnType<typeof useGameStore.getState>> = {}
) {
  const reset = vi.fn();
  const state = makeState(stateOverrides);

  useGameStore.setState({
    ...state,
    gameOver,
    rng: () => 0,
    pool: [],
    endingStats: { discovered: {}, totalRuns: 0 },
    swipesThisRun: 0,
    lastDiscoveryWasNew: false,
    init: vi.fn(),
    reset,
    swipe: vi.fn(),
    ...storeOverrides
  });

  return reset;
}

describe('EndingScreen', () => {
  it('renders the proposal-funded title and narrative when game state matches', () => {
    setEnding(
      { reason: 'pool-exhausted' },
      {
        qualities: {
          ...makeState().qualities,
          symbolic_progress: 80,
          funding: 60,
          academic_credibility: 55
        }
      }
    );

    render(<EndingScreen />);

    expect(screen.getByRole('heading', { name: /the proposal is funded/i })).toBeInTheDocument();
    expect(screen.getByText(/The Rockefeller Foundation grants \$7,500/i)).toBeInTheDocument();
  });

  it('renders the boundary-collapse narrative when applicable', () => {
    setEnding({ reason: 'boundary', quality: 'funding', kind: 'collapse' });

    render(<EndingScreen />);

    expect(screen.getByRole('heading', { name: /ran out of grant money/i })).toBeInTheDocument();
    expect(screen.getByText(/no one mails it/i)).toBeInTheDocument();
  });

  it('Begin again button calls reset()', () => {
    const reset = setEnding({ reason: 'pool-exhausted' });

    render(<EndingScreen />);
    fireEvent.click(screen.getByRole('button', { name: /begin again/i }));

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('renders the run summary line with the current swipe count', () => {
    setEnding(
      { reason: 'boundary', quality: 'funding', kind: 'collapse' },
      {},
      {
        endingStats: {
          discovered: {
            'funding-collapse': { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' }
          },
          totalRuns: 1
        },
        swipesThisRun: 47
      }
    );

    render(<EndingScreen />);

    expect(screen.getByText('Endings: 1 / 15 · This run lasted 47 swipes')).toBeInTheDocument();
  });

  it('renders the New-ending flourish only on first discovery', () => {
    setEnding(
      { reason: 'boundary', quality: 'funding', kind: 'collapse' },
      {},
      {
        endingStats: {
          discovered: {
            'funding-collapse': { count: 1, firstSeen: '2026-05-07T04:30:00.000Z' }
          },
          totalRuns: 1
        },
        lastDiscoveryWasNew: true
      }
    );

    render(<EndingScreen />);

    expect(screen.getByText('✦ New ending discovered')).toBeInTheDocument();
  });

  it('does not render the flourish when ending was already in stats with count > 0 before this run', () => {
    setEnding(
      { reason: 'boundary', quality: 'funding', kind: 'collapse' },
      {},
      {
        endingStats: {
          discovered: {
            'funding-collapse': { count: 2, firstSeen: '2026-05-01T04:30:00.000Z' }
          },
          totalRuns: 2
        },
        lastDiscoveryWasNew: false
      }
    );

    render(<EndingScreen />);

    expect(screen.queryByText('✦ New ending discovered')).not.toBeInTheDocument();
  });
});
