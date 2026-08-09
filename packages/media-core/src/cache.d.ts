import { CacheStats } from './types';
export declare class MemoryCache<T = any> {
    private store;
    private defaultTtlMs;
    private hits;
    private misses;
    constructor(defaultTtlMs?: number);
    /**
     * Retrieve cached value if present and not expired.
     */
    get(key: string): T | undefined;
    /**
     * Store a value with an optional custom TTL.
     */
    set(key: string, data: T, ttlMs?: number): void;
    /**
     * Check if non-expired key exists.
     */
    has(key: string): boolean;
    /**
     * Delete a key from cache.
     */
    delete(key: string): boolean;
    /**
     * Clear all cached entries.
     */
    clear(): void;
    /**
     * Purge expired entries to reclaim memory.
     */
    purgeExpired(): number;
    /**
     * Get telemetry stats for the cache.
     */
    getStats(inflightCount?: number): CacheStats;
}
/**
 * Request Deduplicator coalesces concurrent identical asynchronous operations
 * so only one network call executes for multiple callers.
 */
export declare class RequestDeduplicator {
    private inflight;
    /**
     * Execute an async factory function or join an already running promise for the given key.
     */
    execute<T>(key: string, task: () => Promise<T>): Promise<T>;
    /**
     * Number of currently pending in-flight requests.
     */
    get inflightCount(): number;
    /**
     * Check if a specific key is in-flight.
     */
    isInflight(key: string): boolean;
    /**
     * Clear pending promises reference map.
     */
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map