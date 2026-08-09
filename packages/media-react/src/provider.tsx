import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { MediaClient, SdkConfig } from '@headless-media/core';
import { MediaContext, MediaContextValue } from './context';

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
