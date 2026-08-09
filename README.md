# Headless Media SDK Ecosystem

> A production-quality, framework-agnostic Headless Media SDK and headless UI component ecosystem architected for senior-level modularity, strict architectural boundaries, high performance in-memory caching, request deduplication, and composable UI primitives.

---

## 🏛️ Architecture & Dependency Inversion Flow

The ecosystem strictly enforces unidirectional dependency flow:

```
                      ┌────────────────────────┐
                      │     apps/web-app       │
                      └────┬──────────────┬────┘
                           │              │
                           ▼              ▼
                ┌────────────────┐  ┌───────────────────┐
                │  media-react   │  │  media-ui-react   │
                └────────┬───────┘  └───────────────────┘
                         │           (Pure Headless UI,
                         ▼            Zero SDK/Core imports)
                ┌────────────────┐
                │   media-core   │
                └────────────────┘
             (Agnostic TS, Fetch,
              Cache, Deduplication,
              Events, Pexels Client)
```

### Strict Package Boundary Rules

1. **`media-core`**:
   - MUST NEVER import React or React Native.
   - MUST NEVER import UI components or DOM manipulation libraries.
   - Completely framework-agnostic (TypeScript + standard `fetch`).
   - Implements in-memory `Map` caching with configurable TTL, in-flight request deduplication, typed Event Emitter (`view`, `download`, `search`), and error hierarchy.

2. **`media-react`**:
   - The **ONLY** package allowed to import `media-core`.
   - Zero fetch logic, zero raw HTTP calls, zero UI rendering.
   - Exposes `<MediaProvider>`, `useMedia()`, `useSearch()`, `useCurated()`, `usePhoto()`, `useVideo()`, `useMediaEvents()`.

3. **`media-native`**:
   - React Native adapter adhering to the identical API contract as `media-react`.

4. **`media-ui-react`**:
   - Completely independent headless component library.
   - MUST NEVER import `media-core`, `media-react`, or Pexels types.
   - Zero styling or CSS framework dependencies (no Tailwind requirement).
   - Primitives: `Grid` (infinite scroll observer), `Lightbox` (keyboard nav & a11y focus trap), `ReelSwiper` (vertical scroll-snap & active index observation).

5. **`media-ui-native`**:
   - Pure React Native headless UI contracts and hooks (`createGridContract`, `useNativeLightboxNavigation`).

6. **`apps/web-app`**:
   - The single place where `media-react` and `media-ui-react` meet and assemble into an interactive showcase application.

---

## 📁 Monorepo Folder Structure

```
headless-media-sdk/
├── apps/
│   └── web-app/               # Vite + React 18 demo application
│       ├── src/
│       │   ├── components/    # PhotoView, CuratedView, VideoReelsView, ArchitectureView, EventDrawer
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── styles.css
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   ├── media-core/            # Framework-agnostic TypeScript SDK
│   │   ├── src/
│   │   │   ├── api.ts         # HttpTransport with status mapping & timeout handling
│   │   │   ├── cache.ts       # MemoryCache (TTL) & RequestDeduplicator
│   │   │   ├── client.ts      # MediaClient & initialize() factory
│   │   │   ├── errors.ts      # MediaCoreError, AuthenticationError, RateLimitError
│   │   │   ├── events.ts      # Strongly typed EventEmitter with wildcard logger
│   │   │   ├── mock.ts        # Deterministic offline mock engine
│   │   │   ├── types.ts       # Photo, Video, MediaItem, SdkConfig, MediaEventMap
│   │   │   └── index.ts
│   │   └── tests/             # Vitest unit tests for cache, events, client
│   ├── media-react/           # React adapter and custom hooks
│   │   ├── src/
│   │   │   ├── context.ts     # MediaContext
│   │   │   ├── provider.tsx   # <MediaProvider>
│   │   │   ├── hooks/         # useMedia, useSearch, useCurated, usePhoto, useVideo, useMediaEvents
│   │   │   └── index.ts
│   │   └── tests/             # React Testing Library unit tests
│   ├── media-native/          # React Native adapter
│   ├── media-ui-react/        # Pure headless React UI primitives
│   │   ├── src/
│   │   │   ├── grid/          # Grid & useGrid (infinite scroll observer)
│   │   │   ├── lightbox/      # Lightbox & useLightbox (keyboard nav, a11y, focus trap)
│   │   │   ├── reel-swiper/   # ReelSwiper & useReelSwiper (vertical snap swiper)
│   │   │   └── index.ts
│   │   └── tests/             # Component interaction & keyboard tests
│   └── media-ui-native/       # Pure headless React Native contracts
├── docs/                      # Comprehensive developer & component documentation
│   ├── sdk.md
│   └── components.md
├── skills/                    # AI Coding Assistant skill instructions
│   ├── media-react/SKILL.md   # Skill 1: Integrating media-react
│   └── media-ui-react/SKILL.md# Skill 2: Consuming media-ui-react
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── vitest.config.ts
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- Node.js `>= 18.0.0`
- `npm` or `pnpm`

### Installation & Build
```bash
# 1. Install all dependencies across the monorepo
npm install # or pnpm install

