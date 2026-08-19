import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { makeApiPost } from '@/test/factories';
import { stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { renderWithProviders } from '@/test/renderWithProviders';
import LatestArticles from './LatestArticles';

const apiPost = (id: string, title: string, createdAt: string) =>
  makeApiPost({ id, title, createdAt });

const listing = [
  apiPost('post-1', 'Oldest', '2024-01-01T12:00:00.000Z'),
  apiPost('post-2', 'Middle', '2024-03-01T12:00:00.000Z'),
  apiPost('post-3', 'Newest', '2024-06-01T12:00:00.000Z'),
  apiPost('post-4', 'Ancient', '2023-01-01T12:00:00.000Z'),
];

const section = () => screen.queryByRole('region', { name: 'Latest articles' });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LatestArticles', () => {
  it('shows placeholders while the listing loads', () => {
    stubFetchJson(listing);

    const { container } = renderWithProviders(<LatestArticles currentPostId="post-1" />);

    expect(section()).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('excludes the post being read', async () => {
    stubFetchJson(listing);

    renderWithProviders(<LatestArticles currentPostId="post-3" />);

    await waitFor(() => expect(screen.getByText('Middle')).toBeInTheDocument());
    expect(screen.queryByText('Newest')).not.toBeInTheDocument();
  });

  it('keeps the three most recent posts, newest first', async () => {
    stubFetchJson(listing);

    renderWithProviders(<LatestArticles currentPostId="unknown" />);

    await waitFor(() => expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3));
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['Newest', 'Middle', 'Oldest']);
    expect(screen.queryByText('Ancient')).not.toBeInTheDocument();
  });

  it('links each card to its post', async () => {
    stubFetchJson(listing);

    renderWithProviders(<LatestArticles currentPostId="unknown" />);

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Newest' })).toHaveAttribute('href', '/posts/post-3'),
    );
  });

  it('hides the whole section when the listing fails', async () => {
    stubFetchError(500);

    const { container } = renderWithProviders(<LatestArticles currentPostId="post-1" />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it('hides the whole section when there is nothing else to read', async () => {
    stubFetchJson([apiPost('post-1', 'Only', '2024-01-01T12:00:00.000Z')]);

    const { container } = renderWithProviders(<LatestArticles currentPostId="post-1" />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it('hides the whole section when the listing is empty', async () => {
    stubFetchJson([]);

    const { container } = renderWithProviders(<LatestArticles currentPostId="post-1" />);

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
