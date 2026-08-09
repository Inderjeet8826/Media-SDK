import React from 'react';
import { useMedia } from '@headless-media/react';

export const ArchitectureView: React.FC = () => {
  const { client, getCacheStats, clearCache } = useMedia();
  const stats = getCacheStats();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Headless Media SDK Ecosystem Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          A modular, framework-agnostic media SDK built with strict dependency inversion, typed events, in-memory TTL caching, request deduplication, and completely unstyled headless UI primitives.
        </p>
      </div>

      {/* Live Cache Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cached Queries</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>{stats.size}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cache Hits</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{stats.hits}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cache Misses</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{stats.misses}</div>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>In-Flight Coalesced</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6' }}>{stats.inflightRequests}</div>
            <button className="btn-secondary" onClick={() => { clearCache(); }} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
              Purge Cache
            </button>
          </div>
        </div>
      </div>

      {/* Monorepo Dependency Flow Card */}
      <div style={{ background: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
          Strict Dependency Flow Rules
        </h3>
        <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.8', border: '1px solid var(--border-subtle)', color: '#93c5fd' }}>
          <div style={{ color: '#6ee7b7' }}>App (apps/web-app)</div>
          <div>&nbsp;├── media-react (@headless-media/react)</div>
          <div>&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── media-core (@headless-media/core)</div>
          <div>&nbsp;└── media-ui-react (@headless-media/ui-react) [Pure Headless, Zero SDK knowledge]</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
              📦 @headless-media/core
            </div>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>Framework agnostic (TypeScript + standard fetch)</li>
              <li>Zero React, React Native, or DOM API dependencies</li>
              <li>In-memory Map cache with TTL eviction</li>
              <li>Request deduplication for concurrent identical queries</li>
              <li>Typed EventEmitter (view, download, search) with logger</li>
              <li>Offline Mock Engine + Real Pexels Client</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>
              🎨 @headless-media/ui-react
            </div>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>Truly Headless UI Component Primitives</li>
              <li>Never imports media-core or media-react</li>
              <li>Zero Tailwind or CSS framework coupling</li>
              <li><strong>Grid:</strong> infinite scroll observer sentinel</li>
              <li><strong>Lightbox:</strong> keyboard nav, a11y focus trap</li>
              <li><strong>ReelSwiper:</strong> vertical snap & active intersection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
