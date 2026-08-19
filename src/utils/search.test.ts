import { describe, expect, it } from 'vitest';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import { formatResultCount, searchPosts, splitByMatches } from './search';

const reactPost = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  author: makeAuthor({ id: 'author-1', name: 'Ada Lovelace' }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

const designPost = makePost({
  id: 'post-2',
  title: 'Design systems at scale',
  author: makeAuthor({ id: 'author-2', name: 'José Antônio' }),
  categories: [makeCategory({ id: 'category-2', name: 'Design' })],
});

const posts = [reactPost, designPost];

describe('searchPosts', () => {
  it('returns every post when the term is empty', () => {
    expect(searchPosts(posts, '')).toEqual(posts);
  });

  it('returns every post when the term is only whitespace', () => {
    expect(searchPosts(posts, '   ')).toEqual(posts);
  });

  it('matches by title', () => {
    expect(searchPosts(posts, 'hooks')).toEqual([reactPost]);
  });

  it('matches by author name', () => {
    expect(searchPosts(posts, 'Lovelace')).toEqual([reactPost]);
  });

  it('matches by category name', () => {
    expect(searchPosts(posts, 'Design')).toEqual([designPost]);
  });

  it('ignores case', () => {
    expect(searchPosts(posts, 'REACT')).toEqual([reactPost]);
  });

  it('ignores diacritics on both sides of the comparison', () => {
    expect(searchPosts(posts, 'jose antonio')).toEqual([designPost]);
    expect(searchPosts(posts, 'Antônio')).toEqual([designPost]);
  });

  it('trims the term before matching', () => {
    expect(searchPosts(posts, '  hooks  ')).toEqual([reactPost]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(searchPosts(posts, 'kubernetes')).toEqual([]);
  });
});

describe('splitByMatches', () => {
  it('returns a single unmatched segment when the term is empty', () => {
    expect(splitByMatches('React hooks', '')).toEqual([{ text: 'React hooks', isMatch: false }]);
  });

  it('returns a single unmatched segment when nothing matches', () => {
    expect(splitByMatches('React hooks', 'vue')).toEqual([{ text: 'React hooks', isMatch: false }]);
  });

  it('marks a match in the middle of the text', () => {
    expect(splitByMatches('React hooks rule', 'hooks')).toEqual([
      { text: 'React ', isMatch: false },
      { text: 'hooks', isMatch: true },
      { text: ' rule', isMatch: false },
    ]);
  });

  it('marks a match at the start without an empty leading segment', () => {
    expect(splitByMatches('React hooks', 'React')).toEqual([
      { text: 'React', isMatch: true },
      { text: ' hooks', isMatch: false },
    ]);
  });

  it('marks a match at the end without an empty trailing segment', () => {
    expect(splitByMatches('React hooks', 'hooks')).toEqual([
      { text: 'React ', isMatch: false },
      { text: 'hooks', isMatch: true },
    ]);
  });

  it('marks every occurrence', () => {
    expect(splitByMatches('hook, hook, hook', 'hook')).toEqual([
      { text: 'hook', isMatch: true },
      { text: ', ', isMatch: false },
      { text: 'hook', isMatch: true },
      { text: ', ', isMatch: false },
      { text: 'hook', isMatch: true },
    ]);
  });

  it('matches case-insensitively while preserving the original casing', () => {
    expect(splitByMatches('React hooks', 'REACT')).toEqual([
      { text: 'React', isMatch: true },
      { text: ' hooks', isMatch: false },
    ]);
  });

  it('folds diacritics the same way searchPosts does', () => {
    expect(splitByMatches('José', 'jose')).toEqual([{ text: 'José', isMatch: true }]);
    expect(splitByMatches('José', 'josé')).toEqual([{ text: 'José', isMatch: true }]);
  });

  it('slices the original text back out after an accent shortened the match', () => {
    expect(splitByMatches('Olá José da Silva', 'jose')).toEqual([
      { text: 'Olá ', isMatch: false },
      { text: 'José', isMatch: true },
      { text: ' da Silva', isMatch: false },
    ]);
  });

  it('marks every accented occurrence', () => {
    expect(splitByMatches('São, são', 'sao')).toEqual([
      { text: 'São', isMatch: true },
      { text: ', ', isMatch: false },
      { text: 'são', isMatch: true },
    ]);
  });
});

describe('formatResultCount', () => {
  it('pluralizes zero', () => {
    expect(formatResultCount(0)).toBe('0 results');
  });

  it('uses the singular for one', () => {
    expect(formatResultCount(1)).toBe('1 result');
  });

  it('pluralizes anything above one', () => {
    expect(formatResultCount(12)).toBe('12 results');
  });
});
