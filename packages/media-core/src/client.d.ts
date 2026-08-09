import { CacheStats, CuratedPhotosParams, EventCallback, MediaEventMap, MediaItem, PaginatedResponse, Photo, PopularVideosParams, SdkConfig, SearchPhotosParams, SearchVideosParams, Video } from './types';
export declare class MediaClient {
    private config;
    private transport;
    private cache;
    private deduplicator;
    private events;
    private unsubscribeDefaultLogger?;
    constructor(config?: SdkConfig);
    /**
     * Update API key dynamically at runtime.
     */
    setApiKey(apiKey?: string): void;
    getApiKey(): string | undefined;
    /**
     * Configure mock mode at runtime.
     */
    setMockMode(mock: boolean): void;
    isMockMode(): boolean;
    /**
     * Search photos on Pexels with caching and request deduplication.
     */
    searchPhotos(params: SearchPhotosParams): Promise<PaginatedResponse<Photo>>;
    /**
     * Search videos on Pexels with caching and request deduplication.
     */
    searchVideos(params: SearchVideosParams): Promise<PaginatedResponse<Video>>;
    /**
     * Get curated photos.
     */
    getCurated(params?: CuratedPhotosParams): Promise<PaginatedResponse<Photo>>;
    getCuratedPhotos(params?: CuratedPhotosParams): Promise<PaginatedResponse<Photo>>;
    /**
     * Get popular videos.
     */
    getPopularVideos(params?: PopularVideosParams): Promise<PaginatedResponse<Video>>;
    /**
     * Fetch single photo by ID.
     */
    getPhotoById(id: number | string): Promise<Photo>;
    /**
     * Fetch single video by ID.
     */
    getVideoById(id: number | string): Promise<Video>;
    on<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): () => void;
    once<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): () => void;
    off<K extends keyof MediaEventMap>(event: K, callback: EventCallback<MediaEventMap[K]>): void;
    emit<K extends keyof MediaEventMap>(event: K, payload: MediaEventMap[K]): void;
    /**
     * Helper to emit view event.
     */
    recordView(item: MediaItem): void;
    /**
     * Helper to emit download event.
     */
    recordDownload(item: MediaItem, format?: string): void;
    clearCache(): void;
    getCacheStats(): CacheStats;
    private attachDefaultLogger;
    destroy(): void;
}
/**
 * Functional initialization factory helper.
 */
export declare function initialize(config?: SdkConfig): MediaClient;
//# sourceMappingURL=client.d.ts.map