import React from 'react';

export const SdkDocsView: React.FC = () => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', lineHeight: '1.7' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>SDK Reference</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          @headless-media/core & @headless-media/react
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Framework-agnostic media client architecture with in-memory TTL caching, request deduplication, typed events, and React custom hooks.
        </p>
      </div>

      {/* Package 1: Media Core */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1rem' }}>
          1. @headless-media/core (Framework-Agnostic Engine)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Pure TypeScript library with zero React or DOM dependencies. Handles networking, Pexels API communication, Map-based TTL caching, in-flight promise coalescing, and typed event dispatching.
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '1.5rem 0 0.5rem' }}>Installation</h3>
        <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#93c5fd' }}>
npm install @headless-media/core
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '1.5rem 0 0.5rem' }}>Client Initialization</h3>
        <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', overflowX: 'auto' }}>
{`import { initialize, MediaClient } from '@headless-media/core';

// Functional Factory Initialization
const sdk = initialize({
  apiKey: 'YOUR_PEXELS_API_KEY', // Optional: mock mode activates if omitted
  cacheTtlMs: 5 * 60 * 1000,    // 5 minutes in-memory TTL
  enableLogging: true,           // Automatic console event logger
  timeoutMs: 10000,
});`}
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '1.5rem 0 0.5rem' }}>Core API Methods</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <code style={{ color: '#60a5fa', fontWeight: 700 }}>sdk.searchPhotos(params: SearchPhotosParams): Promise&lt;PaginatedResponse&lt;Photo&gt;&gt;</code>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Searches photos with query debouncing, pagination, orientation, size, and color filtering. Results are cached and deduplicated.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <code style={{ color: '#60a5fa', fontWeight: 700 }}>sdk.searchVideos(params: SearchVideosParams): Promise&lt;PaginatedResponse&lt;Video&gt;&gt;</code>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Searches HD/SD videos with duration, orientation, and pagination options.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <code style={{ color: '#60a5fa', fontWeight: 700 }}>sdk.getCuratedPhotos(params?: PaginationParams): Promise&lt;PaginatedResponse&lt;Photo&gt;&gt;</code>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Fetches curated editorial feed refreshed continuously.
            </p>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <code style={{ color: '#60a5fa', fontWeight: 700 }}>sdk.on(event, callback) / sdk.emit(event, payload)</code>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Typed event emitter supporting <code>view</code>, <code>download</code>, <code>search</code>, and custom events with automatic unsubscription function.
            </p>
          </div>
        </div>
      </section>

      {/* Package 2: Media React */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a78bfa', marginBottom: '1rem' }}>
          2. @headless-media/react (React Adapter & Hooks)
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Zero fetch logic. Connects React components to the core SDK using React Context and memory-safe custom hooks.
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '1.5rem 0 0.5rem' }}>&lt;MediaProvider&gt; Setup</h3>
        <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', overflowX: 'auto' }}>
{`import React from 'react';
import { MediaProvider } from '@headless-media/react';

export function RootApp() {
  return (
    <MediaProvider apiKey="PEXELS_KEY" config={{ cacheTtlMs: 300000 }}>
      <App />
    </MediaProvider>
  );
}`}
        </pre>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '1.5rem 0 0.5rem' }}>Custom Hooks</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>useSearch&lt;T&gt;({`{ query, mediaType, perPage, debounceMs }`})</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Reactive search hook with automatic debouncing, infinite scroll page cursor, and error state.
            </p>
            <pre style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#93c5fd' }}>
{`const { items, loading, hasNextPage, fetchNextPage, totalResults, error } = useSearch({
  query: 'nature',
  mediaType: 'photo',
  perPage: 15,
});`}
            </pre>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>useMediaEvents({`{ onView, onDownload, onSearch }`})</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Subscribes to global SDK events with automatic unmount cleanup to guarantee zero memory leaks. Also provides <code>recordView</code> and <code>recordDownload</code> helpers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
