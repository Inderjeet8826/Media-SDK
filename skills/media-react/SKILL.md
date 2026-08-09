---
name: integrate-media-react
description: Expert instructions for AI coding assistants on how to correctly integrate @headless-media/react, manage MediaProvider, use custom hooks, subscribe to SDK events, and enforce architectural boundaries.
---

# Integrating `@headless-media/react`

This document instructs AI coding assistants on how to properly integrate `@headless-media/react` into React applications without violating architectural boundaries or creating performance regressions.

---

## 1. Core Principles

1. **Strict Dependency Flow**:
   - `media-react` communicates **only** with `@headless-media/core`.
   - Never write raw `fetch` calls or Pexels URL construction inside React components. Always use hooks provided by `@headless-media/react`.
2. **Context Provider**:
   - Every consumer of `useMedia`, `useSearch`, `useCurated`, or `useMediaEvents` **must** be wrapped in `<MediaProvider>`.
3. **Event Cleanup**:
   - Event listeners must always unsubscribe on unmount (handled automatically when using `useMediaEvents`).

---

## 2. Setting Up `<MediaProvider>`

Wrap your root application tree with `<MediaProvider>`:

```tsx
import React from 'react';
import { MediaProvider } from '@headless-media/react';
import { AppContent } from './AppContent';

export function Root() {
  return (
    <MediaProvider
      apiKey={process.env.REACT_APP_PEXELS_API_KEY}
      config={{
        cacheTtlMs: 5 * 60 * 1000, // 5 minute in-memory cache
        enableLogging: true,        // Console telemetry logger
      }}
    >
      <AppContent />
    </MediaProvider>
  );
}
```

---

## 3. Implementing Search with `useSearch`

Use `useSearch` for reactive, debounced photo and video queries with infinite pagination:

```tsx
import React, { useState } from 'react';
import { useSearch } from '@headless-media/react';
import { Photo } from '@headless-media/core';

export function PhotoSearchComponent() {
  const [query, setQuery] = useState('architecture');

  const {
    items,
    loading,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSearch<Photo>({
    query,
    mediaType: 'photo',
    perPage: 15,
    debounceMs: 300,
  });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {error && <p>Error: {error.message}</p>}
      <div className="grid">
        {items.map((photo) => (
          <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
        ))}
      </div>
      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## 4. Emitting and Listening to Events with `useMediaEvents`

```tsx
import React from 'react';
import { useMediaEvents } from '@headless-media/react';
import { Photo } from '@headless-media/core';

export function MediaCard({ photo }: { photo: Photo }) {
  const { recordView, recordDownload } = useMediaEvents({
    onView: ({ item }) => console.log('Global view event caught:', item.id),
    onDownload: ({ item }) => console.log('Global download event caught:', item.id),
  });

  return (
    <div onClick={() => recordView(photo)}>
      <img src={photo.src.medium} alt={photo.alt} />
      <button onClick={() => recordDownload(photo, 'original')}>Download</button>
    </div>
  );
}
```

---

## 5. Anti-Patterns to Avoid

- ❌ **DO NOT** make raw HTTP calls or construct Pexels URLs manually inside React components.
- ❌ **DO NOT** import React in `media-core` or try to render JSX from `media-core`.
- ❌ **DO NOT** import `@headless-media/core` inside `@headless-media/ui-react`.
- ❌ **DO NOT** instantiate multiple `new MediaClient()` inside component render loops; let `MediaProvider` manage client lifecycle.
