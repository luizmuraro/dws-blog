import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { makeApiPost } from '@/test/factories';
import { getFetchUrl, stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { usePost } from './usePost';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePost', () => {
  it('starts loading and then exposes the mapped post', async () => {
    stubFetchJson(makeApiPost({ id: 'post-1', title: 'First' }));

    const { result } = renderHook(() => usePost('post-1'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toMatchObject({ id: 'post-1', title: 'First' });
  });

  it('requests the post by id', async () => {
    const fetchMock = stubFetchJson(makeApiPost());

    const { result } = renderHook(() => usePost('post-42'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getFetchUrl(fetchMock)).toMatch(/\/posts\/post-42$/);
  });

  it('refetches when the id changes', async () => {
    const fetchMock = stubFetchJson(makeApiPost());

    const { result, rerender } = renderHook(({ id }) => usePost(id), {
      initialProps: { id: 'post-1' },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ id: 'post-2' });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(getFetchUrl(fetchMock, 1)).toMatch(/\/posts\/post-2$/);
  });

  it('does not refetch when the id stays the same', async () => {
    const fetchMock = stubFetchJson(makeApiPost());

    const { result, rerender } = renderHook(({ id }) => usePost(id), {
      initialProps: { id: 'post-1' },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ id: 'post-1' });

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('exposes a missing post as an error', async () => {
    stubFetchError(404);

    const { result } = renderHook(() => usePost('missing'));

    await waitFor(() => expect(result.current.error).toMatchObject({ status: 404 }));
    expect(result.current.data).toBeNull();
  });
});
