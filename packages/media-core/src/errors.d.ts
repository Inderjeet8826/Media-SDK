export declare class MediaCoreError extends Error {
    readonly code: string;
    readonly status?: number;
    readonly details?: unknown;
    constructor(message: string, code?: string, status?: number, details?: unknown);
}
export declare class AuthenticationError extends MediaCoreError {
    constructor(message?: string, details?: unknown);
}
export declare class RateLimitError extends MediaCoreError {
    readonly retryAfterSeconds?: number;
    constructor(message?: string, retryAfterSeconds?: number, details?: unknown);
}
export declare class NotFoundError extends MediaCoreError {
    constructor(message?: string, details?: unknown);
}
export declare class NetworkError extends MediaCoreError {
    constructor(message?: string, details?: unknown);
}
export declare class TimeoutError extends MediaCoreError {
    constructor(message?: string, details?: unknown);
}
//# sourceMappingURL=errors.d.ts.map