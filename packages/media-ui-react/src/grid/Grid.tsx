import React, { ReactNode } from 'react';
import { BaseComponentProps } from '../types';
import { useGrid, UseGridOptions } from './useGrid';

export interface GridProps<TItem> extends BaseComponentProps, UseGridOptions {
  items: TItem[];
  renderItem: (item: TItem, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderFooter?: () => ReactNode;
  keyExtractor?: (item: TItem, index: number) => string | number;
  columns?: number;
  gap?: number | string;
  role?: string;
  'aria-label'?: string;
}

export function Grid<TItem>({
  items,
  renderItem,
  renderEmpty,
  renderLoading,
  renderFooter,
  keyExtractor,
  loading = false,
  hasMore = true,
  onLoadMore,
  threshold,
  rootMargin,
  columns,
  gap,
  className,
  style,
  id,
  role = 'feed',
  'aria-label': ariaLabel = 'Media Grid',
}: GridProps<TItem>) {
  const { sentinelRef, containerRef } = useGrid({
    loading,
    hasMore,
    onLoadMore,
    threshold,
    rootMargin,
  });

  const computedStyle: React.CSSProperties = {
    ...(columns
      ? {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: typeof gap === 'number' ? `${gap}px` : gap || '1rem',
        }
      : {}),
    ...style,
  };

  if (!loading && items.length === 0 && renderEmpty) {
    return <div className={className} style={style} id={id}>{renderEmpty()}</div>;
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={computedStyle}
      role={role}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index;
        return (
          <React.Fragment key={key}>
            {renderItem(item, index)}
          </React.Fragment>
        );
      })}

      {/* Infinite Scroll Intersection Sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{ width: '100%', height: '1px', pointerEvents: 'none', gridColumn: columns ? `1 / -1` : undefined }}
        />
      )}

      {loading && renderLoading && (
        <div style={{ gridColumn: columns ? `1 / -1` : undefined }}>
          {renderLoading()}
        </div>
      )}

      {renderFooter && (
        <div style={{ gridColumn: columns ? `1 / -1` : undefined }}>
          {renderFooter()}
        </div>
      )}
    </div>
  );
}
