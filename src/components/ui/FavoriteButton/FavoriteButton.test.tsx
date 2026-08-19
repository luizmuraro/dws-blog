import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import { renderWithProviders } from '@/test/renderWithProviders';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton overlay variant', () => {
  it('offers to add a post that is not favorited', () => {
    renderWithProviders(<FavoriteButton postId="post-1" />);

    const button = screen.getByRole('button', { name: 'Add to favorites' });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('title', 'Add to favorites');
  });

  it('offers to remove a post that is already favorited', () => {
    renderWithProviders(<FavoriteButton postId="post-1" />, {
      preloadedState: { favorites: { ids: ['post-1'] } },
    });

    const button = screen.getByRole('button', { name: 'Remove from favorites' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('reflects only its own post', () => {
    renderWithProviders(<FavoriteButton postId="post-2" />, {
      preloadedState: { favorites: { ids: ['post-1'] } },
    });

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds the post to the store when pressed', async () => {
    const { store, user } = renderWithProviders(<FavoriteButton postId="post-1" />);

    await user.click(screen.getByRole('button'));

    expect(store.getState().favorites.ids).toEqual(['post-1']);
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });

  it('removes the post from the store when pressed again', async () => {
    const { store, user } = renderWithProviders(<FavoriteButton postId="post-1" />, {
      preloadedState: { favorites: { ids: ['post-1'] } },
    });

    await user.click(screen.getByRole('button'));

    expect(store.getState().favorites.ids).toEqual([]);
  });
});

describe('FavoriteButton inline variant', () => {
  it('shows the call to action as visible text instead of a label', () => {
    renderWithProviders(<FavoriteButton postId="post-1" variant={FavoriteButtonVariant.Inline} />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Add to favorites');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).not.toHaveAttribute('title');
  });

  it('reads as favorited once the post is in the store', () => {
    renderWithProviders(<FavoriteButton postId="post-1" variant={FavoriteButtonVariant.Inline} />, {
      preloadedState: { favorites: { ids: ['post-1'] } },
    });

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Favorited');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles the store like the overlay variant', async () => {
    const { store, user } = renderWithProviders(
      <FavoriteButton postId="post-1" variant={FavoriteButtonVariant.Inline} />,
    );

    await user.click(screen.getByRole('button'));

    expect(store.getState().favorites.ids).toEqual(['post-1']);
  });
});
