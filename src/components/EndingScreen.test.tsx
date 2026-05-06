import { fireEvent, render, screen } from '@testing-library/react';
import EndingScreen from './EndingScreen';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function setEnding(
  gameOver: ReturnType<typeof useGameStore.getState>['gameOver'],
  stateOverrides: Partial<ReturnType<typeof makeState>> = {}
) {
  const reset = vi.fn();
  const state = makeState(stateOverrides);

  useGameStore.setState({
    ...state,
    gameOver,
    rng: () => 0,
    pool: [],
    init: vi.fn(),
    reset,
    swipe: vi.fn()
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
});
