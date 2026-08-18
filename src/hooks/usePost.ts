import { useCallback } from 'react';
import { getPostById } from '@/api';
import type { Post } from '@/types/domain';
import { useAsync } from './useAsync';
import type { UseAsyncResult } from './useAsync';

export const usePost = (id: string): UseAsyncResult<Post> => {
  const fetchPost = useCallback((signal: AbortSignal) => getPostById(id, signal), [id]);

  return useAsync(fetchPost, [id]);
};
