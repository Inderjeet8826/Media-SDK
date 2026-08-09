export class MediaCoreError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string = 'MEDIA_CORE_ERROR', status?: number, details?: unknown) {
    super(message);
    this.name = 'MediaCoreError';
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends MediaCoreError {
  constructor(message: string = 'Missing or invalid Pexels API Key. Please provide a valid apiKey in initialization.', details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends MediaCoreError {
  public readonly retryAfterSeconds?: number;

  constructor(message: string = 'Pexels API rate limit exceeded.', retryAfterSeconds?: number, details?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class NotFoundError extends MediaCoreError {
  constructor(message: string = 'The requested media item was not found.', details?: unknown) {
    super(message, 'NOT_FOUND_ERROR', 404, details);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends MediaCoreError {
  constructor(message: string = 'Network error occurred while fetching media.', details?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, details);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends MediaCoreError {
  constructor(message: string = 'Request timed out.', details?: unknown) {
    super(message, 'TIMEOUT_ERROR', 408, details);
    this.name = 'TimeoutError';
  }
}
