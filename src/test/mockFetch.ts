import { vi } from 'vitest';

type FetchMock = ReturnType<typeof vi.fn<typeof fetch>>;

const installFetchMock = (implementation: typeof fetch): FetchMock => {
  const mock = vi.fn(implementation);

  vi.stubGlobal('fetch', mock);

  return mock;
};

export const stubFetchJson = (payload: unknown): FetchMock =>
  installFetchMock(async () => new Response(JSON.stringify(payload), { status: 200 }));

export const stubFetchError = (status: number): FetchMock =>
  installFetchMock(async () => new Response('', { status }));

export const stubFetchReject = (error: unknown): FetchMock =>
  installFetchMock(() => Promise.reject(error));

export const getFetchUrl = (mock: FetchMock, callIndex = 0): string =>
  String(mock.mock.calls[callIndex]?.[0]);

export const getFetchInit = (mock: FetchMock, callIndex = 0): RequestInit | undefined =>
  mock.mock.calls[callIndex]?.[1];
