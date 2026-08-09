import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReelSwiper } from '../src/reel-swiper/ReelSwiper';

describe('ReelSwiper Component', () => {
  const sampleReels = [
    { id: 10, title: 'Reel 1' },
    { id: 20, title: 'Reel 2' },
    { id: 30, title: 'Reel 3' },
  ];

  it('renders all reel slides', () => {
    render(
      <ReelSwiper
        items={sampleReels}
        renderItem={(item, _, isActive) => (
          <div data-testid="reel-item">{item.title} - {isActive ? 'ACTIVE' : 'INACTIVE'}</div>
        )}
      />
    );

    const items = screen.getAllByTestId('reel-item');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('ACTIVE');
    expect(items[1].textContent).toContain('INACTIVE');
  });
});
