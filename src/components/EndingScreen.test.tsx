import { fireEvent, render, screen } from '@testing-library/react';
import EndingScreen from './EndingScreen';
import { makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function setEnding(gameOver: ReturnType<typeof useGameStore.getState>['gameOver']) {
  const reset = vi.fn();

  useGameStore.setState({
    ...makeState(),
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
  it('renders the boundary reason for a collapse', () => {
    setEnding({ reason: 'boundary', quality: 'funding', kind: 'collapse' });

    render(<EndingScreen />);

    expect(screen.getByText(/ran out of grant money/i)).toBeInTheDocument();
    expect(screen.getByText(/funding/i)).toBeInTheDocument();
  });

  it('renders the pool-exhausted reason when applicable', () => {
    setEnding({ reason: 'pool-exhausted' });

    render(<EndingScreen />);

    expect(screen.getByText(/pool exhausted/i)).toBeInTheDocument();
  });

  it('Begin again button calls reset()', () => {
    const reset = setEnding({ reason: 'pool-exhausted' });

    render(<EndingScreen />);
    fireEvent.click(screen.getByRole('button', { name: /begin again/i }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
