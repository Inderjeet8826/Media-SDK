import { useContext } from 'react';
import { MediaContext, MediaContextValue } from '../context';
import { CacheStats, MediaClient } from '@headless-media/core';

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
    throw new Error('useMedia must be used within a <MediaProvider>. Please wrap your component tree with <MediaProvider>.');
  }

  return {
    client: context.client,
    apiKey: context.apiKey,
    isReady: context.isReady,
    clearCache: () => context.client.clearCache(),
    getCacheStats: () => context.client.getCacheStats(),
  };
}
