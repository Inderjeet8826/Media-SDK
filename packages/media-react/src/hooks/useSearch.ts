import { useCallback, useEffect, useRef, useState } from 'react';
import { Photo, Video, MediaCoreError } from '@headless-media/core';
import { useMedia } from './useMedia';

export interface UseSearchOptions {
  query: string;
  mediaType?: 'photo' | 'video';
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseSearchReturn<T extends Photo | Video = Photo> {
  items: T[];
  loading: boolean;
  isFetchingNextPage: boolean;
  error: MediaCoreError | Error | null;
  page: number;
  totalResults: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSearch<T extends Photo | Video = Photo>({
  query,
  mediaType = 'photo',
  perPage = 15,
  orientation,
  size,
  color,
  debounceMs = 300,
  enabled = true,
}: UseSearchOptions): UseSearchReturn<T> {
  const { client } = useMedia();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<MediaCoreError | Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const debounceTimerRef = useRef<any>(null);
  const latestQueryRef = useRef<string>(query);
  latestQueryRef.current = query;

  const performFetch = useCallback(
    async (targetPage: number, isNextPage: boolean = false) => {
      const trimmed = latestQueryRef.current.trim();
      if (!trimmed || !enabled) {
        setItems([]);
        setTotalResults(0);
        setHasNextPage(false);
        setLoading(false);
        setIsFetchingNextPage(false);
        return;
      }

      if (isNextPage) {
        setIsFetchingNextPage(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        if (mediaType === 'video') {
          const res = await client.searchVideos({
            query: trimmed,
            page: targetPage,
            per_page: perPage,
            orientation,
            size,
          });

          if (latestQueryRef.current.trim() === trimmed) {
            setItems((prev) => (isNextPage ? [...prev, ...(res.items as T[])] : (res.items as T[])));
            setPage(res.page);
            setTotalResults(res.total_results);
            setHasNextPage(res.page * res.per_page < res.total_results || !!res.next_page);
          }
        } else {
          const res = await client.searchPhotos({
            query: trimmed,
            page: targetPage,
            per_page: perPage,
            orientation,
            size,
            color,
          });

          if (latestQueryRef.current.trim() === trimmed) {
            setItems((prev) => (isNextPage ? [...prev, ...(res.items as T[])] : (res.items as T[])));
            setPage(res.page);
            setTotalResults(res.total_results);
            setHasNextPage(res.page * res.per_page < res.total_results || !!res.next_page);
          }
        }
      } catch (err: any) {
        if (latestQueryRef.current.trim() === trimmed) {
          setError(err);
        }
      } finally {
        setLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [client, mediaType, perPage, orientation, size, color, enabled]
  );

  // Trigger search on query / filter change with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim() || !enabled) {
      setItems([]);
      setTotalResults(0);
      setHasNextPage(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      setPage(1);
      performFetch(1, false);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, mediaType, orientation, size, color, debounceMs, enabled, performFetch]);

  const fetchNextPage = useCallback(async () => {
    if (loading || isFetchingNextPage || !hasNextPage) return;
    await performFetch(page + 1, true);
  }, [loading, isFetchingNextPage, hasNextPage, page, performFetch]);

  const refresh = useCallback(async () => {
    setPage(1);
    await performFetch(1, false);
  }, [performFetch]);

  return {
    items,
    loading,
    isFetchingNextPage,
    error,
    page,
    totalResults,
    hasNextPage,
    fetchNextPage,
    refresh,
  };
}
