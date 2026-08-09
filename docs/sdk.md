# SDK Developer Documentation

Detailed developer documentation for `@headless-media/core` and `@headless-media/react`.

---

## 1. `@headless-media/core`

### Installation
```bash
npm install @headless-media/core
```

### Initialization

```typescript
import { initialize, MediaClient } from '@headless-media/core';

// Functional Factory
const sdk = initialize({
  apiKey: 'YOUR_PEXELS_API_KEY', // Optional: mock mode activates if omitted
  cacheTtlMs: 5 * 60 * 1000,    // 5 minutes in-memory TTL
  enableLogging: true,           // Automatic console event logger
  timeoutMs: 10000,
});

// Or Class Instance
const client = new MediaClient({ apiKey: 'YOUR_KEY' });
```

### Methods

#### `searchPhotos(params: SearchPhotosParams)`
Searches photos on Pexels with caching and request deduplication.
```typescript
const result = await sdk.searchPhotos({
  query: 'mountains',
  page: 1,
  per_page: 15,
  orientation: 'landscape',
});
console.log(result.items, result.total_results);
```

#### `searchVideos(params: SearchVideosParams)`
```typescript
const result = await sdk.searchVideos({
  query: 'ocean sunset',
  page: 1,
  per_page: 10,
});
```

#### `getCurated(params: CuratedPhotosParams)` / `getCuratedPhotos(params)`
```typescript
const curated = await sdk.getCuratedPhotos({ page: 1, per_page: 20 });
```

#### `getPopularVideos(params: PopularVideosParams)`
```typescript
const popular = await sdk.getPopularVideos({ page: 1, per_page: 10 });
```

#### `getPhotoById(id: number | string)` / `getVideoById(id)`
```typescript
const photo = await sdk.getPhotoById(2014422);
```

### Event System
```typescript
// Subscribe to view events
const unsubscribe = sdk.on('view', (payload) => {
  console.log('Media viewed:', payload.item, payload.timestamp);
});

// Emit download event
sdk.emit('download', {
  item: photo,
  format: 'original',
  timestamp: Date.now(),
});

// Unsubscribe
unsubscribe();
```

### Cache & Deduplication
```typescript
// Inspect cache telemetry
const stats = sdk.getCacheStats();
console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}, Size: ${stats.size}`);

// Clear cache
sdk.clearCache();
```

---

## 2. `@headless-media/react`

### Installation
```bash
npm install @headless-media/core @headless-media/react
```

### `<MediaProvider>` Setup
```tsx
import React from 'react';
import { MediaProvider } from '@headless-media/react';

export function RootApp() {
  return (
    <MediaProvider apiKey="PEXELS_KEY" config={{ cacheTtlMs: 300000 }}>
      <App />
    </MediaProvider>
  );
}
```

### Custom Hooks

#### `useSearch({ query, mediaType, perPage, debounceMs })`
```tsx
import { useSearch } from '@headless-media/react';
import { Photo } from '@headless-media/core';

function PhotoSearch() {
  const { items, loading, hasNextPage, fetchNextPage, totalResults, error } = useSearch<Photo>({
    query: 'space',
    mediaType: 'photo',
    debounceMs: 300,
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {items.map((photo) => (
        <img key={photo.id} src={photo.src.medium} alt={photo.alt} />
      ))}
      {hasNextPage && <button onClick={fetchNextPage}>Load More</button>}
    </div>
  );
}
```

#### `useCurated({ mediaType, perPage })`
```tsx
const { items, loading, hasNextPage, fetchNextPage } = useCurated({
  mediaType: 'photo',
  perPage: 15,
});
```

#### `useMediaEvents({ onView, onDownload })`
```tsx
const { recordView, recordDownload } = useMediaEvents({
  onView: ({ item }) => console.log('Item viewed in UI:', item.id),
  onDownload: ({ item }) => console.log('Item downloaded:', item.id),
});
```
