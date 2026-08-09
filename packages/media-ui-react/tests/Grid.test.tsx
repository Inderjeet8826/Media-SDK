import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from '../src/grid/Grid';

describe('Grid Component', () => {
  const sampleItems = [
    { id: 1, title: 'Item One' },
    { id: 2, title: 'Item Two' },
    { id: 3, title: 'Item Three' },
  ];

  it('renders items via renderItem prop with proper role', () => {
    render(
      <Grid
        items={sampleItems}
        renderItem={(item) => <div data-testid="grid-cell">{item.title}</div>}
      />
    );

    const cells = screen.getAllByTestId('grid-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0].textContent).toBe('Item One');
  });

  it('renders empty state when items is empty and renderEmpty is supplied', () => {
    render(
      <Grid
        items={[]}
        renderItem={(item: any) => <div>{item.title}</div>}
        renderEmpty={() => <div data-testid="empty-state">No media available</div>}
      />
    );

    expect(screen.getByTestId('empty-state').textContent).toBe('No media available');
  });

  it('renders loading indicator when loading is true', () => {
    render(
      <Grid
        items={sampleItems}
        loading={true}
        renderItem={(item) => <div>{item.title}</div>}
        renderLoading={() => <div data-testid="loading-indicator">Loading more...</div>}
      />
    );

    expect(screen.getByTestId('loading-indicator')).toBeDefined();
  });
});
