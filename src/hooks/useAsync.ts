import { useCallback, useEffect, useReducer, useState } from 'react';
import type { DependencyList } from 'react';

export interface UseAsyncResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

interface State<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type Action<T> =
  { type: 'PENDING' } | { type: 'RESOLVED'; payload: T } | { type: 'REJECTED'; payload: Error };

// Every action returns a full state, so the previous one is never needed.
const reducer = <T>(_state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'PENDING':
      return { data: null, isLoading: true, error: null };
    case 'RESOLVED':
      return { data: action.payload, isLoading: false, error: null };
    case 'REJECTED':
      return { data: null, isLoading: false, error: action.payload };
  }
};

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

/**
 * Runs an async call tied to the component lifecycle.
 *
 * `fn` must be memoized by the caller (useCallback): it is part of the effect
 * deps, so a function recreated on every render would loop forever.
 */
export const useAsync = <T>(
  fn: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): UseAsyncResult<T> => {
  const initialState: State<T> = { data: null, isLoading: true, error: null };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'PENDING' });

    fn(controller.signal)
      .then((data) => {
        // An aborted call is a cancellation, not a failure: drop the result.
        if (controller.signal.aborted) return;
        dispatch({ type: 'RESOLVED', payload: data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({ type: 'REJECTED', payload: toError(error) });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, retryCount, ...deps]);

  return { ...state, retry };
};
