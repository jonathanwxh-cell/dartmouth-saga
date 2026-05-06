import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CardStack from './CardStack';
import { makeCard, makeState } from '../engine/testFixtures';
import { useGameStore } from '../state/store';

function arrangeStore(overrides = {}) {
  const card = makeCard({ id: 'keyboard-card', prompt: 'Keyboard path prompt.' });
  const swipe = vi.fn();

  useGameStore.setState({
    ...makeState({ currentCard: card }),
    gameOver: null,
    rng: () => 0,
    pool: [card],
    init: vi.fn(),
    reset: vi.fn(),
    swipe,
    ...overrides
  });

  return { card, swipe };
}

describe('CardStack', () => {
  it("renders the current card's prompt", () => {
    arrangeStore();

    render(<CardStack />);

    expect(screen.getByText('Keyboard path prompt.')).toBeInTheDocument();
  });

  it("pressing ArrowRight invokes swipe('right')", async () => {
    const { swipe } = arrangeStore();

    render(<CardStack />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    await waitFor(() => expect(swipe).toHaveBeenCalledWith('right'));
  });

  it("pressing ArrowLeft invokes swipe('left')", async () => {
    const { swipe } = arrangeStore();

    render(<CardStack />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    await waitFor(() => expect(swipe).toHaveBeenCalledWith('left'));
  });

  it('does not respond to keys when gameOver is set', () => {
    const { swipe } = arrangeStore({ gameOver: { reason: 'pool-exhausted' } });

    render(<CardStack />);
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(swipe).not.toHaveBeenCalled();
  });

  it("clicking the left arrow button invokes swipe('left')", async () => {
    const { swipe } = arrangeStore();

    render(<CardStack />);
    fireEvent.click(screen.getByRole('button', { name: /conserve/i }));

    await waitFor(() => expect(swipe).toHaveBeenCalledWith('left'));
  });

  it("clicking the right arrow button invokes swipe('right')", async () => {
    const { swipe } = arrangeStore();

    render(<CardStack />);
    fireEvent.click(screen.getByRole('button', { name: /commit/i }));

    await waitFor(() => expect(swipe).toHaveBeenCalledWith('right'));
  });

  it('arrow buttons are disabled when gameOver is set', () => {
    arrangeStore({ gameOver: { reason: 'pool-exhausted' } });

    render(<CardStack />);

    expect(screen.getByRole('button', { name: /conserve/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /commit/i })).toBeDisabled();
  });
});
