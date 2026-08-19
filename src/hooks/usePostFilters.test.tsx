import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { SortOrder } from '@/constants/sortOrder';
import { createAppStore } from '@/store';
import { makeTestState } from '@/test/renderWithProviders';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import type { Post } from '@/types/domain';
import { usePostFilters } from './usePostFilters';

const frontend = makeCategory({ id: 'category-1', name: 'Frontend' });
const design = makeCategory({ id: 'category-2', name: 'Design' });
const ada = makeAuthor({ id: 'author-1', name: 'Ada Lovelace' });
const alan = makeAuthor({ id: 'author-2', name: 'Alan Turing' });

const oldPost = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  publishedAt: '2024-01-10T12:00:00.000Z',
  author: ada,
  categories: [frontend],
});

const newPost = makePost({
  id: 'post-2',
  title: 'Design systems at scale',
  publishedAt: '2024-05-20T12:00:00.000Z',
  author: alan,
  categories: [design],
});

const posts = [oldPost, newPost];

const renderFilters = (
  { favoriteIds = [] }: { favoriteIds?: string[] } = {},
  initialProps: { posts: Post[] | null; searchTerm?: string; categoryParam?: string } = { posts },
) => {
  const store = createAppStore(makeTestState({ favorites: { ids: favoriteIds } }));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(
    ({ posts: given, searchTerm, categoryParam }) =>
      usePostFilters(given, searchTerm, categoryParam),
    { initialProps, wrapper },
  );
};

const visibleIds = (result: { current: { visiblePosts: Post[] } }) =>
  result.current.visiblePosts.map((post) => post.id);

describe('usePostFilters options', () => {
  it('derives the category and author options from the loaded posts', () => {
    const { result } = renderFilters();

    expect(result.current.categoryOptions).toEqual([
      { id: 'Design', name: 'Design' },
      { id: 'Frontend', name: 'Frontend' },
    ]);
    expect(result.current.authorOptions).toEqual([
      { id: 'author-1', name: 'Lovelace' },
      { id: 'author-2', name: 'Turing' },
    ]);
  });

  it('narrows the options to what the search term matches', () => {
    const { result } = renderFilters({}, { posts, searchTerm: 'React' });

    expect(result.current.categoryOptions).toEqual([{ id: 'Frontend', name: 'Frontend' }]);
    expect(result.current.authorOptions).toEqual([{ id: 'author-1', name: 'Lovelace' }]);
  });

  it('tolerates a null listing', () => {
    const { result } = renderFilters({}, { posts: null });

    expect(result.current.visiblePosts).toEqual([]);
    expect(result.current.hasOptions).toBe(false);
  });

  it('reports hasOptions only when there is something to filter by', () => {
    expect(renderFilters({}, { posts: [] }).result.current.hasOptions).toBe(false);
    expect(renderFilters().result.current.hasOptions).toBe(true);
  });
});

describe('usePostFilters selection', () => {
  it('starts with nothing selected', () => {
    const { result } = renderFilters();

    expect(result.current.selectedCategoryIds).toEqual([]);
    expect(result.current.selectedAuthorIds).toEqual([]);
    expect(visibleIds(result)).toEqual(['post-2', 'post-1']);
  });

  it('filters by the selected categories', () => {
    const { result } = renderFilters();

    act(() => result.current.setSelectedCategoryIds(['Design']));

    expect(visibleIds(result)).toEqual(['post-2']);
  });

  it('filters by the selected authors', () => {
    const { result } = renderFilters();

    act(() => result.current.setSelectedAuthorIds(['author-1']));

    expect(visibleIds(result)).toEqual(['post-1']);
  });

  it('combines the search term with the selected filters', () => {
    const { result } = renderFilters({}, { posts, searchTerm: 'Design' });

    act(() => result.current.setSelectedAuthorIds(['author-1']));

    expect(visibleIds(result)).toEqual([]);
  });

  it('seeds the selected categories from the category param', () => {
    const { result } = renderFilters({}, { posts, categoryParam: 'Design' });

    expect(result.current.selectedCategoryIds).toEqual(['Design']);
    expect(visibleIds(result)).toEqual(['post-2']);
  });

  it('reseeds the selection when the category param changes', () => {
    const { result, rerender } = renderFilters({}, { posts, categoryParam: 'Design' });

    rerender({ posts, categoryParam: 'Frontend' });

    expect(result.current.selectedCategoryIds).toEqual(['Frontend']);
    expect(visibleIds(result)).toEqual(['post-1']);
  });

  it('clears the selection when the category param is dropped', () => {
    const { result, rerender } = renderFilters({}, { posts, categoryParam: 'Design' });

    rerender({ posts, categoryParam: '' });

    expect(result.current.selectedCategoryIds).toEqual([]);
  });

  it('keeps a manual selection while the category param is unchanged', () => {
    const { result, rerender } = renderFilters({}, { posts, categoryParam: 'Design' });

    act(() => result.current.setSelectedCategoryIds(['Frontend']));
    rerender({ posts, categoryParam: 'Design' });

    expect(result.current.selectedCategoryIds).toEqual(['Frontend']);
  });
});

describe('usePostFilters favorites', () => {
  it('reports the favorites count from the store', () => {
    const { result } = renderFilters({ favoriteIds: ['post-1', 'post-2'] });

    expect(result.current.favoritesCount).toBe(2);
  });

  it('ignores the favorites while the toggle is off', () => {
    const { result } = renderFilters({ favoriteIds: ['post-1'] });

    expect(visibleIds(result)).toEqual(['post-2', 'post-1']);
  });

  it('keeps only the favorited posts while the toggle is on', () => {
    const { result } = renderFilters({ favoriteIds: ['post-1'] });

    act(() => result.current.setShowFavoritesOnly(true));

    expect(result.current.showFavoritesOnly).toBe(true);
    expect(visibleIds(result)).toEqual(['post-1']);
  });

  it('shows nothing when the toggle is on and there are no favorites', () => {
    const { result } = renderFilters();

    act(() => result.current.setShowFavoritesOnly(true));

    expect(visibleIds(result)).toEqual([]);
  });
});

describe('usePostFilters sorting', () => {
  it('sorts newest first by default', () => {
    const { result } = renderFilters();

    expect(result.current.sortOrder).toBe(SortOrder.Newest);
    expect(visibleIds(result)).toEqual(['post-2', 'post-1']);
  });

  it('flips the order on toggle and back again', () => {
    const { result } = renderFilters();

    act(() => result.current.toggleSortOrder());
    expect(result.current.sortOrder).toBe(SortOrder.Oldest);
    expect(visibleIds(result)).toEqual(['post-1', 'post-2']);

    act(() => result.current.toggleSortOrder());
    expect(result.current.sortOrder).toBe(SortOrder.Newest);
    expect(visibleIds(result)).toEqual(['post-2', 'post-1']);
  });
});
