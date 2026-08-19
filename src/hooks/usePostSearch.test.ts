import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { makeApiPost } from '@/test/factories';
import { stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { MIN_SEARCH_LENGTH, SEARCH_DEBOUNCE_MS, usePostSearch } from './usePostSearch';

const listing = [
  makeApiPost({ id: 'post-1', title: 'Understanding React hooks' }),
  makeApiPost({ id: 'post-2', title: 'Design systems at scale' }),
];

// waitFor never resolves under fake timers, so pending work is flushed by hand.
const settle = async (ms = SEARCH_DEBOUNCE_MS) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('usePostSearch query threshold', () => {
  it('exposes the minimum length it requires', () => {
    expect(MIN_SEARCH_LENGTH).toBe(2);
  });

  it('does not fetch for a term shorter than the minimum', () => {
    const fetchMock = stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('r'));

    expect(result.current.hasQuery).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats a whitespace-only term as no query', () => {
    const fetchMock = stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('   '));

    expect(result.current.hasQuery).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches the listing as soon as the term reaches the minimum length', () => {
    const fetchMock = stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('re'));

    expect(result.current.hasQuery).toBe(true);
    expect(result.current.isLoading).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe('usePostSearch debounce', () => {
  it('reports a pending state until the typed term settles', async () => {
    stubFetchJson(listing);

    const { result, rerender } = renderHook(({ term }) => usePostSearch(term), {
      initialProps: { term: 'react' },
    });

    await settle();
    expect(result.current.isPending).toBe(false);
    expect(result.current.term).toBe('react');

    rerender({ term: 'design' });
    expect(result.current.isPending).toBe(true);
    expect(result.current.term).toBe('react');

    await settle();
    expect(result.current.isPending).toBe(false);
    expect(result.current.term).toBe('design');
  });

  it('keeps waiting while the term keeps changing', async () => {
    stubFetchJson(listing);

    const { result, rerender } = renderHook(({ term }) => usePostSearch(term), {
      initialProps: { term: 're' },
    });

    await settle(200);
    rerender({ term: 'rea' });
    await settle(200);
    rerender({ term: 'react' });
    await settle(200);

    expect(result.current.isPending).toBe(true);

    await settle();
    expect(result.current.term).toBe('react');
  });

  it('trims the raw term before debouncing it', async () => {
    stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('  react  '));

    await settle();

    expect(result.current.term).toBe('react');
    expect(result.current.isPending).toBe(false);
  });
});

describe('usePostSearch results', () => {
  it('matches the settled term against the fetched listing', async () => {
    stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('react'));

    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.results.map((post) => post.id)).toEqual(['post-1']);
  });

  it('stays empty while the settled term is still below the minimum length', async () => {
    stubFetchJson(listing);

    const { result } = renderHook(() => usePostSearch('r'));

    await settle();

    expect(result.current.results).toEqual([]);
  });

  it('updates the results when the term changes without refetching', async () => {
    const fetchMock = stubFetchJson(listing);

    const { result, rerender } = renderHook(({ term }) => usePostSearch(term), {
      initialProps: { term: 'react' },
    });

    await settle();
    expect(result.current.results).toHaveLength(1);

    rerender({ term: 'design' });
    await settle();

    expect(result.current.results.map((post) => post.id)).toEqual(['post-2']);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('fetches the listing only once across several queries', async () => {
    const fetchMock = stubFetchJson(listing);

    const { rerender } = renderHook(({ term }) => usePostSearch(term), {
      initialProps: { term: 'react' },
    });

    await settle();

    rerender({ term: '' });
    await settle();
    rerender({ term: 'design' });
    await settle();

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe('usePostSearch failure', () => {
  it('exposes a failed listing as an error', async () => {
    stubFetchError(500);

    const { result } = renderHook(() => usePostSearch('react'));

    await settle();

    expect(result.current.error).toMatchObject({ name: 'ApiError', status: 500 });
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('refetches when retry is invoked after a failure', async () => {
    const fetchMock = stubFetchError(500);

    const { result } = renderHook(() => usePostSearch('react'));

    await settle();
    expect(result.current.error).not.toBeNull();

    await act(async () => {
      result.current.retry();
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('recovers when the retry succeeds', async () => {
    stubFetchError(500);

    const { result } = renderHook(() => usePostSearch('react'));

    await settle();
    expect(result.current.error).not.toBeNull();

    stubFetchJson(listing);

    await act(async () => {
      result.current.retry();
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.results.map((post) => post.id)).toEqual(['post-1']);
  });
});
