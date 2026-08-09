# Headless UI Component Documentation

Comprehensive guide for `@headless-media/ui-react`.

`@headless-media/ui-react` is completely headless, framework-agnostic in style, and contains zero dependencies on `media-core` or `media-react`.

---

## 1. `Grid`

A flexible, accessible grid supporting infinite scroll out of the box via `IntersectionObserver`.

### Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `TItem[]` | `required` | Array of generic items to display. |
| `renderItem` | `(item: TItem, index: number) => ReactNode` | `required` | Render function for each item. |
| `loading` | `boolean` | `false` | Loading state for initial fetch or pagination. |
| `hasMore` | `boolean` | `true` | Whether more pages can be loaded. |
| `onLoadMore` | `() => void` | `undefined` | Callback fired when the sentinel scrolls into view. |
| `columns` | `number` | `undefined` | Optional CSS grid column count shortcut. |
| `gap` | `number \| string` | `'1rem'` | Gap between grid cells. |
| `renderEmpty` | `() => ReactNode` | `undefined` | Content rendered when items is empty. |
| `renderLoading` | `() => ReactNode` | `undefined` | Content rendered during loading. |

### Example
```tsx
import { Grid } from '@headless-media/ui-react';

<Grid
  items={photos}
  loading={loading}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  columns={3}
  gap={16}
  renderItem={(photo, index) => (
    <div key={photo.id} onClick={() => openLightbox(index)}>
      <img src={photo.src.medium} alt={photo.alt} />
    </div>
  )}
/>
```

---

## 2. `Lightbox`

A headless modal lightbox with full keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`), focus trapping, body scroll locking, and ARIA dialog semantics.

### Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `TItem[]` | `required` | Array of items. |
| `isOpen` | `boolean` | `required` | Whether the lightbox is open. |
| `activeIndex` | `number` | `required` | Index of the currently focused item. |
| `onIndexChange` | `(index: number) => void` | `undefined` | Callback when active index changes. |
| `onClose` | `() => void` | `undefined` | Callback fired to request close. |
| `loop` | `boolean` | `false` | Loop navigation when reaching edges. |
| `renderItem` | `(item: TItem, index: number, helpers: LightboxRenderHelpers) => ReactNode` | `required` | Render function for the modal. |

### Helpers in `renderItem`
- `helpers.close()`: Closes modal
- `helpers.next()`: Advances to next item
- `helpers.prev()`: Moves to previous item
- `helpers.hasNext`: Boolean indicating if next is available
- `helpers.hasPrev`: Boolean indicating if previous is available
- `helpers.currentIndex`: Current zero-indexed number
- `helpers.totalCount`: Total items in list

---

## 3. `ReelSwiper`

A vertical scroll-snapping feed for short-form video and story feeds with active intersection detection.

### Props
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `TItem[]` | `required` | Array of reel items. |
| `renderItem` | `(item: TItem, index: number, isActive: boolean) => ReactNode` | `required` | Render function with active visibility flag. |
| `onActiveIndexChange` | `(index: number, item: TItem) => void` | `undefined` | Fired when a new item occupies >60% of viewport. |
| `threshold` | `number` | `0.6` | IntersectionObserver threshold. |
| `height` | `string \| number` | `'100%'` | Container height. |

### Keyboard Shortcuts
- `ArrowDown`: Snap to next reel
- `ArrowUp`: Snap to previous reel