# 2. Run unit & integration test suites
npm run test # or pnpm test

# 3. Start the Web App demo
npm run dev # or pnpm dev
```

The demo application will launch locally at `http://localhost:3000`.

---

## 💡 Key Design Decisions & Architectural Rationale

### 1. In-Memory Cache with TTL & Request Deduplication
- **Problem**: Duplicate concurrent queries triggered by rapid typing or multiple components querying the same item causes redundant network traffic and hits Pexels rate limits.
- **Solution**:
  - `MemoryCache`: Employs a JavaScript `Map` where each entry tracks `expiresAt`. Expired entries are evicted automatically on access or via `purgeExpired()`.
  - `RequestDeduplicator`: Implements promise coalescing. When 3 concurrent callers request the exact same cache key while a request is in-flight, all 3 callers await the same underlying promise, resulting in **1 single network roundtrip**.

### 2. Truly Headless UI Components (`media-ui-react`)
- **Problem**: UI component libraries that bundle styling or specific CSS frameworks (like Tailwind) enforce styling lock-in and break when integrated into different design systems.
- **Solution**: Components (`Grid`, `Lightbox`, `ReelSwiper`) output semantic HTML and expose prop getters (`getModalProps`, `getBackdropProps`, `sentinelRef`) and render props (`renderItem(item, index, helpers)`), allowing total design freedom.

### 3. Automatic Console Logging & Event System
- `MediaClient` includes a built-in EventEmitter that dispatches `view`, `download`, and `search` events.
- By default, a styled console logger listens to all events on client initialization.
- In `media-react`, `useMediaEvents()` provides reactive subscription with automatic cleanup on component unmount.

---

## ⚖️ Trade-offs

| Decision | Advantage | Trade-off |
| :--- | :--- | :--- |
| **In-Memory Cache (Map)** | Instant lookups, zero external dependencies, lightweight. | Cleared on hard page reload (could be augmented with IndexedDB for persistence). |
| **IntersectionObserver Infinite Scroll** | High performance, no jank from continuous window scroll handlers. | Requires IntersectionObserver browser support (graceful fallback provided). |
| **Render Props & Prop Getters** | Maximum styling flexibility and headless composition. | Requires consumer to write markup for cards and modals. |

---

## 🔮 Future Improvements
1. **Persistent Cache Tier**: Optional IndexedDB / AsyncStorage adapter for offline multi-session persistence.
2. **Virtualization**: Integration with `@tanstack/virtual` inside `Grid` for ultra-large datasets (10,000+ items).
3. **Image Blurhash Placeholders**: Support Pexels color palette / blurhash decoding during lazy image load.
4. **Retry with Exponential Backoff**: Automatic retries for network glitches and 429 rate limit backoff headers.

---

## 🤖 AI-Assisted Instructions
See [`skills/media-react/SKILL.md`](file:///Users/sonu/Downloads/fotoowlAI/skills/media-react/SKILL.md) and [`skills/media-ui-react/SKILL.md`](file:///Users/sonu/Downloads/fotoowlAI/skills/media-ui-react/SKILL.md) for full AI integration workflows.
