import React, { ReactNode } from 'react';

// Pure headless typing contracts for React Native consumers

export interface NativeGridProps<TItem> {
  items: TItem[];
  renderItem: (info: { item: TItem; index: number }) => ReactNode;
  numColumns?: number;
  loading?: boolean;
  onLoadMore?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: ReactNode | (() => ReactNode);
  ListFooterComponent?: ReactNode | (() => ReactNode);
  keyExtractor?: (item: TItem, index: number) => string;
}

export interface NativeLightboxProps<TItem> {
  items: TItem[];
  isOpen: boolean;
  activeIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  renderItem: (info: {
    item: TItem;
    index: number;
    close: () => void;
    next: () => void;
    prev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
  }) => ReactNode;
}

export interface NativeReelSwiperProps<TItem> {
  items: TItem[];
  initialIndex?: number;
  onActiveIndexChange?: (index: number, item: TItem) => void;
  renderItem: (info: { item: TItem; index: number; isActive: boolean }) => ReactNode;
}

/**
 * Headless Grid Adapter Contract for React Native FlatList
 */
export function createGridContract<TItem>() {
  return {
    getItemKey: (item: TItem, index: number) => `item-${index}`,
    getEndReachedHandler: (onLoadMore?: () => void, loading?: boolean) => () => {
      if (!loading && onLoadMore) {
        onLoadMore();
      }
    },
  };
}

/**
 * Headless Lightbox Navigation helper for React Native
 */
export function useNativeLightboxNavigation<TItem>(
  items: TItem[],
  activeIndex: number,
  onIndexChange?: (index: number) => void
) {
  const hasNext = activeIndex < items.length - 1;
  const hasPrev = activeIndex > 0;

  const next = () => {
    if (hasNext && onIndexChange) {
      onIndexChange(activeIndex + 1);
    }
  };

  const prev = () => {
    if (hasPrev && onIndexChange) {
      onIndexChange(activeIndex - 1);
    }
  };

  return { hasNext, hasPrev, next, prev };
}
