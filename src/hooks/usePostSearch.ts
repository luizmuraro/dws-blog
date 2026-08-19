import { useCallback, useMemo } from 'react';
import { getPosts } from '@/api';
import type { Post } from '@/types/domain';
import { searchPosts } from '@/utils/search';
import { useAsync } from './useAsync';
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

export const usePostSearch = (rawTerm: string): UsePostSearchResult => {
  const typedTerm = rawTerm.trim();
  const term = useDebouncedValue(typedTerm, SEARCH_DEBOUNCE_MS);
  const hasQuery = typedTerm.length >= MIN_SEARCH_LENGTH;

  const fetchPosts = useCallback(
    () => (hasQuery ? getPosts() : Promise.resolve<Post[]>([])),
    [hasQuery],
  );

  const { data: posts, isLoading, error, retry } = useAsync(fetchPosts);

  const results = useMemo(
    () => (term.length >= MIN_SEARCH_LENGTH ? searchPosts(posts ?? [], term) : []),
    [posts, term],
  );

  return {
    term,
    results,
    isLoading: hasQuery && isLoading,
    isPending: typedTerm !== term,
    hasQuery,
    error,
    retry,
  };
};
