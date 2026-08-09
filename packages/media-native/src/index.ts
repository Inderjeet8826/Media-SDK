import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react';
import {
  MediaClient,
  SdkConfig,
  Photo,
  Video,
  MediaItem,
  MediaCoreError,
  EventCallback,
  CacheStats,
} from '@headless-media/core';

export interface MediaContextValue {
  client: MediaClient;
  apiKey?: string;
  isReady: boolean;
}

export const MediaContext = createContext<MediaContextValue | null>(null);

export interface MediaProviderProps {
  apiKey?: string;
  config?: SdkConfig;
  client?: MediaClient;
  children: ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({
  apiKey,
  config,
  client: externalClient,
  children,
}) => {
  const internalClientRef = useRef<MediaClient | null>(null);

  const client = useMemo(() => {
    if (externalClient) {
      return externalClient;
    }
    if (!internalClientRef.current) {
      internalClientRef.current = new MediaClient({
        apiKey,
        ...config,
      });
    }
    return internalClientRef.current;
  }, [externalClient, apiKey, config]);

  useEffect(() => {
    if (apiKey !== undefined && client) {
      client.setApiKey(apiKey);
    }
  }, [apiKey, client]);

  useEffect(() => {
    return () => {
      if (internalClientRef.current) {
        internalClientRef.current.destroy();
        internalClientRef.current = null;
      }
    };
  }, []);

  const value = useMemo<MediaContextValue>(() => {
    return {
      client,
      apiKey,
      isReady: !!client,
    };
  }, [client, apiKey]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export interface UseMediaReturn {
  client: MediaClient;
  apiKey?: string;
  isReady: boolean;
  clearCache: () => void;
  getCacheStats: () => CacheStats;
}

export function useMedia(): UseMediaReturn {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a <MediaProvider>');
  }
  return {
    client: context.client,
    apiKey: context.apiKey,
    isReady: context.isReady,
    clearCache: () => context.client.clearCache(),
    getCacheStats: () => context.client.getCacheStats(),
  };
}

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

export function useMediaEvents(listeners?: {
  onView?: (payload: { item: MediaItem; timestamp: number }) => void;
  onDownload?: (payload: { item: MediaItem; format?: string; timestamp: number }) => void;
  onSearch?: (payload: { query: string; mediaType: 'photo' | 'video'; timestamp: number }) => void;
}) {
  const { client } = useMedia();

  useEffect(() => {
    if (!listeners) return;
    const unsubs: Array<() => void> = [];
    if (listeners.onView) unsubs.push(client.on('view', listeners.onView));
    if (listeners.onDownload) unsubs.push(client.on('download', listeners.onDownload));
    if (listeners.onSearch) unsubs.push(client.on('search', listeners.onSearch));
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [client, listeners?.onView, listeners?.onDownload, listeners?.onSearch]);

  const recordView = useCallback((item: MediaItem) => client.recordView(item), [client]);
  const recordDownload = useCallback((item: MediaItem, format?: string) => client.recordDownload(item, format), [client]);
  const on = useCallback((event: string, callback: EventCallback<any>) => client.on(event, callback), [client]);
  const emit = useCallback((event: string, payload: any) => client.emit(event, payload), [client]);

  return { recordView, recordDownload, on, emit };
}
