import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MediaProvider, useMedia } from '../src';
import { MediaClient } from '@headless-media/core';

const TestComponent = () => {
  const { isReady, client } = useMedia();
  return (
    <div>
      <span data-testid="status">{isReady ? 'READY' : 'NOT_READY'}</span>
      <span data-testid="has-client">{client instanceof MediaClient ? 'YES' : 'NO'}</span>
    </div>
  );
};

describe('MediaProvider and useMedia', () => {
  it('provides MediaClient instance to consumers', () => {
    render(
      <MediaProvider config={{ mockMode: true }}>
        <TestComponent />
      </MediaProvider>
    );

    expect(screen.getByTestId('status').textContent).toBe('READY');
    expect(screen.getByTestId('has-client').textContent).toBe('YES');
  });

  it('throws error when useMedia is used outside MediaProvider', () => {
    // Suppress console.error for expected test boundary throw
    const originalConsoleError = console.error;
    console.error = () => {};

    expect(() => render(<TestComponent />)).toThrowError(
      /useMedia must be used within a <MediaProvider>/
    );

    console.error = originalConsoleError;
  });
});
