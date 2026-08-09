export interface PhotoSrc {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
}
export interface Photo {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    src: PhotoSrc;
    liked: boolean;
    alt: string;
    type: 'photo';
}
export interface VideoFile {
    id: number;
    quality: 'hd' | 'sd' | 'hls' | string;
    file_type: string;
    width: number | null;
    height: number | null;
    fps: number | null;
    link: string;
}
export interface VideoPicture {
    id: number;
    picture: string;
    nr: number;
}
export interface VideoUser {
    id: number;
    name: string;
    url: string;
}
export interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    duration: number;
    user: VideoUser;
    video_files: VideoFile[];
    video_pictures: VideoPicture[];
    alt?: string;
    type: 'video';
}
export type MediaItem = Photo | Video;
export interface PaginationParams {
    page?: number;
    per_page?: number;
}
export interface SearchPhotosParams extends PaginationParams {
    query: string;
    orientation?: 'landscape' | 'portrait' | 'square';
    size?: 'large' | 'medium' | 'small';
    color?: string;
    locale?: string;
}
export interface SearchVideosParams extends PaginationParams {
    query: string;
    orientation?: 'landscape' | 'portrait' | 'square';
    size?: 'large' | 'medium' | 'small';
    locale?: string;
}
export interface CuratedPhotosParams extends PaginationParams {
}
export interface PopularVideosParams extends PaginationParams {
    min_width?: number;
    min_height?: number;
    min_duration?: number;
    max_duration?: number;
}
export interface PaginatedResponse<T> {
    page: number;
    per_page: number;
    total_results: number;
    next_page?: string;
    prev_page?: string;
    items: T[];
}
export interface RawPexelsPhotosResponse {
    page: number;
    per_page: number;
    total_results: number;
    next_page?: string;
    prev_page?: string;
    photos: Photo[];
}
export interface RawPexelsVideosResponse {
    page: number;
    per_page: number;
    total_results: number;
    next_page?: string;
    prev_page?: string;
    videos: Video[];
}
export interface MediaEventMap {
    view: {
        item: MediaItem;
        timestamp: number;
    };
    download: {
        item: MediaItem;
        format?: string;
        timestamp: number;
    };
    search: {
        query: string;
        mediaType: 'photo' | 'video';
        timestamp: number;
    };
    error: {
        error: Error;
        context?: string;
        timestamp: number;
    };
    [key: string]: unknown;
}
export type EventCallback<T = any> = (payload: T) => void;
export interface SdkConfig {
    apiKey?: string;
    baseUrl?: string;
    cacheTtlMs?: number;
    enableLogging?: boolean;
    mockMode?: boolean;
    timeoutMs?: number;
}
export interface CacheStats {
    size: number;
    hits: number;
    misses: number;
    inflightRequests: number;
}
//# sourceMappingURL=types.d.ts.map