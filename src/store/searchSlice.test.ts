import { describe, expect, it } from 'vitest';
import reducer, {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  selectRecentSearches,
  type SearchState,
} from './searchSlice';

const stateWith = (recentTerms: string[]): SearchState => ({ recentTerms });

describe('search reducer', () => {
  it('starts with no recent searches', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ recentTerms: [] });
  });

  it('adds a term to the front of the list', () => {
    expect(reducer(stateWith(['design']), addRecentSearch('react'))).toEqual({
      recentTerms: ['react', 'design'],
    });
  });

  it('trims the term before storing it', () => {
    expect(reducer(stateWith([]), addRecentSearch('  react  '))).toEqual({
      recentTerms: ['react'],
    });
  });

  it('ignores an empty or whitespace-only term', () => {
    expect(reducer(stateWith(['react']), addRecentSearch(''))).toEqual({ recentTerms: ['react'] });
    expect(reducer(stateWith(['react']), addRecentSearch('   '))).toEqual({
      recentTerms: ['react'],
    });
  });

  it('moves a repeated term back to the front instead of duplicating it', () => {
    expect(reducer(stateWith(['design', 'react']), addRecentSearch('react'))).toEqual({
      recentTerms: ['react', 'design'],
    });
  });

  it('treats a repeated term case-insensitively and keeps the newest casing', () => {
    expect(reducer(stateWith(['react']), addRecentSearch('React'))).toEqual({
      recentTerms: ['React'],
    });
  });

  it('keeps at most five recent searches', () => {
    const full = stateWith(['five', 'four', 'three', 'two', 'one']);

    expect(reducer(full, addRecentSearch('six'))).toEqual({
      recentTerms: ['six', 'five', 'four', 'three', 'two'],
    });
  });

  it('does not mutate the previous state', () => {
    const previous = stateWith(['react']);

    reducer(previous, addRecentSearch('design'));

    expect(previous.recentTerms).toEqual(['react']);
  });

  it('removes a term regardless of casing', () => {
    expect(reducer(stateWith(['React', 'design']), removeRecentSearch('react'))).toEqual({
      recentTerms: ['design'],
    });
  });

  it('leaves the list untouched when the term is not stored', () => {
    expect(reducer(stateWith(['react']), removeRecentSearch('vue'))).toEqual({
      recentTerms: ['react'],
    });
  });

  it('clears every recent search', () => {
    expect(reducer(stateWith(['react', 'design']), clearRecentSearches())).toEqual({
      recentTerms: [],
    });
  });
});

describe('search selectors', () => {
  it('selectRecentSearches returns the stored terms', () => {
    expect(selectRecentSearches({ search: stateWith(['react']) })).toEqual(['react']);
  });
});
