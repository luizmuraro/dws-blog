import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { makeApiCategory } from '@/test/factories';
import { stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { useCategories } from './useCategories';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useCategories', () => {
  it('does not fetch while it is disabled', () => {
    const fetchMock = stubFetchJson([]);

    const { result } = renderHook(() => useCategories(false));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current).toEqual({ categories: [], isLoading: false });
  });

  it('fetches the categories once it becomes enabled', async () => {
    const fetchMock = stubFetchJson([makeApiCategory({ id: 'category-1', name: 'Design' })]);

    const { result, rerender } = renderHook(({ enabled }) => useCategories(enabled), {
      initialProps: { enabled: false },
    });

    rerender({ enabled: true });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.current.categories).toEqual([{ id: 'category-1', name: 'Design' }]);
  });

  it('fetches right away when it starts enabled', async () => {
    stubFetchJson([makeApiCategory({ name: 'Frontend' })]);

    const { result } = renderHook(() => useCategories(true));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.categories).toHaveLength(1));
  });

  it('keeps the loaded categories after being disabled again', async () => {
    stubFetchJson([makeApiCategory({ name: 'Design' })]);

    const { result, rerender } = renderHook(({ enabled }) => useCategories(enabled), {
      initialProps: { enabled: true },
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    rerender({ enabled: false });

    expect(result.current.categories).toHaveLength(1);
  });

  it('does not refetch when it is toggled again', async () => {
    const fetchMock = stubFetchJson([makeApiCategory({ name: 'Design' })]);

    const { result, rerender } = renderHook(({ enabled }) => useCategories(enabled), {
      initialProps: { enabled: true },
    });

    await waitFor(() => expect(result.current.categories).toHaveLength(1));

    rerender({ enabled: false });
    rerender({ enabled: true });

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('swallows a failed request and stays empty', async () => {
    stubFetchError(500);

    const { result } = renderHook(() => useCategories(true));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.categories).toEqual([]);
  });
});
