import { describe, expect, it } from 'vitest';
import { SortOrder } from '@/constants/sortOrder';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import { filterPosts, getAuthorOptions, getCategoryOptions, sortPosts } from './postFilters';

const frontend = makeCategory({ id: 'category-1', name: 'Frontend' });
const design = makeCategory({ id: 'category-2', name: 'Design' });
const ada = makeAuthor({ id: 'author-1', name: 'Ada Lovelace' });
const alan = makeAuthor({ id: 'author-2', name: 'Alan Turing' });

const firstPost = makePost({
  id: 'post-1',
  publishedAt: '2024-01-10T12:00:00.000Z',
  author: ada,
  categories: [frontend],
});

const secondPost = makePost({
  id: 'post-2',
  publishedAt: '2024-05-20T12:00:00.000Z',
  author: alan,
  categories: [design, frontend],
});

const posts = [firstPost, secondPost];

describe('getCategoryOptions', () => {
  it('collects unique category names sorted alphabetically', () => {
    expect(getCategoryOptions(posts)).toEqual([
      { id: 'Design', name: 'Design' },
      { id: 'Frontend', name: 'Frontend' },
    ]);
  });

  it('uses the name as the option id', () => {
    const [option] = getCategoryOptions([firstPost]);

    expect(option.id).toBe(option.name);
  });

  it('deduplicates categories that repeat across posts under different ids', () => {
    const duplicated = makePost({
      id: 'post-3',
      categories: [makeCategory({ id: 'category-9', name: 'Frontend' })],
    });

    expect(getCategoryOptions([firstPost, duplicated])).toEqual([
      { id: 'Frontend', name: 'Frontend' },
    ]);
  });

  it('returns an empty list for no posts', () => {
    expect(getCategoryOptions([])).toEqual([]);
  });
});

describe('getAuthorOptions', () => {
  it('collects authors by last name sorted alphabetically', () => {
    expect(getAuthorOptions(posts)).toEqual([
      { id: 'author-1', name: 'Lovelace' },
      { id: 'author-2', name: 'Turing' },
    ]);
  });

  it('deduplicates authors by id', () => {
    const anotherAdaPost = makePost({ id: 'post-3', author: ada });

    expect(getAuthorOptions([firstPost, anotherAdaPost])).toEqual([
      { id: 'author-1', name: 'Lovelace' },
    ]);
  });

  it('returns an empty list for no posts', () => {
    expect(getAuthorOptions([])).toEqual([]);
  });
});

describe('filterPosts', () => {
  it('returns every post when no constraint is set', () => {
    expect(filterPosts(posts, { categoryNames: [], authorIds: [] })).toEqual(posts);
  });

  it('keeps posts that have at least one of the selected categories', () => {
    expect(filterPosts(posts, { categoryNames: ['Design'], authorIds: [] })).toEqual([secondPost]);
  });

  it('treats multiple categories as a union', () => {
    expect(filterPosts(posts, { categoryNames: ['Design', 'Frontend'], authorIds: [] })).toEqual(
      posts,
    );
  });

  it('keeps posts written by one of the selected authors', () => {
    expect(filterPosts(posts, { categoryNames: [], authorIds: ['author-1'] })).toEqual([firstPost]);
  });

  it('combines category and author as an intersection', () => {
    expect(filterPosts(posts, { categoryNames: ['Frontend'], authorIds: ['author-2'] })).toEqual([
      secondPost,
    ]);

    expect(filterPosts(posts, { categoryNames: ['Design'], authorIds: ['author-1'] })).toEqual([]);
  });

  it('ignores the favorites constraint when favoriteIds is omitted or null', () => {
    expect(filterPosts(posts, { categoryNames: [], authorIds: [] })).toEqual(posts);
    expect(filterPosts(posts, { categoryNames: [], authorIds: [], favoriteIds: null })).toEqual(
      posts,
    );
  });

  it('keeps only favorites when favoriteIds is a list', () => {
    expect(
      filterPosts(posts, { categoryNames: [], authorIds: [], favoriteIds: ['post-2'] }),
    ).toEqual([secondPost]);
  });

  it('hides every post when favoriteIds is an empty list', () => {
    expect(filterPosts(posts, { categoryNames: [], authorIds: [], favoriteIds: [] })).toEqual([]);
  });

  it('does not mutate the original list', () => {
    const original = [...posts];

    filterPosts(posts, { categoryNames: ['Design'], authorIds: [] });

    expect(posts).toEqual(original);
  });
});

describe('sortPosts', () => {
  it('puts the most recent post first for the newest order', () => {
    expect(sortPosts(posts, SortOrder.Newest).map((post) => post.id)).toEqual(['post-2', 'post-1']);
  });

  it('puts the oldest post first for the oldest order', () => {
    expect(sortPosts(posts, SortOrder.Oldest).map((post) => post.id)).toEqual(['post-1', 'post-2']);
  });

  it('does not mutate the original list', () => {
    const items = [firstPost, secondPost];

    sortPosts(items, SortOrder.Newest);

    expect(items.map((post) => post.id)).toEqual(['post-1', 'post-2']);
  });

  it('handles an empty list', () => {
    expect(sortPosts([], SortOrder.Newest)).toEqual([]);
  });
});
