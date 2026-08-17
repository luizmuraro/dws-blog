import { useCallback } from 'react';
import { getPosts } from '@/api';
import type { Post } from '@/types/domain';
import { useAsync } from './useAsync';
import type { UseAsyncResult } from './useAsync';

export function usePosts(): UseAsyncResult<Post[]> {
  const fetchPosts = useCallback((signal: AbortSignal) => getPosts(signal), []);

  return useAsync(fetchPosts, []);
}
