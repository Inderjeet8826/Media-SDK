import { createContext } from 'react';
import { MediaClient } from '@headless-media/core';

export interface MediaContextValue {
  client: MediaClient;
  apiKey?: string;
  isReady: boolean;
}

export const MediaContext = createContext<MediaContextValue | null>(null);
