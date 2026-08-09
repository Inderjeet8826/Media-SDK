import { HttpTransport } from './api';
import { MemoryCache, RequestDeduplicator } from './cache';
import { EventEmitter } from './events';
import {
  CacheStats,
  CuratedPhotosParams,
  EventCallback,
  MediaEventMap,
  MediaItem,
  PaginatedResponse,
  Photo,
  PopularVideosParams,
  RawPexelsPhotosResponse,
  RawPexelsVideosResponse,
  SdkConfig,
  SearchPhotosParams,
  SearchVideosParams,
  Video,
} from './types';
import { generateMockPhotos, generateMockVideos } from './mock';

export class MediaClient {
  private config: SdkConfig;
  private transport: HttpTransport;
  private cache: MemoryCache<any>;
  private deduplicator: RequestDeduplicator;
  private events: EventEmitter<MediaEventMap>;
  private unsubscribeDefaultLogger?: () => void;

  constructor(config: SdkConfig = {}) {
    this.config = {
      baseUrl: 'https://api.pexels.com',
      cacheTtlMs: 5 * 60 * 1000,
      enableLogging: true,
      mockMode: false,
      timeoutMs: 10000,
      ...config,
    };

    this.transport = new HttpTransport(this.config.baseUrl, this.config.apiKey, this.config.timeoutMs);
    this.cache = new MemoryCache(this.config.cacheTtlMs);
    this.deduplicator = new RequestDeduplicator();
    this.events = new EventEmitter<MediaEventMap>();

    if (this.config.enableLogging) {
      this.attachDefaultLogger();
    }
  }

  /**
   * Update API key dynamically at runtime.
   */
  public setApiKey(apiKey?: string): void {
    this.config.apiKey = apiKey;
    this.transport.setApiKey(apiKey);
  }

  public getApiKey(): string | undefined {
    return this.config.apiKey;
  }

  /**
   * Configure mock mode at runtime.
   */
  public setMockMode(mock: boolean): void {
    this.config.mockMode = mock;
  }

  public isMockMode(): boolean {
    return !!this.config.mockMode || !this.config.apiKey;
  }

  /**
   * Search photos on Pexels with caching and request deduplication.
   */
  public async searchPhotos(params: SearchPhotosParams): Promise<PaginatedResponse<Photo>> {
    const page = params.page || 1;
    const perPage = params.per_page || 15;
    const query = (params.query || '').trim();
    const cacheKey = `photos:search:${query}:${page}:${perPage}:${params.orientation || ''}:${params.size || ''}:${params.color || ''}`;

    // 1. Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Request deduplication
    return this.deduplicator.execute(cacheKey, async () => {
      let result: PaginatedResponse<Photo>;

      if (this.isMockMode()) {
        result = generateMockPhotos(page, perPage, query);
      } else {
        const raw = await this.transport.get<RawPexelsPhotosResponse>('/v1/search', {
          params: {
            query,
            page,
            per_page: perPage,
            orientation: params.orientation,
            size: params.size,
            color: params.color,
            locale: params.locale,
          },
        });

        result = {
          page: raw.page,
          per_page: raw.per_page,
          total_results: raw.total_results,
          next_page: raw.next_page,
          prev_page: raw.prev_page,
          items: (raw.photos || []).map((p) => ({ ...p, type: 'photo' as const })),
        };
      }

      this.cache.set(cacheKey, result);
      this.events.emit('search', { query, mediaType: 'photo', timestamp: Date.now() });
      return result;
    });
  }

