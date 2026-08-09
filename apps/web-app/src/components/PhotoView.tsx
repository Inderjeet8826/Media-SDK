import React, { useState } from 'react';
import { useSearch, useMediaEvents } from '@headless-media/react';
import { Grid, Lightbox } from '@headless-media/ui-react';
import { Photo } from '@headless-media/core';

export const PhotoView: React.FC = () => {
  const [query, setQuery] = useState<string>('nature');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square' | undefined>(undefined);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const { recordView, recordDownload } = useMediaEvents();

  const {
    items: photos,
    loading,
    hasNextPage,
    fetchNextPage,
    totalResults,
    error,
  } = useSearch<Photo>({
    query,
    mediaType: 'photo',
    orientation,
    perPage: 16,
    debounceMs: 300,
  });

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    const photo = photos[index];
    if (photo) {
      recordView(photo);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleDownload = (photo: Photo) => {
    recordDownload(photo, 'original');
    // Simulate real browser download
    const link = document.createElement('a');
    link.href = photo.src.original;
    link.target = '_blank';
    link.download = `photo-${photo.id}.jpg`;
    link.click();
  };

  return (
    <div>
      {/* Search Bar and Filters */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search high-resolution photos (e.g., mountains, architecture, cyberpunk, ocean)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={orientation || ''}
          onChange={(e) => setOrientation((e.target.value as any) || undefined)}
        >
          <option value="">All Orientations</option>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="square">Square</option>
        </select>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          {query ? `Results for "${query}"` : 'Recent Photos'}
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {totalResults > 0 ? `${totalResults.toLocaleString()} photos available` : ''}
        </span>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '1.5rem' }}>
          <strong>Error fetching media:</strong> {error.message}
        </div>
      )}

      {/* Headless Grid Component */}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOpenPhoto(index);
              }
            }}
          >
            <img
              src={photo.src.medium}
              alt={photo.alt || photo.photographer}
              className="media-card-img"
              loading="lazy"
            />
            <div className="media-card-overlay">
              <span className="media-card-title">{photo.alt || 'Untitled Photo'}</span>
              <span className="media-card-author">Photo by {photo.photographer}</span>
            </div>
          </div>
        )}
        renderEmpty={() => (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            No photos found for "{query}". Try a different keyword.
          </div>
        )}
        renderLoading={() => (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Loading more photos...
          </div>
        )}
      />

      {/* Headless Lightbox Component */}
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
        onClose={handleCloseLightbox}
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
                  {photo.alt || 'Untitled Photo'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  By {photo.photographer} • {photo.width} × {photo.height}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {helpers.currentIndex + 1} / {helpers.totalCount}
                </span>
                <button
                  className="btn-primary"
                  onClick={() => handleDownload(photo)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>⬇</span> Download
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
