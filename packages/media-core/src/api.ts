import { AuthenticationError, MediaCoreError, NetworkError, NotFoundError, RateLimitError, TimeoutError } from './errors';

export interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HttpTransport {
  private baseUrl: string;
  private apiKey?: string;
  private defaultTimeoutMs: number;

  constructor(baseUrl: string = 'https://api.pexels.com', apiKey?: string, defaultTimeoutMs: number = 10000) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  public setApiKey(apiKey?: string): void {
    this.apiKey = apiKey;
  }

  public getApiKey(): string | undefined {
    return this.apiKey;
  }

  /**
   * Execute an HTTP GET request with authentication and typed error mapping.
   */
  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = this.apiKey;
    }

    const timeout = options.timeoutMs ?? this.defaultTimeoutMs;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller ? controller.signal : undefined,
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err instanceof MediaCoreError) {
        throw err;
      }
      if (err.name === 'AbortError') {
        throw new TimeoutError(`Request to ${endpoint} timed out after ${timeout}ms.`);
      }
      throw new NetworkError(`Network request failed: ${err.message || String(err)}`, err);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): URL {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url;
  }

  private async handleHttpError(response: Response): Promise<never> {
    let errorBody: any = null;
    try {
      errorBody = await response.json();
    } catch {
      // Body wasn't json
    }

    const status = response.status;
    const message = errorBody?.error || errorBody?.message || `HTTP ${status}: ${response.statusText}`;

    if (status === 401 || status === 403) {
      throw new AuthenticationError(
        'Authentication failed. Please verify your Pexels API key.',
        { status, errorBody }
      );
    }

    if (status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
      throw new RateLimitError(
        'Pexels API rate limit exceeded. Consider caching or waiting before making further requests.',
        retryAfter,
        { status, errorBody }
      );
    }

    if (status === 404) {
      throw new NotFoundError(`The requested media resource was not found.`, { status, errorBody });
    }

    throw new MediaCoreError(message, 'HTTP_ERROR', status, errorBody);
  }
}
