import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { useAppSelector } from '@/store/hooks';
import { selectFavoriteIds } from '@/store/favoritesSlice';
import { renderWithProviders } from './renderWithProviders';

const Probe = () => {
  const favoriteIds = useAppSelector(selectFavoriteIds);

  return <p>favorites: {favoriteIds.join(',') || 'none'}</p>;
};

describe('test environment', () => {
  it('provides the DOM globals the app expects', () => {
    expect(typeof ResizeObserver).toBe('function');
    expect(typeof window.scrollTo).toBe('function');
    expect(typeof window.localStorage.getItem).toBe('function');
  });

  it('renders a component with a store and a router', () => {
    renderWithProviders(<Probe />, { preloadedState: { favorites: { ids: ['post-1'] } } });

    expect(screen.getByText('favorites: post-1')).toBeInTheDocument();
  });

  it('gives every render an isolated store', () => {
    const { store } = renderWithProviders(<Probe />);

    expect(store.getState().favorites.ids).toEqual([]);
  });
});
