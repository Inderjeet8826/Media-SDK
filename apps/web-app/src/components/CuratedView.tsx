import React, { useState } from 'react';
import { useCurated, useMediaEvents } from '@headless-media/react';
import { Grid, Lightbox } from '@headless-media/ui-react';
import { Photo } from '@headless-media/core';

export const CuratedView: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const { recordView, recordDownload } = useMediaEvents();

  const {
    items: photos,
    loading,
    hasNextPage,
    fetchNextPage,
    error,
  } = useCurated<Photo>({
    mediaType: 'photo',
    perPage: 16,
  });

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    const photo = photos[index];
    if (photo) {
      recordView(photo);
    }
  };

  const handleDownload = (photo: Photo) => {
    recordDownload(photo, 'original');
    const link = document.createElement('a');
    link.href = photo.src.original;
    link.target = '_blank';
    link.download = `curated-${photo.id}.jpg`;
    link.click();
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Curated Editorial Collection</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Hand-picked photography refreshed continuously via Pexels Curated API.
        </p>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '1.5rem' }}>
          <strong>Error fetching curated photos:</strong> {error.message}
        </div>
      )}

      <Grid<Photo>
        items={photos}
        loading={loading}
        hasMore={hasNextPage}
        onLoadMore={fetchNextPage}
        columns={4}
        gap={16}
        renderItem={(photo, index) => (
          <div
            key={photo.id}
            className="media-card"
            onClick={() => handleOpenPhoto(index)}
            tabIndex={0}
            role="button"
            aria-label={`View photo by ${photo.photographer}`}
          >
            <img
              src={photo.src.medium}
              alt={photo.alt || photo.photographer}
              className="media-card-img"
              loading="lazy"
            />
            <div className="media-card-overlay">
              <span className="media-card-title">{photo.alt || 'Curated Shot'}</span>
              <span className="media-card-author">Photo by {photo.photographer}</span>
            </div>
          </div>
        )}
        renderLoading={() => (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Loading curated feed...
          </div>
        )}
      />

      <Lightbox<Photo>
        items={photos}
        isOpen={selectedPhotoIndex !== null}
        activeIndex={selectedPhotoIndex ?? 0}
        onIndexChange={(newIndex) => {
          setSelectedPhotoIndex(newIndex);
          if (photos[newIndex]) {
            recordView(photos[newIndex]);
          }
        }}
        onClose={() => setSelectedPhotoIndex(null)}
        renderItem={(photo, _, helpers) => (
          <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={helpers.close} aria-label="Close Lightbox">
              ✕
            </button>

            <button
              className="lightbox-nav-btn lightbox-nav-prev"
              onClick={helpers.prev}
              disabled={!helpers.hasPrev}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              className="lightbox-nav-btn lightbox-nav-next"
              onClick={helpers.next}
              disabled={!helpers.hasNext}
              aria-label="Next photo"
            >
              ›
            </button>

            <div className="lightbox-img-wrapper">
              <img
                src={photo.src.large2x || photo.src.large}
                alt={photo.alt || photo.photographer}
                className="lightbox-img"
              />
            </div>

            <div className="lightbox-footer">
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                  {photo.alt || 'Curated Photo'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  By {photo.photographer}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {helpers.currentIndex + 1} / {helpers.totalCount}
                </span>
                <button
                  className="btn-primary"
                  onClick={() => handleDownload(photo)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
