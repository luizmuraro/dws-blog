import { useCallback, useMemo, useState } from 'react';
import { SortOrder } from '@/constants/sortOrder';
import type { Post } from '@/types/domain';
import type { FilterOption } from '@/types/ui';
import { filterPosts, getAuthorOptions, getCategoryOptions, sortPosts } from '@/utils/postFilters';
import { searchPosts } from '@/utils/search';

export interface UsePostFiltersResult {
  categoryOptions: FilterOption[];
  authorOptions: FilterOption[];
  selectedCategoryIds: string[];
  selectedAuthorIds: string[];
  setSelectedCategoryIds: (selectedIds: string[]) => void;
  setSelectedAuthorIds: (selectedIds: string[]) => void;
  hasOptions: boolean;
  sortOrder: SortOrder;
  toggleSortOrder: () => void;
  visiblePosts: Post[];
}

export const usePostFilters = (posts: Post[] | null, searchTerm = ''): UsePostFiltersResult => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Newest);

  const loadedPosts = useMemo(() => posts ?? [], [posts]);

  const matchingPosts = useMemo(
    () => searchPosts(loadedPosts, searchTerm),
    [loadedPosts, searchTerm],
  );

  const categoryOptions = useMemo(() => getCategoryOptions(matchingPosts), [matchingPosts]);
  const authorOptions = useMemo(() => getAuthorOptions(matchingPosts), [matchingPosts]);

  const toggleSortOrder = useCallback(
    () =>
      setSortOrder((order) => (order === SortOrder.Newest ? SortOrder.Oldest : SortOrder.Newest)),
    [],
  );

  const visiblePosts = useMemo(() => {
    const matching = filterPosts(matchingPosts, {
      categoryNames: selectedCategoryIds,
      authorIds: selectedAuthorIds,
    });

    return sortPosts(matching, sortOrder);
  }, [matchingPosts, selectedCategoryIds, selectedAuthorIds, sortOrder]);

  return {
    categoryOptions,
    authorOptions,
    selectedCategoryIds,
    selectedAuthorIds,
    setSelectedCategoryIds,
    setSelectedAuthorIds,
    hasOptions: categoryOptions.length > 0 || authorOptions.length > 0,
    sortOrder,
    toggleSortOrder,
    visiblePosts,
  };
};
