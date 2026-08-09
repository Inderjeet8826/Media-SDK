import { useCallback, useEffect, useState } from 'react';
import { Photo, Video, MediaCoreError } from '@headless-media/core';
import { useMedia } from './useMedia';

export interface UseCuratedOptions {
  mediaType?: 'photo' | 'video';
  perPage?: number;
  enabled?: boolean;
}

export interface UseCuratedReturn<T extends Photo | Video = Photo> {
  items: T[];
  loading: boolean;
  isFetchingNextPage: boolean;
  error: MediaCoreError | Error | null;
  page: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCurated<T extends Photo | Video = Photo>({
  mediaType = 'photo',
  perPage = 15,
  enabled = true,
}: UseCuratedOptions = {}): UseCuratedReturn<T> {
  const { client } = useMedia();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<MediaCoreError | Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const fetchPage = useCallback(
    async (targetPage: number, isNext: boolean = false) => {
      if (!enabled) return;

      if (isNext) {
        setIsFetchingNextPage(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        if (mediaType === 'video') {
          const res = await client.getPopularVideos({ page: targetPage, per_page: perPage });
          setItems((prev) => (isNext ? [...prev, ...(res.items as T[])] : (res.items as T[])));
          setPage(res.page);
          setHasNextPage(!!res.next_page || res.items.length === perPage);
        } else {
          const res = await client.getCuratedPhotos({ page: targetPage, per_page: perPage });
          setItems((prev) => (isNext ? [...prev, ...(res.items as T[])] : (res.items as T[])));
          setPage(res.page);
          setHasNextPage(!!res.next_page || res.items.length === perPage);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [client, mediaType, perPage, enabled]
  );

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  const fetchNextPage = useCallback(async () => {
    if (loading || isFetchingNextPage || !hasNextPage) return;
    await fetchPage(page + 1, true);
  }, [loading, isFetchingNextPage, hasNextPage, page, fetchPage]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchPage(1, false);
  }, [fetchPage]);

  return {
    items,
    loading,
    isFetchingNextPage,
    error,
    page,
    hasNextPage,
    fetchNextPage,
    refresh,
  };
}
