import { describe, it, expect } from 'vitest';
import {
  MediaCoreError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  NetworkError,
  TimeoutError,
} from '../src/errors';

describe('Error Hierarchy', () => {
  it('instantiates AuthenticationError with 401 status', () => {
    const err = new AuthenticationError();
    expect(err).toBeInstanceOf(MediaCoreError);
    expect(err.name).toBe('AuthenticationError');
    expect(err.status).toBe(401);
    expect(err.code).toBe('AUTHENTICATION_ERROR');
  });

  it('instantiates RateLimitError with retryAfterSeconds', () => {
    const err = new RateLimitError('Rate limited', 60);
    expect(err).toBeInstanceOf(MediaCoreError);
    expect(err.name).toBe('RateLimitError');
    expect(err.status).toBe(429);
    expect(err.retryAfterSeconds).toBe(60);
  });

  it('instantiates NotFoundError with 404 status', () => {
    const err = new NotFoundError();
    expect(err.status).toBe(404);
    expect(err.name).toBe('NotFoundError');
  });

  it('instantiates NetworkError and TimeoutError', () => {
    const netErr = new NetworkError('Failed fetch');
    expect(netErr.name).toBe('NetworkError');

    const timeoutErr = new TimeoutError();
    expect(timeoutErr.status).toBe(408);
  });
});
