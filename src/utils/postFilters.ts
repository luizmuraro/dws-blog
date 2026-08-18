import type { Post } from '@/types/domain';
import type { FilterOption } from '@/types/ui';

export interface PostFilters {
  categoryNames: string[];
  authorIds: string[];
}

export const getCategoryOptions = (posts: Post[]): FilterOption[] => {
  const names = new Set(posts.flatMap((post) => post.categories.map((category) => category.name)));

  return [...names].sort((a, b) => a.localeCompare(b)).map((name) => ({ id: name, name }));
};

export const getAuthorOptions = (posts: Post[]): FilterOption[] => {
  const namesById = new Map(posts.map((post) => [post.author.id, post.author.name]));

  return [...namesById]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const filterPosts = (posts: Post[], { categoryNames, authorIds }: PostFilters): Post[] =>
  posts.filter((post) => {
    const matchesCategory =
      categoryNames.length === 0 ||
      post.categories.some((category) => categoryNames.includes(category.name));
    const matchesAuthor = authorIds.length === 0 || authorIds.includes(post.author.id);

    return matchesCategory && matchesAuthor;
  });
