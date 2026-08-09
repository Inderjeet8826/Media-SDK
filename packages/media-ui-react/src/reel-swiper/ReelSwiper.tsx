import React, { ReactNode } from 'react';
import { BaseComponentProps } from '../types';
import { useReelSwiper, UseReelSwiperOptions } from './useReelSwiper';

export interface ReelSwiperProps<TItem> extends BaseComponentProps, UseReelSwiperOptions<TItem> {
  renderItem: (item: TItem, index: number, isActive: boolean) => ReactNode;
  height?: string | number;
  width?: string | number;
  renderOverlay?: (activeIndex: number, totalCount: number) => ReactNode;
}

export function ReelSwiper<TItem>({
  items,
  initialIndex = 0,
  onActiveIndexChange,
  threshold = 0.6,
  renderItem,
  renderOverlay,
  height = '100%',
  width = '100%',
  className,
  style,
  id,
}: ReelSwiperProps<TItem>) {
  const { activeIndex, containerRef, registerItem } = useReelSwiper({
    items,
    initialIndex,
    onActiveIndexChange,
    threshold,
  });

  const containerStyle: React.CSSProperties = {
    height,
    width,
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    ...style,
  };

  const itemStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={containerStyle}
      role="region"
      aria-label="Reel Swiper"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            ref={registerItem(index)}
            data-reel-index={index}
            style={itemStyle}
            aria-hidden={!isActive}
          >
            {renderItem(item, index, isActive)}
          </div>
        );
      })}

      {renderOverlay && (
        <div style={{ position: 'sticky', bottom: '1rem', left: '1rem', zIndex: 10, pointerEvents: 'none' }}>
          {renderOverlay(activeIndex, items.length)}
        </div>
      )}
    </div>
  );
}
