import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import PostCard from './PostCard';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  paragraphs: ['Hooks let you reuse stateful logic.', 'A second paragraph.'],
  thumbnailUrl: 'https://example.test/cover.png',
  publishedAt: '2024-03-05T12:00:00.000Z',
  author: makeAuthor({ name: 'Ada Lovelace' }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

describe('PostCard', () => {
  it('links the title to the post detail page', () => {
    renderWithProviders(<PostCard post={post} />);

    expect(screen.getByRole('link', { name: 'Understanding React hooks' })).toHaveAttribute(
      'href',
      '/posts/post-1',
    );
  });

  it('keeps the thumbnail decorative so the title is not announced twice', () => {
    const { container } = renderWithProviders(<PostCard post={post} />);

    const thumbnail = container.querySelector('img[alt=""]');

    expect(thumbnail).toHaveAttribute('src', 'https://example.test/cover.png');
    expect(thumbnail).toHaveAttribute('loading', 'lazy');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows the formatted date and the author last name', () => {
    renderWithProviders(<PostCard post={post} />);

    expect(screen.getByText('Mar 5, 2024')).toBeInTheDocument();
    expect(screen.getByText('Lovelace')).toBeInTheDocument();
  });

  it('shows only the first paragraph as the lead', () => {
    renderWithProviders(<PostCard post={post} />);

    expect(screen.getByText('Hooks let you reuse stateful logic.')).toBeInTheDocument();
    expect(screen.queryByText('A second paragraph.')).not.toBeInTheDocument();
  });

  it('omits the lead when the post has no paragraphs', () => {
    renderWithProviders(<PostCard post={makePost({ paragraphs: [] })} />);

    expect(screen.queryByText(/paragraph/)).not.toBeInTheDocument();
  });

  it('lists the categories', () => {
    renderWithProviders(<PostCard post={post} />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('carries a favorite button wired to its own post', async () => {
    const { store, user } = renderWithProviders(<PostCard post={post} />);

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }));

    expect(store.getState().favorites.ids).toEqual(['post-1']);
  });

  it('shows the post as favorited when the store says so', () => {
    renderWithProviders(<PostCard post={post} />, {
      preloadedState: { favorites: { ids: ['post-1'] } },
    });

    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument();
  });
});
