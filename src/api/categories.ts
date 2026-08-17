import type { ApiCategory } from '@/types/api';
import type { Category } from '@/types/domain';
import { request } from './client';
import { mapApiCategoryToCategory } from './mappers';

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const apiCategories = await request<ApiCategory[]>('/categories', { signal });

  // The API returns one row per post, so names repeat and ids are not stable across posts.
  const byName = new Map<string, Category>();
  for (const apiCategory of apiCategories) {
    if (!byName.has(apiCategory.name)) {
      byName.set(apiCategory.name, mapApiCategoryToCategory(apiCategory));
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}
