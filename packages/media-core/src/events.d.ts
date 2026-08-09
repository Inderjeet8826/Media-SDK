import { EventCallback, MediaEventMap } from './types';
export type EventKey<TEvents extends Record<string, any>> = Extract<keyof TEvents, string>;
export declare class EventEmitter<TEvents extends Record<string, any> = MediaEventMap> {
    private listeners;
    private wildcardListeners;
    /**
     * Register an event listener.
     */
    on<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): () => void;
    on(event: string, callback: EventCallback<any>): () => void;
    /**
     * Register a one-time event listener.
     */
    once<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): () => void;
    once(event: string, callback: EventCallback<any>): () => void;
    /**
     * Unregister an event listener.
     */
    off<K extends EventKey<TEvents>>(event: K, callback: EventCallback<TEvents[K]>): void;
    off(event: string, callback: EventCallback<any>): void;
    /**
     * Register a listener that catches all events.
     */
    onAny(callback: (event: string, payload: any) => void): () => void;
    /**
     * Emit an event to all registered listeners.
     */
    emit<K extends EventKey<TEvents>>(event: K, payload: TEvents[K]): void;
    emit(event: string, payload: any): void;
    /**
     * Remove all listeners.
     */
    removeAllListeners(event?: string): void;
    /**
     * Get active listener count for an event or total.
     */
    listenerCount(event?: string): number;
}
//# sourceMappingURL=events.d.ts.map