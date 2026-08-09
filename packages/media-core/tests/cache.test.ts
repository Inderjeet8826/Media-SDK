import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryCache, RequestDeduplicator } from '../src/cache';

describe('MemoryCache', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache(100); // 100ms TTL
  });

  it('stores and retrieves cached values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    expect(cache.has('key1')).toBe(true);
  });

  it('expires entries after TTL', async () => {
    cache.set('key-exp', 'value-exp', 50);
    expect(cache.get('key-exp')).toBe('value-exp');

    await new Promise((r) => setTimeout(r, 60));
    expect(cache.get('key-exp')).toBeUndefined();
    expect(cache.has('key-exp')).toBe(false);
  });

  it('tracks cache hits and misses', () => {
    cache.set('item', 'val');
    cache.get('item'); // Hit
    cache.get('item'); // Hit
    cache.get('non-existent'); // Miss

    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.size).toBe(1);
  });

  it('clears all entries', () => {
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');
    cache.clear();

    expect(cache.get('k1')).toBeUndefined();
    expect(cache.getStats().size).toBe(0);
  });
});

describe('RequestDeduplicator', () => {
  it('deduplicates simultaneous concurrent identical requests into a single task execution', async () => {
    const deduplicator = new RequestDeduplicator();
    const taskSpy = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 30));
      return { result: 42 };
    });

    const promise1 = deduplicator.execute('query-key', taskSpy);
    const promise2 = deduplicator.execute('query-key', taskSpy);
    const promise3 = deduplicator.execute('query-key', taskSpy);

    const [res1, res2, res3] = await Promise.all([promise1, promise2, promise3]);

    expect(res1).toEqual({ result: 42 });
    expect(res2).toEqual({ result: 42 });
    expect(res3).toEqual({ result: 42 });
    expect(taskSpy).toHaveBeenCalledTimes(1);
    expect(deduplicator.inflightCount).toBe(0);
  });
});
