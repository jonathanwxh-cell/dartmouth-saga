import { act, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { useGameStore } from '../state/store';
import { useActAttribute } from './useActAttribute';

function ActHarness() {
  useActAttribute();
  return null;
}

describe('useActAttribute', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-act');
    useGameStore.setState({ flags: new Set() });
  });

  it('sets data-act to "opening" when no act flags are set', () => {
    render(createElement(ActHarness));

    expect(document.body.dataset.act).toBe('opening');
  });

  it('sets data-act to "middle" when middle-started is set', async () => {
    render(createElement(ActHarness));

    act(() => {
      useGameStore.setState({ flags: new Set(['middle-started']) });
    });

    await waitFor(() => expect(document.body.dataset.act).toBe('middle'));
  });

  it('sets data-act to "closing" when closing-started is set, regardless of middle-started', async () => {
    render(createElement(ActHarness));

    act(() => {
      useGameStore.setState({ flags: new Set(['middle-started', 'closing-started']) });
    });

    await waitFor(() => expect(document.body.dataset.act).toBe('closing'));
  });
});
