import type { ApiAuthor } from '@/types/api';
import type { Author } from '@/types/domain';
import { request } from './client';
import { mapApiAuthorToAuthor } from './mappers';

export const getAuthors = async (signal?: AbortSignal): Promise<Author[]> => {
  const apiAuthors = await request<ApiAuthor[]>('/authors', { signal });
  return apiAuthors.map(mapApiAuthorToAuthor);
};

export const getAuthorById = async (id: string, signal?: AbortSignal): Promise<Author> => {
  const apiAuthor = await request<ApiAuthor>(`/authors/${id}`, { signal });
  return mapApiAuthorToAuthor(apiAuthor);
};
