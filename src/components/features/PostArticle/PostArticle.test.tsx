import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import PostArticle from './PostArticle';
import PostArticleSkeleton from './PostArticleSkeleton';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  paragraphs: ['First paragraph.', 'Second paragraph.', 'Third paragraph.'],
  thumbnailUrl: 'https://example.test/cover.png',
  publishedAt: '2024-03-05T12:00:00.000Z',
  author: makeAuthor({ name: 'Ada Lovelace', profilePicture: 'https://example.test/ada.png' }),
  categories: [makeCategory({ name: 'Frontend' })],
});

describe('PostArticle', () => {
  it('renders the title as the page heading', () => {
    renderWithProviders(<PostArticle post={post} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Understanding React hooks',
    );
  });

  it('credits the author by full name', () => {
    renderWithProviders(<PostArticle post={post} />);

    expect(screen.getByText(/Written by:/)).toHaveTextContent('Written by: Ada Lovelace');
  });

  it('exposes the machine-readable date alongside the formatted one', () => {
    const { container } = renderWithProviders(<PostArticle post={post} />);
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2024-03-05T12:00:00.000Z');
    expect(time).toHaveTextContent('Mar 5, 2024');
  });

  it('treats the avatar as decorative and the cover as meaningful', () => {
    const { container } = renderWithProviders(<PostArticle post={post} />);

    expect(screen.getByRole('img', { name: 'Understanding React hooks' })).toHaveAttribute(
      'src',
      'https://example.test/cover.png',
    );
    expect(container.querySelector('img[alt=""]')).toHaveAttribute(
      'src',
      'https://example.test/ada.png',
    );
  });

  it('renders every paragraph in order', () => {
    renderWithProviders(<PostArticle post={post} />);

    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Third paragraph.')).toBeInTheDocument();
  });

  it('renders no body for a post without paragraphs', () => {
    renderWithProviders(<PostArticle post={makePost({ paragraphs: [] })} />);

    expect(screen.queryByText(/paragraph/)).not.toBeInTheDocument();
  });

  it('carries the inline favorite button wired to the store', async () => {
    const { store, user } = renderWithProviders(<PostArticle post={post} />);

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }));

    expect(store.getState().favorites.ids).toEqual(['post-1']);
    expect(screen.getByRole('button', { name: 'Favorited' })).toBeInTheDocument();
  });
});

describe('PostArticleSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = renderWithProviders(<PostArticleSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
