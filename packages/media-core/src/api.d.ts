export interface RequestOptions {
    headers?: Record<string, string>;
    timeoutMs?: number;
    params?: Record<string, string | number | boolean | undefined>;
}
export declare class HttpTransport {
    private baseUrl;
    private apiKey?;
    private defaultTimeoutMs;
    constructor(baseUrl?: string, apiKey?: string, defaultTimeoutMs?: number);
    setApiKey(apiKey?: string): void;
    getApiKey(): string | undefined;
    /**
     * Execute an HTTP GET request with authentication and typed error mapping.
     */
    get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
    private buildUrl;
    private handleHttpError;
}
//# sourceMappingURL=api.d.ts.map