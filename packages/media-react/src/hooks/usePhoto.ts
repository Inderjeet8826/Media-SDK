import { useEffect, useState } from 'react';
import { Photo, MediaCoreError } from '@headless-media/core';
import { useMedia } from './useMedia';

export interface UsePhotoReturn {
  photo: Photo | null;
  loading: boolean;
  error: MediaCoreError | Error | null;
  refetch: () => Promise<void>;
}

export function usePhoto(id: number | string | null | undefined): UsePhotoReturn {
  const { client } = useMedia();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MediaCoreError | Error | null>(null);

  const fetchPhoto = async () => {
    if (!id) {
      setPhoto(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await client.getPhotoById(id);
      setPhoto(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, [id, client]);

  return { photo, loading, error, refetch: fetchPhoto };
}
