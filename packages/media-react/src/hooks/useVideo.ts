import { useEffect, useState } from 'react';
import { Video, MediaCoreError } from '@headless-media/core';
import { useMedia } from './useMedia';

export interface UseVideoReturn {
  video: Video | null;
  loading: boolean;
  error: MediaCoreError | Error | null;
  refetch: () => Promise<void>;
}

export function useVideo(id: number | string | null | undefined): UseVideoReturn {
  const { client } = useMedia();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaCoreError | Error | null>(null);

  const fetchVideo = async () => {
    if (!id) {
      setVideo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await client.getVideoById(id);
      setVideo(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id, client]);

  return { video, loading, error, refetch: fetchVideo };
}
