import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { makeApiAuthor, makeApiCategory, makeApiPost } from '@/test/factories';
import { stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { renderWithProviders } from '@/test/renderWithProviders';
import PostsListPage from './PostsListPage';

const ada = makeApiAuthor({ id: 'author-1', name: 'Ada Lovelace' });
const alan = makeApiAuthor({ id: 'author-2', name: 'Alan Turing' });

const listing = [
  makeApiPost({
    id: 'post-1',
    title: 'Understanding React hooks',
    createdAt: '2024-01-10T12:00:00.000Z',
    author: ada,
    categories: [makeApiCategory({ id: 'category-1', name: 'Frontend' })],
  }),
  makeApiPost({
    id: 'post-2',
    title: 'Design systems at scale',
    createdAt: '2024-05-20T12:00:00.000Z',
    author: alan,
    categories: [makeApiCategory({ id: 'category-2', name: 'Design' })],
  }),
];

const renderPage = (options?: Parameters<typeof renderWithProviders>[1]) =>
  renderWithProviders(<PostsListPage />, options);

const cardTitles = () =>
  screen
    .queryAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/posts/'))
    .map((link) => link.textContent);

const settled = () => waitFor(() => expect(screen.queryByText('Loading posts…')).toBeNull());

const filterBar = () => within(screen.getByRole('group', { name: 'Filters' }));

const scopeTabs = () => within(screen.getByRole('group', { name: 'Post scope' }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PostsListPage loading', () => {
  it('marks the grid as busy and announces the wait', () => {
    stubFetchJson(listing);

    renderPage();

    expect(screen.getByText('Loading posts…')).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('offers no filter controls while loading', () => {
    stubFetchJson(listing);

    renderPage();

    expect(screen.queryByRole('group', { name: 'Filters' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Post scope' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Newest first/ })).not.toBeInTheDocument();
  });
});

describe('PostsListPage listing', () => {
  it('renders a card per post, newest first', async () => {
    stubFetchJson(listing);

    renderPage();
    await settled();

    expect(cardTitles()).toEqual(['Design systems at scale', 'Understanding React hooks']);
  });

  it('reveals the filters and the sort control once loaded', async () => {
    stubFetchJson(listing);

    renderPage();
    await settled();

    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Post scope' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Newest first/ })).toBeInTheDocument();
  });

  it('flips the order through the sort toggle', async () => {
    stubFetchJson(listing);

    const { user } = renderPage();
    await settled();

    await user.click(screen.getByRole('button', { name: /Newest first/ }));

    expect(cardTitles()).toEqual(['Understanding React hooks', 'Design systems at scale']);
  });

  it('hides the filters when the listing has nothing to filter by', async () => {
    stubFetchJson([]);

    renderPage();
    await settled();

    expect(screen.queryByRole('group', { name: 'Filters' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Post scope' })).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Filters' })).not.toBeInTheDocument();
  });
});

describe('PostsListPage failure', () => {
  it('reports the failure and retries', async () => {
    const fetchMock = stubFetchError(500);

    const { user } = renderPage();

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('We could not load the posts.'),
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});

describe('PostsListPage search term', () => {
  it('narrows the listing to what the query matches', async () => {
    stubFetchJson(listing);

    renderPage({ initialEntries: ['/?q=react'] });
    await settled();

    expect(cardTitles()).toEqual(['Understanding React hooks']);
  });

  it('summarises the active query with a way out', async () => {
    stubFetchJson(listing);

    renderPage({ initialEntries: ['/?q=react'] });
    await settled();

    expect(screen.getByText('“react”')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clear search' })).toHaveAttribute('href', '/');
  });

  it('quotes the term when nothing matches', async () => {
    stubFetchJson(listing);

    renderPage({ initialEntries: ['/?q=kubernetes'] });
    await settled();

    expect(screen.getByText('No posts found for “kubernetes”')).toBeInTheDocument();
  });

  it('shows the plain empty message without a query', async () => {
    stubFetchJson([]);

    renderPage();
    await settled();

    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });
});

describe('PostsListPage category param', () => {
  it('seeds the category filter from the url', async () => {
    stubFetchJson(listing);

    renderPage({ initialEntries: ['/?category=Design'] });
    await settled();

    expect(cardTitles()).toEqual(['Design systems at scale']);
    expect(filterBar().getByRole('button', { name: 'Design' })).toBeInTheDocument();
  });
});

describe('PostsListPage favorites', () => {
  it('keeps only the favorited posts while the favorites tab is on', async () => {
    stubFetchJson(listing);

    const { user } = renderPage({ preloadedState: { favorites: { ids: ['post-1'] } } });
    await settled();

    await user.click(scopeTabs().getByRole('button', { name: /Favorites/ }));

    expect(cardTitles()).toEqual(['Understanding React hooks']);
  });

  it('brings every post back through the all posts tab', async () => {
    stubFetchJson(listing);

    const { user } = renderPage({ preloadedState: { favorites: { ids: ['post-1'] } } });
    await settled();

    await user.click(scopeTabs().getByRole('button', { name: /Favorites/ }));
    await user.click(scopeTabs().getByRole('button', { name: /All posts/ }));

    expect(cardTitles()).toEqual(['Design systems at scale', 'Understanding React hooks']);
  });

  it('counts every post and every favorite on the tabs', async () => {
    stubFetchJson(listing);

    renderPage({ preloadedState: { favorites: { ids: ['post-1'] } } });
    await settled();

    expect(scopeTabs().getByRole('button', { name: /All posts/ })).toHaveTextContent('2');
    expect(scopeTabs().getByRole('button', { name: /Favorites/ })).toHaveTextContent('1');
  });

  it('is also reachable from the toolbar toggle beside the sort control', async () => {
    stubFetchJson(listing);

    const { user } = renderPage({ preloadedState: { favorites: { ids: ['post-2'] } } });
    await settled();

    const toolbarToggles = screen.getAllByRole('button', { name: /Favorites/ });

    await user.click(toolbarToggles[toolbarToggles.length - 1]);

    expect(cardTitles()).toEqual(['Design systems at scale']);
  });

  it('explains how to favorite a post when none are saved', async () => {
    stubFetchJson(listing);

    const { user } = renderPage();
    await settled();

    await user.click(scopeTabs().getByRole('button', { name: /Favorites/ }));

    expect(
      screen.getByText(
        'You have not favorited any posts yet. Tap the star on a post to save it here.',
      ),
    ).toBeInTheDocument();
  });

  it('says the filters are too narrow when favorites exist but none match', async () => {
    stubFetchJson(listing);

    const { user } = renderPage({
      preloadedState: { favorites: { ids: ['post-1'] } },
      initialEntries: ['/?category=Design'],
    });
    await settled();

    await user.click(scopeTabs().getByRole('button', { name: /Favorites/ }));

    expect(screen.getByText('No favorites match the current filters.')).toBeInTheDocument();
  });
});
