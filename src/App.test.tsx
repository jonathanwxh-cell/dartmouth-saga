import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the project title', () => {
    render(<App />);

    expect(screen.getByText('The Dartmouth Saga')).toBeInTheDocument();
  });

  it('renders the v0.1 status line', () => {
    render(<App />);

    expect(screen.getByText(/v0\.1 — coming soon/)).toBeInTheDocument();
  });
});
