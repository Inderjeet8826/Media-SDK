import React, { useRef, useEffect, useState } from 'react';
import { useSearch, useMediaEvents } from '@headless-media/react';
import { ReelSwiper } from '@headless-media/ui-react';
import { Video } from '@headless-media/core';

interface VideoReelCardProps {
  video: Video;
  isActive: boolean;
  onDownload: (video: Video) => void;
}

const VideoReelCard: React.FC<VideoReelCardProps> = ({ video, isActive, onDownload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = isMuted;
    el.muted = isMuted;

    if (isActive) {
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            el.muted = true;
            setIsMuted(true);
            el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="reel-card" onClick={togglePlay} style={{ cursor: 'pointer' }}>
      <video
        ref={videoRef}
        poster={video.image}
        className="reel-video"
        loop
        playsInline
        muted={isMuted}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {video.video_files.map((file) => (
          <source key={file.id} src={file.link} type={file.file_type || 'video/mp4'} />
        ))}
      </video>

      {/* Floating Center Play Icon when paused */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            zIndex: 5,
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none',
          }}
        >
          ▶
        </div>
      )}

      {/* Top Controls: Sound Mute/Unmute */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button
          onClick={toggleMute}
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
          }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="reel-overlay" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>
              {video.alt || 'Pexels Reel Video'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Created by {video.user.name} • {video.duration}s
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => onDownload(video)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            ⬇ Save
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: isPlaying ? '#10b981' : '#f59e0b' }}>
            ● {isPlaying ? 'Playing HD Reel' : 'Paused (Click to play)'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Use ↑ / ↓ keys to snap reels)
          </span>
        </div>
      </div>
    </div>
  );
};

export const VideoReelsView: React.FC = () => {
  const [query, setQuery] = useState<string>('nature');
  const { recordView, recordDownload } = useMediaEvents();

  const {
    items: videos,
    loading,
    error,
  } = useSearch<Video>({
    query,
    mediaType: 'video',
    perPage: 12,
  });

  const handleActiveIndexChange = (index: number, activeVideo: Video) => {
    recordView(activeVideo);
  };

  const handleDownload = (video: Video) => {
    const bestFile = video.video_files.find((f) => f.quality === 'hd') || video.video_files[0];
    recordDownload(video, bestFile?.quality);
    if (bestFile?.link) {
      window.open(bestFile.link, '_blank');
    }
  };

  return (
    <div>
      <div style={{ maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
        <div className="search-container" style={{ padding: '0.6rem 1rem' }}>
          <div className="search-input-wrapper">
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>🎬</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search video reels (e.g., city, ocean, fire)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div style={{ maxWidth: '480px', margin: '0 auto 1rem auto', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: '0.85rem' }}>
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {loading && videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          Loading video reels...
        </div>
      ) : (
        <div className="reel-viewport">
          <ReelSwiper<Video>
            items={videos}
            height="100%"
            threshold={0.6}
            onActiveIndexChange={handleActiveIndexChange}
            renderItem={(video, _, isActive) => (
              <VideoReelCard
                video={video}
                isActive={isActive}
                onDownload={handleDownload}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
