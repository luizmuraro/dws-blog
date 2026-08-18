import { useMemo, useState } from 'react';
import type { Post } from '@/types/domain';
import type { FilterOption } from '@/types/ui';
import { filterPosts, getAuthorOptions, getCategoryOptions } from '@/utils/postFilters';

export interface UsePostFiltersResult {
  categoryOptions: FilterOption[];
  authorOptions: FilterOption[];
  selectedCategoryIds: string[];
  selectedAuthorIds: string[];
  setSelectedCategoryIds: (selectedIds: string[]) => void;
  setSelectedAuthorIds: (selectedIds: string[]) => void;
  filteredPosts: Post[];
}

export const usePostFilters = (posts: Post[] | null): UsePostFiltersResult => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);

  const loadedPosts = useMemo(() => posts ?? [], [posts]);
  const categoryOptions = useMemo(() => getCategoryOptions(loadedPosts), [loadedPosts]);
  const authorOptions = useMemo(() => getAuthorOptions(loadedPosts), [loadedPosts]);

  const filteredPosts = useMemo(
    () =>
      filterPosts(loadedPosts, {
        categoryNames: selectedCategoryIds,
        authorIds: selectedAuthorIds,
      }),
    [loadedPosts, selectedCategoryIds, selectedAuthorIds],
  );

  return {
    categoryOptions,
    authorOptions,
    selectedCategoryIds,
    selectedAuthorIds,
    setSelectedCategoryIds,
    setSelectedAuthorIds,
    filteredPosts,
  };
};
