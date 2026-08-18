import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getPosts } from '@/api';
import type { Post } from '@/types/domain';
import { searchPosts } from '@/utils/search';
import { useDebouncedValue } from './useDebouncedValue';

export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

export interface UsePostSearchResult {
  term: string;
  results: Post[];
  isLoading: boolean;
  isPending: boolean;
  hasQuery: boolean;
  error: Error | null;
  retry: () => void;
}

interface State {
  posts: Post[] | null;
  isLoading: boolean;
  error: Error | null;
}

const ListingActionType = {
  Pending: 'PENDING',
  Resolved: 'RESOLVED',
  Rejected: 'REJECTED',
} as const;

type Action =
  | { type: typeof ListingActionType.Pending }
  | { type: typeof ListingActionType.Resolved; payload: Post[] }
  | { type: typeof ListingActionType.Rejected; payload: Error };

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case ListingActionType.Pending:
      return { posts: null, isLoading: true, error: null };
    case ListingActionType.Resolved:
      return { posts: action.payload, isLoading: false, error: null };
    case ListingActionType.Rejected:
      return { posts: null, isLoading: false, error: action.payload };
  }
};

const initialState: State = { posts: null, isLoading: false, error: null };

export const usePostSearch = (rawTerm: string): UsePostSearchResult => {
  const typedTerm = rawTerm.trim();
  const term = useDebouncedValue(typedTerm, SEARCH_DEBOUNCE_MS);
  const hasQuery = typedTerm.length >= MIN_SEARCH_LENGTH;

  const [{ posts, isLoading, error }, dispatch] = useReducer(reducer, initialState);
  const [attempt, setAttempt] = useState(0);
  const hasLoadedRef = useRef(false);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  useEffect(() => {
    if (!hasQuery || hasLoadedRef.current) return;

    const controller = new AbortController();
    dispatch({ type: ListingActionType.Pending });

    getPosts(controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) return;

        hasLoadedRef.current = true;
        dispatch({ type: ListingActionType.Resolved, payload: loaded });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;

        dispatch({
          type: ListingActionType.Rejected,
          payload: cause instanceof Error ? cause : new Error(String(cause)),
        });
      });

    return () => controller.abort();
  }, [hasQuery, attempt]);

  const results = useMemo(
    () => (term.length >= MIN_SEARCH_LENGTH ? searchPosts(posts ?? [], term) : []),
    [posts, term],
  );

  return {
    term,
    results,
    isLoading,
    isPending: typedTerm !== term,
    hasQuery,
    error,
    retry,
  };
};
