import type { ApiPost } from '@/types/api';
import type { Post } from '@/types/domain';
import { ApiError, request } from './client';
import { mapApiPostToPost } from './mappers';

export const getPosts = async (signal?: AbortSignal): Promise<Post[]> => {
  const apiPosts = await request<ApiPost[]>('/posts', { signal });
  return apiPosts.map(mapApiPostToPost);
};

export const getPostById = async (id: string, signal?: AbortSignal): Promise<Post | null> => {
  try {
    const apiPost = await request<ApiPost>(`/posts/${id}`, { signal });
    return mapApiPostToPost(apiPost);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;

    throw error;
  }
};