  /**
   * Search videos on Pexels with caching and request deduplication.
   */
  public async searchVideos(params: SearchVideosParams): Promise<PaginatedResponse<Video>> {
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const query = (params.query || '').trim();
    const cacheKey = `videos:search:${query}:${page}:${perPage}:${params.orientation || ''}:${params.size || ''}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      let result: PaginatedResponse<Video>;

      if (this.isMockMode()) {
        result = generateMockVideos(page, perPage, query);
      } else {
        const raw = await this.transport.get<RawPexelsVideosResponse>('/videos/search', {
          params: {
            query,
            page,
            per_page: perPage,
            orientation: params.orientation,
            size: params.size,
            locale: params.locale,
          },
        });

        result = {
          page: raw.page,
          per_page: raw.per_page,
          total_results: raw.total_results,
          next_page: raw.next_page,
          prev_page: raw.prev_page,
          items: (raw.videos || []).map((v) => ({ ...v, type: 'video' as const })),
        };
      }

      this.cache.set(cacheKey, result);
      this.events.emit('search', { query, mediaType: 'video', timestamp: Date.now() });
      return result;
    });
  }

  /**
   * Get curated photos.
   */
  public async getCurated(params: CuratedPhotosParams = {}): Promise<PaginatedResponse<Photo>> {
    return this.getCuratedPhotos(params);
  }

  public async getCuratedPhotos(params: CuratedPhotosParams = {}): Promise<PaginatedResponse<Photo>> {
    const page = params.page || 1;
    const perPage = params.per_page || 15;
    const cacheKey = `photos:curated:${page}:${perPage}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      let result: PaginatedResponse<Photo>;

      if (this.isMockMode()) {
        result = generateMockPhotos(page, perPage);
      } else {
        const raw = await this.transport.get<RawPexelsPhotosResponse>('/v1/curated', {
          params: { page, per_page: perPage },
        });

        result = {
          page: raw.page,
          per_page: raw.per_page,
          total_results: raw.total_results,
          next_page: raw.next_page,
          prev_page: raw.prev_page,
          items: (raw.photos || []).map((p) => ({ ...p, type: 'photo' as const })),
        };
      }

      this.cache.set(cacheKey, result);
      return result;
    });
  }

  /**
   * Get popular videos.
   */
  public async getPopularVideos(params: PopularVideosParams = {}): Promise<PaginatedResponse<Video>> {
    const page = params.page || 1;
    const perPage = params.per_page || 10;
    const cacheKey = `videos:popular:${page}:${perPage}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      let result: PaginatedResponse<Video>;

      if (this.isMockMode()) {
        result = generateMockVideos(page, perPage);
      } else {
        const raw = await this.transport.get<RawPexelsVideosResponse>('/videos/popular', {
          params: {
            page,
            per_page: perPage,
            min_width: params.min_width,
            min_height: params.min_height,
            min_duration: params.min_duration,
            max_duration: params.max_duration,
          },
        });

        result = {
          page: raw.page,
          per_page: raw.per_page,
          total_results: raw.total_results,
          next_page: raw.next_page,
          prev_page: raw.prev_page,
          items: (raw.videos || []).map((v) => ({ ...v, type: 'video' as const })),
        };
      }

      this.cache.set(cacheKey, result);
      return result;
    });
  }

  /**
   * Fetch single photo by ID.
   */
  public async getPhotoById(id: number | string): Promise<Photo> {
    const cacheKey = `photo:id:${id}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      let photo: Photo;
      if (this.isMockMode()) {
        const mockPage = generateMockPhotos(1, 20);
        photo = mockPage.items[0] ? { ...mockPage.items[0], id: Number(id) } : generateMockPhotos(1, 1).items[0];
      } else {
        const raw = await this.transport.get<Photo>(`/v1/photos/${id}`);
        photo = { ...raw, type: 'photo' as const };
      }
      this.cache.set(cacheKey, photo);
      return photo;
    });
  }

  /**
   * Fetch single video by ID.
   */
  public async getVideoById(id: number | string): Promise<Video> {
    const cacheKey = `video:id:${id}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return this.deduplicator.execute(cacheKey, async () => {
      let video: Video;
      if (this.isMockMode()) {
        const mockPage = generateMockVideos(1, 5);
        video = mockPage.items[0] ? { ...mockPage.items[0], id: Number(id) } : generateMockVideos(1, 1).items[0];
      } else {
        const raw = await this.transport.get<Video>(`/videos/videos/${id}`);
        video = { ...raw, type: 'video' as const };
      }
      this.cache.set(cacheKey, video);
      return video;
    });
  }

  // --- Event Subscriptions ---

  public on<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): () => void;
  public on(event: string, callback: EventCallback<any>): () => void {
    return this.events.on(event, callback);
  }

  public once<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): () => void;
  public once(event: string, callback: EventCallback<any>): () => void {
    return this.events.once(event, callback);
  }

  public off<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): void;
  public off(event: string, callback: EventCallback<any>): void {
    this.events.off(event, callback);
  }

  public emit<K extends keyof MediaEventMap>(event: K, payload: MediaEventMap[K]): void;
  public emit(event: string, payload: any): void {
    this.events.emit(event, payload);
  }

  /**
   * Helper to emit view event.
   */
  public recordView(item: MediaItem): void {
    this.emit('view', { item, timestamp: Date.now() });
  }

  /**
   * Helper to emit download event.
   */
  public recordDownload(item: MediaItem, format?: string): void {
    this.emit('download', { item, format, timestamp: Date.now() });
  }

  // --- Cache Utilities ---

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): CacheStats {
    return this.cache.getStats(this.deduplicator.inflightCount);
  }

  private attachDefaultLogger(): void {
    this.unsubscribeDefaultLogger = this.events.onAny((event, payload) => {
      const time = new Date().toLocaleTimeString();
      console.log(`%c[MediaCore SDK] %c${event.toUpperCase()} %c(${time})`, 'color: #3b82f6; font-weight: bold', 'color: #10b981; font-weight: bold', 'color: #6b7280', payload);
    });
  }

  public destroy(): void {
    if (this.unsubscribeDefaultLogger) {
      this.unsubscribeDefaultLogger();
    }
    this.events.removeAllListeners();
    this.cache.clear();
    this.deduplicator.clear();
  }
}

/**
 * Functional initialization factory helper.
 */
export function initialize(config: SdkConfig = {}): MediaClient {
  return new MediaClient(config);
}
