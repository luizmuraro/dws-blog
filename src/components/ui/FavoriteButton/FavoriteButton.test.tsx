import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton overlay variant', () => {
  it('offers to add a post that is not favorited', () => {
    render(<FavoriteButton isFavorite={false} onToggle={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Add to favorites' });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('title', 'Add to favorites');
  });

  it('offers to remove a post that is already favorited', () => {
    render(<FavoriteButton isFavorite onToggle={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Remove from favorites' });

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the press to its caller', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});

describe('FavoriteButton inline variant', () => {
  it('shows the call to action as visible text instead of a label', () => {
    render(
      <FavoriteButton
        isFavorite={false}
        onToggle={vi.fn()}
        variant={FavoriteButtonVariant.Inline}
      />,
    );

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Add to favorites');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).not.toHaveAttribute('title');
  });

  it('reads as favorited once the post is in the store', () => {
    render(<FavoriteButton isFavorite onToggle={vi.fn()} variant={FavoriteButtonVariant.Inline} />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Favorited');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the press like the overlay variant', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <FavoriteButton
        isFavorite={false}
        onToggle={onToggle}
        variant={FavoriteButtonVariant.Inline}
      />,
    );
    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
