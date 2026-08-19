import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { makeApiPost } from '@/test/factories';
import { getFetchUrl, stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { usePosts } from './usePosts';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePosts', () => {
  it('starts loading and then exposes the mapped listing', async () => {
    stubFetchJson([makeApiPost({ id: 'post-1' }), makeApiPost({ id: 'post-2' })]);

    const { result } = renderHook(() => usePosts());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.map((post) => post.id)).toEqual(['post-1', 'post-2']);
    expect(result.current.error).toBeNull();
  });

  it('requests the posts listing exactly once', async () => {
    const fetchMock = stubFetchJson([]);

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(getFetchUrl(fetchMock)).toMatch(/\/posts$/);
  });

  it('exposes a failed request as an error', async () => {
    stubFetchError(500);

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.data).toBeNull();
  });

  it('refetches when retry is invoked', async () => {
    const fetchMock = stubFetchJson([]);

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.retry();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
