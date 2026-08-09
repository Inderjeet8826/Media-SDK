import { EventCallback, MediaEventMap } from './types';

export type EventKey<TEvents extends Record<string, any>> = Extract<keyof TEvents, string>;

export class EventEmitter<TEvents extends Record<string, any> = MediaEventMap> {
  private listeners: Map<string, Set<EventCallback<any>>> = new Map();
  private wildcardListeners: Set<(event: string, payload: any) => void> = new Set();

  /**
   * Register an event listener.
   */
  public on<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): () => void;
  public on(event: string, callback: EventCallback<any>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Register a one-time event listener.
   */
  public once<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): () => void;
  public once(event: string, callback: EventCallback<any>): () => void {
    const onceWrapper: EventCallback<any> = (payload: any) => {
      this.off(event, onceWrapper);
      callback(payload);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * Unregister an event listener.
   */
  public off<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): void;
  public off(event: string, callback: EventCallback<any>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Register a listener that catches all events.
   */
  public onAny(callback: (event: string, payload: any) => void): () => void {
    this.wildcardListeners.add(callback);
    return () => {
      this.wildcardListeners.delete(callback);
    };
  }

  /**
   * Emit an event to all registered listeners.
   */
  public emit<K extends EventKey<TEvents>>(event: K, payload: TEvents[K]): void;
  public emit(event: string, payload: any): void {
    // Notify wildcard listeners
    for (const wildcard of this.wildcardListeners) {
      try {
        wildcard(event, payload);
      } catch (err) {
        console.error(`[MediaCore EventEmitter] Error in wildcard listener for "${event}":`, err);
      }
    }

    // Notify specific event listeners
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      for (const cb of Array.from(callbacks)) {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[MediaCore EventEmitter] Error in listener for "${event}":`, err);
        }
      }
    }
  }

  /**
   * Remove all listeners.
   */
  public removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
      this.wildcardListeners.clear();
    }
  }

  /**
   * Get active listener count for an event or total.
   */
  public listenerCount(event?: string): number {
    if (event) {
      return this.listeners.get(event)?.size ?? 0;
    }
    let total = this.wildcardListeners.size;
    for (const set of this.listeners.values()) {
      total += set.size;
    }
    return total;
  }
}
