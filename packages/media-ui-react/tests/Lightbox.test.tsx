import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Lightbox } from '../src/lightbox/Lightbox';

describe('Lightbox Component', () => {
  const sampleItems = [
    { id: 1, title: 'Photo A' },
    { id: 2, title: 'Photo B' },
    { id: 3, title: 'Photo C' },
  ];

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Lightbox
        items={sampleItems}
        isOpen={false}
        activeIndex={0}
        renderItem={(item) => <div>{item.title}</div>}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders active item when isOpen is true with dialog role', () => {
    render(
      <Lightbox
        items={sampleItems}
        isOpen={true}
        activeIndex={1}
        renderItem={(item) => <div data-testid="lightbox-content">{item.title}</div>}
      />
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeDefined();
    expect(screen.getByTestId('lightbox-content').textContent).toBe('Photo B');
  });

  it('triggers onClose when Escape key is pressed', () => {
    const onClose = vi.fn();

    render(
      <Lightbox
        items={sampleItems}
        isOpen={true}
        activeIndex={0}
        onClose={onClose}
        renderItem={(item) => <div>{item.title}</div>}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onIndexChange on ArrowRight navigation', () => {
    const onIndexChange = vi.fn();

    render(
      <Lightbox
        items={sampleItems}
        isOpen={true}
        activeIndex={0}
        onIndexChange={onIndexChange}
        renderItem={(item) => <div>{item.title}</div>}
      />
    );

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
