import type { ApiPost } from '@/types/api';
import type { Post } from '@/types/domain';
import { ApiError, request } from './client';
import { mapApiPostToPost } from './mappers';

let postsPromise: Promise<Post[]> | null = null;

const fetchPosts = async (): Promise<Post[]> => {
  const apiPosts = await request<ApiPost[]>('/posts');

  return apiPosts.map(mapApiPostToPost);
};

export const getPosts = async (): Promise<Post[]> => {
  postsPromise ??= fetchPosts();

  try {
    return await postsPromise;
  } catch (error) {
    // A rejection must not stick, or retrying would replay the same failure.
    postsPromise = null;
    throw error;
  }
};

export const clearPostsCache = (): void => {
  postsPromise = null;
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
