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

const AsyncActionType = {
  Pending: 'PENDING',
  Resolved: 'RESOLVED',
  Rejected: 'REJECTED',
} as const;

type Action<T> =
  | { type: typeof AsyncActionType.Pending }
  | { type: typeof AsyncActionType.Resolved; payload: T }
  | { type: typeof AsyncActionType.Rejected; payload: Error };

const reducer = <T>(_state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case AsyncActionType.Pending:
      return { data: null, isLoading: true, error: null };
    case AsyncActionType.Resolved:
      return { data: action.payload, isLoading: false, error: null };
    case AsyncActionType.Rejected:
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
    dispatch({ type: AsyncActionType.Pending });

    fn(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        dispatch({ type: AsyncActionType.Resolved, payload: data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({ type: AsyncActionType.Rejected, payload: toError(error) });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, retryCount, ...deps]);

  return { ...state, retry };
};
