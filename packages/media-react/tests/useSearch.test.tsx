import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MediaProvider, useSearch } from '../src';

const SearchTestComponent = ({ query }: { query: string }) => {
  const { items, loading, totalResults } = useSearch({
    query,
    debounceMs: 10,
  });

  return (
    <div>
      <div data-testid="loading-state">{loading ? 'LOADING' : 'IDLE'}</div>
      <div data-testid="total-results">{totalResults}</div>
      <ul data-testid="items-list">
        {items.map((item) => (
          <li key={item.id} data-testid="media-item">
            {item.alt || item.photographer}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('useSearch', () => {
  it('searches and populates items dynamically', async () => {
    render(
      <MediaProvider config={{ mockMode: true, enableLogging: false }}>
        <SearchTestComponent query="mountains" />
      </MediaProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('IDLE');
    });

    await waitFor(() => {
      const items = screen.getAllByTestId('media-item');
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
