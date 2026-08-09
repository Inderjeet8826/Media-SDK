import { useCallback, useEffect } from 'react';
import { MediaItem, EventCallback } from '@headless-media/core';
import { useMedia } from './useMedia';

export interface UseMediaEventsListeners {
  onView?: (payload: { item: MediaItem; timestamp: number }) => void;
  onDownload?: (payload: { item: MediaItem; format?: string; timestamp: number }) => void;
  onSearch?: (payload: { query: string; mediaType: 'photo' | 'video'; timestamp: number }) => void;
}

export interface UseMediaEventsReturn {
  recordView: (item: MediaItem) => void;
  recordDownload: (item: MediaItem, format?: string) => void;
  on: (event: string, callback: EventCallback<any>) => () => void;
  emit: (event: string, payload: any) => void;
}

export function useMediaEvents(listeners?: UseMediaEventsListeners): UseMediaEventsReturn {
  const { client } = useMedia();

  useEffect(() => {
    if (!listeners) return;

    const unsubs: Array<() => void> = [];

    if (listeners.onView) {
      unsubs.push(client.on('view', listeners.onView));
    }
    if (listeners.onDownload) {
      unsubs.push(client.on('download', listeners.onDownload));
    }
    if (listeners.onSearch) {
      unsubs.push(client.on('search', listeners.onSearch));
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [client, listeners?.onView, listeners?.onDownload, listeners?.onSearch]);

  const recordView = useCallback(
    (item: MediaItem) => {
      client.recordView(item);
    },
    [client]
  );

  const recordDownload = useCallback(
    (item: MediaItem, format?: string) => {
      client.recordDownload(item, format);
    },
    [client]
  );

  const on = useCallback(
    (event: string, callback: EventCallback<any>) => {
      return client.on(event, callback);
    },
    [client]
  );

  const emit = useCallback(
    (event: string, payload: any) => {
      client.emit(event, payload);
    },
    [client]
  );

  return {
    recordView,
    recordDownload,
    on,
    emit,
  };
}
