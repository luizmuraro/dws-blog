import { useCallback, useMemo, useState } from 'react';
import { SortOrder } from '@/constants/sortOrder';
import { selectFavoriteIds } from '@/store/favoritesSlice';
import { useAppSelector } from '@/store/hooks';
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
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (showFavoritesOnly: boolean) => void;
  favoritesCount: number;
  hasOptions: boolean;
  sortOrder: SortOrder;
  toggleSortOrder: () => void;
  visiblePosts: Post[];
}

export const usePostFilters = (
  posts: Post[] | null,
  searchTerm = '',
  categoryParam = '',
): UsePostFiltersResult => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    categoryParam ? [categoryParam] : [],
  );
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Newest);
  const [lastCategoryParam, setLastCategoryParam] = useState(categoryParam);

  if (lastCategoryParam !== categoryParam) {
    setLastCategoryParam(categoryParam);
    setSelectedCategoryIds(categoryParam ? [categoryParam] : []);
  }

  const favoriteIds = useAppSelector(selectFavoriteIds);

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
      favoriteIds: showFavoritesOnly ? favoriteIds : null,
    });

    return sortPosts(matching, sortOrder);
  }, [
    matchingPosts,
    selectedCategoryIds,
    selectedAuthorIds,
    showFavoritesOnly,
    favoriteIds,
    sortOrder,
  ]);

  return {
    categoryOptions,
    authorOptions,
    selectedCategoryIds,
    selectedAuthorIds,
    setSelectedCategoryIds,
    setSelectedAuthorIds,
    showFavoritesOnly,
    setShowFavoritesOnly,
    favoritesCount: favoriteIds.length,
    hasOptions: categoryOptions.length > 0 || authorOptions.length > 0,
    sortOrder,
    toggleSortOrder,
    visiblePosts,
  };
};
