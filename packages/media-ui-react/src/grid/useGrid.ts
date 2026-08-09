import { useEffect, useRef, useCallback } from 'react';

export interface UseGridOptions {
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  threshold?: number;
  rootMargin?: string;
}

export interface UseGridReturn {
  sentinelRef: (node: HTMLElement | null) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  triggerLoadMore: () => void;
}

export function useGrid({
  loading = false,
  hasMore = true,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '200px',
}: UseGridOptions = {}): UseGridReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelElementRef = useRef<HTMLElement | null>(null);

  const triggerLoadMore = useCallback(() => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      sentinelElementRef.current = node;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || typeof IntersectionObserver === 'undefined') {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first && first.isIntersecting && !loading && hasMore && onLoadMore) {
            onLoadMore();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore, threshold, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    sentinelRef,
    containerRef,
    triggerLoadMore,
  };
}
