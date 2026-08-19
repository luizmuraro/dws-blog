import { describe, expect, it, vi } from 'vitest';
import { StorageKey, readStringArray, writeStringArray } from './storage';

describe('readStringArray', () => {
  it('returns an empty list when the key is absent', () => {
    expect(readStringArray(StorageKey.Favorites)).toEqual([]);
  });

  it('returns the stored list of strings', () => {
    window.localStorage.setItem(StorageKey.Favorites, JSON.stringify(['post-1', 'post-2']));

    expect(readStringArray(StorageKey.Favorites)).toEqual(['post-1', 'post-2']);
  });

  it('returns an empty list for malformed JSON', () => {
    window.localStorage.setItem(StorageKey.Favorites, '{not json');

    expect(readStringArray(StorageKey.Favorites)).toEqual([]);
  });

  it('returns an empty list when the stored value is not an array', () => {
    window.localStorage.setItem(StorageKey.RecentSearches, JSON.stringify({ term: 'react' }));

    expect(readStringArray(StorageKey.RecentSearches)).toEqual([]);
  });

  it('returns an empty list when the array holds a non-string item', () => {
    window.localStorage.setItem(StorageKey.RecentSearches, JSON.stringify(['react', 42]));

    expect(readStringArray(StorageKey.RecentSearches)).toEqual([]);
  });

  it('returns an empty list when reading throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('access denied');
    });

    expect(readStringArray(StorageKey.Favorites)).toEqual([]);
  });
});

describe('writeStringArray', () => {
  it('persists a list that readStringArray can read back', () => {
    writeStringArray(StorageKey.RecentSearches, ['react', 'design']);

    expect(readStringArray(StorageKey.RecentSearches)).toEqual(['react', 'design']);
  });

  it('overwrites a previously stored list', () => {
    writeStringArray(StorageKey.Favorites, ['post-1']);
    writeStringArray(StorageKey.Favorites, ['post-2']);

    expect(readStringArray(StorageKey.Favorites)).toEqual(['post-2']);
  });

  it('keeps the two storage keys independent', () => {
    writeStringArray(StorageKey.Favorites, ['post-1']);
    writeStringArray(StorageKey.RecentSearches, ['react']);

    expect(readStringArray(StorageKey.Favorites)).toEqual(['post-1']);
    expect(readStringArray(StorageKey.RecentSearches)).toEqual(['react']);
  });

  it('swallows a quota error instead of throwing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => writeStringArray(StorageKey.Favorites, ['post-1'])).not.toThrow();
  });
});
