import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('returns the initial value right away', () => {
    const { result } = renderHook(() => useDebouncedValue('react', 300));

    expect(result.current).toBe('react');
  });

  it('keeps the previous value until the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'react' },
    });

    rerender({ value: 'design' });
    expect(result.current).toBe('react');

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('react');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('design');
  });

  it('emits only the last value when it changes repeatedly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 're' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'rea' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'react' });

    expect(result.current).toBe('r');

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('react');
  });

  it('restarts the timer when the delay changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'react', delay: 300 },
    });

    rerender({ value: 'design', delay: 1000 });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('react');

    act(() => vi.advanceTimersByTime(700));
    expect(result.current).toBe('design');
  });

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    act(() => vi.advanceTimersByTime(100));

    expect(result.current).toBe(2);
  });

  it('clears the pending timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() => useDebouncedValue('react', 300));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
