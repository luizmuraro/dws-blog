import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostScopeTabs from './PostScopeTabs';
import PostScopeTabsSkeleton from './PostScopeTabsSkeleton';

const renderTabs = (props: Partial<Parameters<typeof PostScopeTabs>[0]> = {}) => {
  const onShowFavoritesOnlyChange = vi.fn();
  const user = userEvent.setup();

  render(
    <PostScopeTabs
      allCount={24}
      favoritesCount={2}
      showFavoritesOnly={false}
      onShowFavoritesOnlyChange={onShowFavoritesOnlyChange}
      {...props}
    />,
  );

  return { onShowFavoritesOnlyChange, user };
};

describe('PostScopeTabs', () => {
  it('shows a tab per scope with its count', () => {
    renderTabs();

    expect(screen.getByRole('button', { name: /All posts/ })).toHaveTextContent('24');
    expect(screen.getByRole('button', { name: /Favorites/ })).toHaveTextContent('2');
  });

  it('marks the all posts tab as the current scope', () => {
    renderTabs();

    expect(screen.getByRole('button', { name: /All posts/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /Favorites/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('marks the favorites tab as the current scope', () => {
    renderTabs({ showFavoritesOnly: true });

    expect(screen.getByRole('button', { name: /Favorites/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /All posts/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('switches to favorites', async () => {
    const { user, onShowFavoritesOnlyChange } = renderTabs();

    await user.click(screen.getByRole('button', { name: /Favorites/ }));

    expect(onShowFavoritesOnlyChange).toHaveBeenCalledWith(true);
  });

  it('switches back to all posts', async () => {
    const { user, onShowFavoritesOnlyChange } = renderTabs({ showFavoritesOnly: true });

    await user.click(screen.getByRole('button', { name: /All posts/ }));

    expect(onShowFavoritesOnlyChange).toHaveBeenCalledWith(false);
  });

  it('groups the tabs under a single accessible name', () => {
    renderTabs();

    expect(screen.getByRole('group', { name: 'Post scope' })).toBeInTheDocument();
  });

  it('marks the strip so the header hands over its separator', () => {
    renderTabs();

    expect(screen.getByRole('group', { name: 'Post scope' })).toHaveAttribute(
      'data-post-scope-tabs',
    );
  });
});

describe('PostScopeTabsSkeleton', () => {
  it('is hidden from assistive technology and offers no controls', () => {
    const { container } = render(<PostScopeTabsSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('holds the header separator while the posts load', () => {
    const { container } = render(<PostScopeTabsSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('data-post-scope-tabs');
  });
});
