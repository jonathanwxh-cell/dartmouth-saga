import { act, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { useGameStore } from '../state/store';
import { useEraAttribute } from './useEraAttribute';

function EraHarness() {
  useEraAttribute();
  return null;
}

describe('useEraAttribute', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-era');
    useGameStore.setState({ era: '1956' });
  });

  it('sets document.body.dataset.era to the current era on mount', () => {
    render(createElement(EraHarness));

    expect(document.body.dataset.era).toBe('1956');
  });

  it('updates the attribute when the store era changes', async () => {
    render(createElement(EraHarness));

    act(() => {
      useGameStore.setState({ era: '1974' });
    });

    await waitFor(() => expect(document.body.dataset.era).toBe('1974'));
  });
});
