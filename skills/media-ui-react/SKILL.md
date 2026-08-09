---
name: consume-media-ui-react
description: Expert instructions for AI coding assistants on how to consume @headless-media/ui-react headless UI components (Grid, Lightbox, ReelSwiper), apply custom styling, ensure accessibility (a11y), and maintain headless separation.
---

# Consuming `@headless-media/ui-react`

This document instructs AI coding assistants on how to correctly consume `@headless-media/ui-react` without breaking headless boundaries or introducing styling coupling.

---

## 1. Headless Philosophy

`@headless-media/ui-react` provides zero CSS, zero pre-baked styling classes, and zero knowledge of backend APIs or Pexels data structures.
- All state, keyboard interactions, intersection observation, and accessibility attributes are managed internally.
- All visual rendering and markup are controlled by the consumer via render props (`renderItem`, `renderEmpty`, `renderLoading`) and prop getters.

---

## 2. Headless Infinite Grid (`Grid`)

Use `Grid` for displaying responsive lists with infinite scrolling:

```tsx
import React from 'react';
import { Grid } from '@headless-media/ui-react';

interface CustomItem {
  id: string | number;
  imageUrl: string;
  title: string;
}

export function CustomFeed({
  items,
  loading,
  hasMore,
  onLoadMore,
}: {
  items: CustomItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <Grid<CustomItem>
      items={items}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      columns={3}
      gap="1.5rem"
      renderItem={(item, index) => (
        <div className="custom-card">
          <img src={item.imageUrl} alt={item.title} />
          <h3>{item.title}</h3>
        </div>
      )}
      renderLoading={() => <div className="spinner">Loading more items...</div>}
      renderEmpty={() => <div className="empty">No items available.</div>}
    />
  );
}
```

---

## 3. Accessible Headless Lightbox (`Lightbox`)

`Lightbox` handles dialog accessibility (`role="dialog"`, `aria-modal="true"`), focus trapping, scroll locking, and keyboard shortcuts (`Escape`, `ArrowLeft`, `ArrowRight`):

```tsx
import React from 'react';
import { Lightbox } from '@headless-media/ui-react';

export function CustomGalleryLightbox({
  items,
  isOpen,
  activeIndex,
  onIndexChange,
  onClose,
}: {
  items: { id: number; url: string; caption: string }[];
  isOpen: boolean;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  return (
    <Lightbox
      items={items}
      isOpen={isOpen}
      activeIndex={activeIndex}
      onIndexChange={onIndexChange}
      onClose={onClose}
      renderItem={(item, _, helpers) => (
        <div className="custom-lightbox-modal">
          <button onClick={helpers.close}>Close (Esc)</button>
          <button onClick={helpers.prev} disabled={!helpers.hasPrev}>Prev (‹)</button>
          <img src={item.url} alt={item.caption} />
          <button onClick={helpers.next} disabled={!helpers.hasNext}>Next (›)</button>
          <p>{item.caption} ({helpers.currentIndex + 1} of {helpers.totalCount})</p>
        </div>
      )}
    />
  );
}
```

---

## 4. Headless Vertical Reel Swiper (`ReelSwiper`)

`ReelSwiper` manages vertical scroll snapping and fires `onActiveIndexChange` when a slide crosses the intersection threshold (>60% visibility):

```tsx
import React from 'react';
import { ReelSwiper } from '@headless-media/ui-react';

export function CustomVideoFeed({ videos }: { videos: { id: number; videoUrl: string; title: string }[] }) {
  return (
    <div style={{ height: '100vh', maxWidth: '480px', margin: '0 auto' }}>
      <ReelSwiper
        items={videos}
        threshold={0.6}
        onActiveIndexChange={(index, activeVideo) => {
          console.log(`Now viewing reel ${index}:`, activeVideo.title);
        }}
        renderItem={(video, index, isActive) => (
          <div className="reel-slide">
            <video
              src={video.videoUrl}
              autoPlay={isActive}
              loop
              muted
            />
            <div className="reel-caption">{video.title}</div>
          </div>
        )}
      />
    </div>
  );
}
```

---

## 5. Composition Checklist for AI Assistants
1. ✅ **Never import `@headless-media/core` inside `@headless-media/ui-react`**.
2. ✅ **Always provide accessible labels and alt text inside `renderItem`**.
3. ✅ **Ensure `Lightbox` is given a meaningful `activeIndex` and `onClose` handler**.
4. ✅ **Ensure `ReelSwiper` container has an explicit height (e.g. `100vh` or fixed pixels)**.
