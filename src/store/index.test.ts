import { describe, expect, it, vi } from 'vitest';
import { StorageKey } from '@/utils/storage';
import { createAppStore } from './index';
import { toggleFavorite } from './favoritesSlice';
import { addRecentSearch, clearRecentSearches, removeRecentSearch } from './searchSlice';

const seed = (key: StorageKey, values: string[]) => {
  window.localStorage.setItem(key, JSON.stringify(values));
};

const readRaw = (key: StorageKey) => window.localStorage.getItem(key);

describe('createAppStore hydration', () => {
  it('starts empty when nothing is persisted', () => {
    expect(createAppStore().getState()).toEqual({
      favorites: { ids: [] },
      search: { recentTerms: [] },
    });
  });

  it('hydrates both slices from localStorage', () => {
    seed(StorageKey.Favorites, ['post-1', 'post-2']);
    seed(StorageKey.RecentSearches, ['react']);

    expect(createAppStore().getState()).toEqual({
      favorites: { ids: ['post-1', 'post-2'] },
      search: { recentTerms: ['react'] },
    });
  });

  it('falls back to empty slices when the persisted value is corrupt', () => {
    window.localStorage.setItem(StorageKey.Favorites, '{not json');

    expect(createAppStore().getState().favorites.ids).toEqual([]);
  });

  it('accepts an explicit preloaded state instead of reading storage', () => {
    seed(StorageKey.Favorites, ['post-1']);

    const store = createAppStore({ favorites: { ids: [] }, search: { recentTerms: [] } });

    expect(store.getState().favorites.ids).toEqual([]);
  });

  it('gives each store its own state', () => {
    const first = createAppStore();
    const second = createAppStore();

    first.dispatch(toggleFavorite('post-1'));

    expect(second.getState().favorites.ids).toEqual([]);
  });
});

describe('persistence middleware', () => {
  it('writes the favorites after toggling one', () => {
    const store = createAppStore();

    store.dispatch(toggleFavorite('post-1'));

    expect(readRaw(StorageKey.Favorites)).toBe(JSON.stringify(['post-1']));
  });

  it('writes the favorites after removing the last one', () => {
    seed(StorageKey.Favorites, ['post-1']);
    const store = createAppStore();

    store.dispatch(toggleFavorite('post-1'));

    expect(readRaw(StorageKey.Favorites)).toBe(JSON.stringify([]));
  });

  it('writes the recent searches on add, remove and clear', () => {
    const store = createAppStore();

    store.dispatch(addRecentSearch('react'));
    expect(readRaw(StorageKey.RecentSearches)).toBe(JSON.stringify(['react']));

    store.dispatch(addRecentSearch('design'));
    expect(readRaw(StorageKey.RecentSearches)).toBe(JSON.stringify(['design', 'react']));

    store.dispatch(removeRecentSearch('react'));
    expect(readRaw(StorageKey.RecentSearches)).toBe(JSON.stringify(['design']));

    store.dispatch(clearRecentSearches());
    expect(readRaw(StorageKey.RecentSearches)).toBe(JSON.stringify([]));
  });

  it('keeps the two keys independent', () => {
    const store = createAppStore();

    store.dispatch(toggleFavorite('post-1'));

    expect(readRaw(StorageKey.RecentSearches)).toBeNull();
  });

  it('does not write for an unrelated action', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const store = createAppStore();

    store.dispatch({ type: 'unrelated/action' });

    expect(setItem).not.toHaveBeenCalled();
  });

  it('keeps the state usable when persisting throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    const store = createAppStore();

    expect(() => store.dispatch(toggleFavorite('post-1'))).not.toThrow();
    expect(store.getState().favorites.ids).toEqual(['post-1']);
  });
});
