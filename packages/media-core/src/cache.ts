import { CacheStats } from './types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export class MemoryCache<T = any> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(defaultTtlMs: number = 5 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Retrieve cached value if present and not expired.
   */
  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return undefined;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Store a value with an optional custom TTL.
   */
  public set(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const now = Date.now();
    this.store.set(key, {
      data,
      expiresAt: now + ttl,
      createdAt: now,
    });
  }

  /**
   * Check if non-expired key exists.
   */
  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key from cache.
   */
  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cached entries.
   */
  public clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Purge expired entries to reclaim memory.
   */
  public purgeExpired(): number {
    const now = Date.now();
    let purged = 0;
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        purged++;
      }
    }
    return purged;
  }

  /**
   * Get telemetry stats for the cache.
   */
  public getStats(inflightCount: number = 0): CacheStats {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      inflightRequests: inflightCount,
    };
  }
}

/**
 * Request Deduplicator coalesces concurrent identical asynchronous operations
 * so only one network call executes for multiple callers.
 */
export class RequestDeduplicator {
  private inflight: Map<string, Promise<any>> = new Map();

  /**
   * Execute an async factory function or join an already running promise for the given key.
   */
  public async execute<T>(key: string, task: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = (async () => {
      try {
        return await task();
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    return promise;
  }

  /**
   * Number of currently pending in-flight requests.
   */
  public get inflightCount(): number {
    return this.inflight.size;
  }

  /**
   * Check if a specific key is in-flight.
   */
  public isInflight(key: string): boolean {
    return this.inflight.has(key);
  }

  /**
   * Clear pending promises reference map.
   */
  public clear(): void {
    this.inflight.clear();
  }
}
