import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getFetchInit,
  getFetchUrl,
  stubFetchError,
  stubFetchJson,
  stubFetchReject,
} from '@/test/mockFetch';

const DEFAULT_BASE_URL = 'https://tech-test-backend.dwsbrazil.io';

const loadClient = async (baseUrl?: string) => {
  vi.stubEnv('VITE_API_BASE_URL', baseUrl);
  vi.resetModules();

  return import('./client');
};

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('request', () => {
  it('prefixes the path with the configured base url', async () => {
    const fetchMock = stubFetchJson([]);
    const { request } = await loadClient('https://api.test');

    await request('/posts');

    expect(getFetchUrl(fetchMock)).toBe('https://api.test/posts');
  });

  it('falls back to the production base url when the env var is unset', async () => {
    const fetchMock = stubFetchJson([]);
    const { request } = await loadClient(undefined);

    await request('/posts');

    expect(getFetchUrl(fetchMock)).toBe(`${DEFAULT_BASE_URL}/posts`);
  });

  it('returns the parsed json body', async () => {
    stubFetchJson({ id: 'post-1', title: 'Hello' });
    const { request } = await loadClient('https://api.test');

    await expect(request('/posts/post-1')).resolves.toEqual({ id: 'post-1', title: 'Hello' });
  });

  it('forwards the request init, including the abort signal', async () => {
    const fetchMock = stubFetchJson([]);
    const { request } = await loadClient('https://api.test');
    const controller = new AbortController();

    await request('/posts', { signal: controller.signal, headers: { Accept: 'application/json' } });

    expect(getFetchInit(fetchMock)).toEqual({
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
  });

  it('throws an ApiError when the response is not ok', async () => {
    stubFetchError(404);
    const { request, ApiError } = await loadClient('https://api.test');

    await expect(request('/posts/missing')).rejects.toBeInstanceOf(ApiError);
  });

  it('carries the status, the url and a readable message on the error', async () => {
    stubFetchError(500);
    const { request, ApiError } = await loadClient('https://api.test');

    const error = await request('/posts').catch((thrown: unknown) => thrown);

    expect(error).toMatchObject({
      name: 'ApiError',
      status: 500,
      url: 'https://api.test/posts',
      message: 'Request to https://api.test/posts failed with status 500',
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
  });

  it('propagates a network failure untouched', async () => {
    const networkError = new TypeError('Failed to fetch');
    stubFetchReject(networkError);
    const { request } = await loadClient('https://api.test');

    await expect(request('/posts')).rejects.toBe(networkError);
  });
});
