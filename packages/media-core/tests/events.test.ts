import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../src/events';

describe('EventEmitter', () => {
  it('registers and emits typed events', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();

    const unsubscribe = emitter.on('view', handler);
    const payload = { item: { id: 1, type: 'photo' } as any, timestamp: 12345 };

    emitter.emit('view', payload);

    expect(handler).toHaveBeenCalledWith(payload);
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
    emitter.emit('view', payload);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports once() one-time listener execution', () => {
    const emitter = new EventEmitter();
    const handler = vi.fn();

    emitter.once('download', handler);
    const payload = { item: { id: 2, type: 'photo' } as any, timestamp: 12345 };

    emitter.emit('download', payload);
    emitter.emit('download', payload);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports onAny() wildcard listener for all events', () => {
    const emitter = new EventEmitter();
    const wildcard = vi.fn();

    emitter.onAny(wildcard);
    emitter.emit('view', { item: { id: 10 } as any, timestamp: 1 });
    emitter.emit('download', { item: { id: 10 } as any, timestamp: 2 });

    expect(wildcard).toHaveBeenCalledTimes(2);
    expect(wildcard).toHaveBeenNthCalledWith(1, 'view', expect.objectContaining({ timestamp: 1 }));
    expect(wildcard).toHaveBeenNthCalledWith(2, 'download', expect.objectContaining({ timestamp: 2 }));
  });
});
