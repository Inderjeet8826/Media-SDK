import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseReelSwiperOptions<TItem> {
  items: TItem[];
  initialIndex?: number;
  onActiveIndexChange?: (index: number, item: TItem) => void;
  threshold?: number;
}

export interface UseReelSwiperReturn {
  activeIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
  itemRefs: React.MutableRefObject<Map<number, HTMLElement>>;
  registerItem: (index: number) => (node: HTMLElement | null) => void;
  scrollToIndex: (index: number, smooth?: boolean) => void;
  nextReel: () => void;
  prevReel: () => void;
}

export function useReelSwiper<TItem>({
  items,
  initialIndex = 0,
  onActiveIndexChange,
  threshold = 0.6,
}: UseReelSwiperOptions<TItem>): UseReelSwiperReturn {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToIndex = useCallback((index: number, smooth: boolean = true) => {
    const targetElement = itemRefs.current.get(index);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start',
      });
    }
  }, []);

  const nextReel = useCallback(() => {
    if (activeIndex < items.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  }, [activeIndex, items.length, scrollToIndex]);

  const prevReel = useCallback(() => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  }, [activeIndex, scrollToIndex]);

  // Set up intersection observer to detect which slide is currently in view (>60%)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-reel-index');
            if (indexStr !== null) {
              const newIndex = parseInt(indexStr, 10);
              setActiveIndex((curr) => {
                if (curr !== newIndex) {
                  if (onActiveIndexChange && items[newIndex]) {
                    onActiveIndexChange(newIndex, items[newIndex]);
                  }
                  return newIndex;
                }
                return curr;
              });
            }
          }
        }
      },
      {
        root: containerRef.current,
        threshold,
      }
    );

    // Observe all registered item nodes
    itemRefs.current.forEach((node) => {
      if (node && observerRef.current) {
        observerRef.current.observe(node);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items, onActiveIndexChange, threshold]);

  const registerItem = useCallback((index: number) => {
    return (node: HTMLElement | null) => {
      if (node) {
        itemRefs.current.set(index, node);
        if (observerRef.current) {
          observerRef.current.observe(node);
        }
      } else {
        const existingNode = itemRefs.current.get(index);
        if (existingNode && observerRef.current) {
          observerRef.current.unobserve(existingNode);
        }
        itemRefs.current.delete(index);
      }
    };
  }, []);

  // Keyboard navigation for reels (ArrowUp / ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        nextReel();
      } else if (e.key === 'ArrowUp') {
        prevReel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextReel, prevReel]);

  return {
    activeIndex,
    containerRef,
    itemRefs,
    registerItem,
    scrollToIndex,
    nextReel,
    prevReel,
  };
}
