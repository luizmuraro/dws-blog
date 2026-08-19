import { describe, expect, it } from 'vitest';
import reducer, {
  selectFavoriteIds,
  selectIsFavorite,
  toggleFavorite,
  type FavoritesState,
} from './favoritesSlice';

const stateWith = (ids: string[]): FavoritesState => ({ ids });

describe('favorites reducer', () => {
  it('starts with no favorites', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ ids: [] });
  });

  it('adds a post that is not favorited yet', () => {
    expect(reducer(stateWith([]), toggleFavorite('post-1'))).toEqual({ ids: ['post-1'] });
  });

  it('appends to the existing favorites', () => {
    expect(reducer(stateWith(['post-1']), toggleFavorite('post-2'))).toEqual({
      ids: ['post-1', 'post-2'],
    });
  });

  it('removes a post that is already favorited', () => {
    expect(reducer(stateWith(['post-1', 'post-2']), toggleFavorite('post-1'))).toEqual({
      ids: ['post-2'],
    });
  });

  it('returns to the previous state when toggled twice', () => {
    const afterFirst = reducer(stateWith(['post-1']), toggleFavorite('post-2'));

    expect(reducer(afterFirst, toggleFavorite('post-2'))).toEqual({ ids: ['post-1'] });
  });

  it('does not mutate the previous state', () => {
    const previous = stateWith(['post-1']);

    reducer(previous, toggleFavorite('post-2'));

    expect(previous.ids).toEqual(['post-1']);
  });

  it('ignores unknown actions', () => {
    const previous = stateWith(['post-1']);

    expect(reducer(previous, { type: 'search/addRecentSearch' })).toBe(previous);
  });
});

describe('favorites selectors', () => {
  it('selectFavoriteIds returns the stored ids', () => {
    expect(selectFavoriteIds({ favorites: stateWith(['post-1']) })).toEqual(['post-1']);
  });

  it('selectIsFavorite answers for the given post', () => {
    const state = { favorites: stateWith(['post-1']) };

    expect(selectIsFavorite('post-1')(state)).toBe(true);
    expect(selectIsFavorite('post-2')(state)).toBe(false);
  });
});
