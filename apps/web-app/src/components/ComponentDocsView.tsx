import React from 'react';

export const ComponentDocsView: React.FC = () => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', lineHeight: '1.7' }}>
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <span className="brand-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>UI Components</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          @headless-media/ui-react
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Headless, unstyled, accessible UI component primitives. Zero CSS framework dependencies, zero backend/SDK coupling.
        </p>
      </div>

      {/* Component 1: Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
          1. &lt;Grid /&gt; & useGrid
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Generic responsive media grid with built-in <code>IntersectionObserver</code> sentinel for seamless infinite scrolling.
        </p>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Props Table</h3>
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', background: 'var(--bg-surface)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Prop</th>
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Default</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 600 }}>items</td>
                <td style={{ padding: '0.75rem 1rem' }}>TItem[]</td>
                <td style={{ padding: '0.75rem 1rem' }}>required</td>
                <td style={{ padding: '0.75rem 1rem' }}>Array of media items to display</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 600 }}>renderItem</td>
                <td style={{ padding: '0.75rem 1rem' }}>(item, index) =&gt; ReactNode</td>
                <td style={{ padding: '0.75rem 1rem' }}>required</td>
                <td style={{ padding: '0.75rem 1rem' }}>Render function for each grid card</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 600 }}>onLoadMore</td>
                <td style={{ padding: '0.75rem 1rem' }}>() =&gt; void</td>
                <td style={{ padding: '0.75rem 1rem' }}>undefined</td>
                <td style={{ padding: '0.75rem 1rem' }}>Callback triggered when sentinel enters viewport</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#60a5fa', fontWeight: 600 }}>columns</td>
                <td style={{ padding: '0.75rem 1rem' }}>number</td>
                <td style={{ padding: '0.75rem 1rem' }}>undefined</td>
                <td style={{ padding: '0.75rem 1rem' }}>Optional grid column count shorthand</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Example</h3>
        <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', overflowX: 'auto' }}>
{`<Grid<Photo>
  items={photos}
  loading={loading}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  columns={4}
  gap={16}
  renderItem={(photo, index) => (
    <div className="card" onClick={() => openLightbox(index)}>
      <img src={photo.src.medium} alt={photo.alt} />
    </div>
  )}
/>`}
        </pre>
      </section>

      {/* Component 2: Lightbox */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>
          2. &lt;Lightbox /&gt; & useLightbox
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Accessible modal dialog with <code>role="dialog"</code>, <code>aria-modal="true"</code>, focus trapping, body scroll locking, and full keyboard navigation (<code>Escape</code>, <code>ArrowLeft</code>, <code>ArrowRight</code>).
        </p>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Render Helpers</h3>
        <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <li><code>helpers.close()</code>: Closes the lightbox and restores focus to triggering element</li>
          <li><code>helpers.next() / helpers.prev()</code>: Advances to next or previous media item</li>
          <li><code>helpers.hasNext / helpers.hasPrev</code>: Boolean navigation bounds</li>
          <li><code>helpers.currentIndex / helpers.totalCount</code>: Current index position and total count</li>
        </ul>
      </section>

      {/* Component 3: ReelSwiper */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
          3. &lt;ReelSwiper /&gt; & useReelSwiper
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Vertical snapping container for short-form reels and stories. Automatically tracks active item when &gt;60% visible in viewport.
        </p>
      </section>
    </div>
  );
};
