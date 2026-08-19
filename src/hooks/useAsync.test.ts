import { describe, expect, it, vi } from 'vitest';
import { useCallback } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

const resolveDone = () => Promise.resolve('done');

describe('useAsync', () => {
  it('starts in the loading state', () => {
    const { result } = renderHook(() => useAsync(resolveDone));

    expect(result.current).toMatchObject({ data: null, isLoading: true, error: null });
  });

  it('exposes the resolved value', async () => {
    const { result } = renderHook(() => useAsync(resolveDone));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toMatchObject({ data: 'done', error: null });
  });

  it('exposes a rejection as an error', async () => {
    const failure = new Error('boom');
    const reject = () => Promise.reject(failure);
    const { result } = renderHook(() => useAsync(reject));

    await waitFor(() => expect(result.current.error).toBe(failure));
    expect(result.current).toMatchObject({ data: null, isLoading: false });
  });

  it('wraps a non-Error rejection', async () => {
    const reject = () => Promise.reject('offline');
    const { result } = renderHook(() => useAsync(reject));

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
    expect(result.current.error?.message).toBe('offline');
  });

  it('passes an abort signal to the callback', async () => {
    const fn = vi.fn((signal: AbortSignal) => Promise.resolve(signal.aborted));
    renderHook(() => useAsync(fn));

    await waitFor(() => expect(fn).toHaveBeenCalledOnce());
    expect(fn.mock.calls[0][0]).toBeInstanceOf(AbortSignal);
  });

  it('aborts the in-flight call on unmount', () => {
    const fn = vi.fn<(signal: AbortSignal) => Promise<string>>(() => new Promise(() => {}));
    const { unmount } = renderHook(() => useAsync(fn));
    const signal = fn.mock.calls[0][0];

    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it('drops a result that resolves after the call was aborted', async () => {
    let resolveLate: (value: string) => void = () => {};
    const fn = vi.fn<(signal: AbortSignal) => Promise<string>>(
      () =>
        new Promise((resolve) => {
          resolveLate = resolve;
        }),
    );

    const { result, unmount } = renderHook(() => useAsync(fn));
    unmount();

    await act(async () => {
      resolveLate('late');
    });

    expect(result.current.data).toBeNull();
  });

  it('re-runs the call when retry is invoked', async () => {
    const fn = vi.fn<(signal: AbortSignal) => Promise<string>>(() => Promise.resolve('done'));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.retry());

    // Both assertions share one waitFor: the call lands a tick before the result does.
    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(2);
      expect(result.current.data).toBe('done');
    });
  });

  it('recovers from an error when the retry succeeds', async () => {
    const fn = vi
      .fn<(signal: AbortSignal) => Promise<string>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce('done');

    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.data).toBe('done'));
    expect(result.current.error).toBeNull();
  });

  it('re-runs the call when a dependency changes', async () => {
    const { result, rerender } = renderHook(
      ({ id }) => {
        const fetchById = useCallback(() => Promise.resolve(id), [id]);

        return useAsync(fetchById);
      },
      { initialProps: { id: 'a' } },
    );

    await waitFor(() => expect(result.current.data).toBe('a'));

    rerender({ id: 'b' });

    await waitFor(() => expect(result.current.data).toBe('b'));
  });

  it('keeps a stable retry reference across renders', () => {
    const { result, rerender } = renderHook(() => useAsync(resolveDone));
    const firstRetry = result.current.retry;

    rerender();

    expect(result.current.retry).toBe(firstRetry);
  });
});
