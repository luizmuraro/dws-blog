import { SortOrder } from '@/constants/sortOrder';
import type { Post } from '@/types/domain';
import type { FilterOption } from '@/types/ui';
import { getLastName } from '@/utils/text';

export interface PostFilters {
  categoryNames: string[];
  authorIds: string[];
  favoriteIds?: string[] | null;
}

export const getCategoryOptions = (posts: Post[]): FilterOption[] => {
  const names = new Set(posts.flatMap((post) => post.categories.map((category) => category.name)));

  return [...names].sort((a, b) => a.localeCompare(b)).map((name) => ({ id: name, name }));
};

export const getAuthorOptions = (posts: Post[]): FilterOption[] => {
  const namesById = new Map(posts.map((post) => [post.author.id, getLastName(post.author.name)]));

  return [...namesById]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const filterPosts = (
  posts: Post[],
  { categoryNames, authorIds, favoriteIds = null }: PostFilters,
): Post[] =>
  posts.filter((post) => {
    const matchesCategory =
      categoryNames.length === 0 ||
      post.categories.some((category) => categoryNames.includes(category.name));
    const matchesAuthor = authorIds.length === 0 || authorIds.includes(post.author.id);
    const matchesFavorites = favoriteIds === null || favoriteIds.includes(post.id);

    return matchesCategory && matchesAuthor && matchesFavorites;
  });

export const sortPosts = (posts: Post[], order: SortOrder): Post[] =>
  [...posts].sort((a, b) => {
    const newestFirst = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

    return order === SortOrder.Newest ? newestFirst : -newestFirst;
  });
