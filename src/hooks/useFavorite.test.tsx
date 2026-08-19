import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore } from '@/store';
import { makeTestState } from '@/test/renderWithProviders';
import { useFavorite } from './useFavorite';

const renderFavorite = (postId: string, favoriteIds: string[] = []) => {
  const store = createAppStore(makeTestState({ favorites: { ids: favoriteIds } }));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...renderHook(() => useFavorite(postId), { wrapper }) };
};

describe('useFavorite', () => {
  it('reports a post that is not favorited', () => {
    const { result } = renderFavorite('post-1');

    expect(result.current.isFavorite).toBe(false);
  });

  it('reports a post that is already favorited', () => {
    const { result } = renderFavorite('post-1', ['post-1']);

    expect(result.current.isFavorite).toBe(true);
  });

  it('reflects only its own post', () => {
    const { result } = renderFavorite('post-2', ['post-1']);

    expect(result.current.isFavorite).toBe(false);
  });

  it('adds the post to the store when toggled', () => {
    const { result, store } = renderFavorite('post-1');

    act(() => result.current.toggle());

    expect(store.getState().favorites.ids).toEqual(['post-1']);
    expect(result.current.isFavorite).toBe(true);
  });

  it('removes the post when toggled again', () => {
    const { result, store } = renderFavorite('post-1', ['post-1']);

    act(() => result.current.toggle());

    expect(store.getState().favorites.ids).toEqual([]);
    expect(result.current.isFavorite).toBe(false);
  });

  it('keeps the same toggle between renders', () => {
    const { result, rerender } = renderFavorite('post-1');
    const first = result.current.toggle;

    rerender();

    expect(result.current.toggle).toBe(first);
  });
});
