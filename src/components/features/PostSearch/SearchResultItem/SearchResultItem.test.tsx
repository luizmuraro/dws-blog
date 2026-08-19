import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import SearchResultItem from './SearchResultItem';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  publishedAt: '2024-03-05T12:00:00.000Z',
  author: makeAuthor({ name: 'Ada Lovelace' }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

describe('SearchResultItem', () => {
  it('links the title to the post', () => {
    renderWithProviders(<SearchResultItem post={post} query="" onSelect={() => {}} />);

    expect(screen.getByRole('link', { name: 'Understanding React hooks' })).toHaveAttribute(
      'href',
      '/posts/post-1',
    );
  });

  it('highlights the part of the title that matched', () => {
    const { container } = renderWithProviders(
      <SearchResultItem post={post} query="hooks" onSelect={() => {}} />,
    );

    expect([...container.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual([
      'hooks',
    ]);
  });

  it('shows the author full name and the formatted date', () => {
    renderWithProviders(<SearchResultItem post={post} query="" onSelect={() => {}} />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Mar 5, 2024')).toBeInTheDocument();
  });

  it('lists the categories', () => {
    renderWithProviders(<SearchResultItem post={post} query="" onSelect={() => {}} />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('treats the thumbnail as decorative', () => {
    const { container } = renderWithProviders(
      <SearchResultItem post={post} query="" onSelect={() => {}} />,
    );

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('reports the selection when the link is followed', async () => {
    const onSelect = vi.fn();
    const { user } = renderWithProviders(
      <SearchResultItem post={post} query="" onSelect={onSelect} />,
    );

    await user.click(screen.getByRole('link'));

    expect(onSelect).toHaveBeenCalledOnce();
  });
});
