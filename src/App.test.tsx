import { render, screen } from '@testing-library/react';
import App from './App';
import { useGameStore } from './state/store';

describe('App', () => {
  beforeEach(() => {
    useGameStore.setState({ currentCard: null, gameOver: null, tutorialSeen: true });
  });

  it('renders the project title', () => {
    render(<App />);

    expect(screen.getByText('The Dartmouth Saga')).toBeInTheDocument();
  });

  it('renders the v0.1 status line', () => {
    render(<App />);

    expect(screen.getByText(/v0\.1 — coming soon/)).toBeInTheDocument();
  });
});
