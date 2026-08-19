import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { makeApiPost } from '@/test/factories';
import { stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { renderWithProviders } from '@/test/renderWithProviders';
import PostDetailPage from './PostDetailPage';

const post = makeApiPost({
  id: 'post-1',
  title: 'Understanding React hooks',
  content: 'First paragraph.\n\nSecond paragraph.',
});

const listing = [
  post,
  makeApiPost({ id: 'post-2', title: 'Design systems at scale' }),
  makeApiPost({ id: 'post-3', title: 'Testing in practice' }),
];

// The page fetches one post and the listing, so the stub has to tell them apart.
const stubApi = () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const isDetail = /\/posts\/[^/]+$/.test(String(input));

      return new Response(JSON.stringify(isDetail ? post : listing), { status: 200 });
    }),
  );
};

const renderPage = (id = 'post-1') =>
  renderWithProviders(<PostDetailPage />, {
    initialEntries: [`/posts/${id}`],
    path: '/posts/:id',
  });

const settled = () => waitFor(() => expect(screen.queryByText('Loading post…')).toBeNull());

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PostDetailPage loading', () => {
  it('marks the article as busy and announces the wait', () => {
    stubFetchJson(post);

    renderPage();

    expect(screen.getByText('Loading post…')).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('holds back the latest articles until the post is loaded', () => {
    stubFetchJson(post);

    renderPage();

    expect(screen.queryByRole('region', { name: 'Latest articles' })).not.toBeInTheDocument();
  });
});

describe('PostDetailPage loaded', () => {
  it('renders the article for the id in the url', async () => {
    const fetchMock = stubFetchJson(post);

    renderPage('post-1');
    await settled();

    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/posts\/post-1$/);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Understanding React hooks',
    );
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
  });

  it('offers a way back', () => {
    stubFetchJson(post);

    renderPage();

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('scrolls to the top when the post changes', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    stubFetchJson(post);

    renderPage();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('shows the latest articles beside the loaded post', async () => {
    stubApi();

    renderPage();
    await settled();

    const latest = await screen.findByRole('region', { name: 'Latest articles' });

    expect(
      within(latest).getByRole('link', { name: 'Design systems at scale' }),
    ).toBeInTheDocument();
    expect(within(latest).queryByRole('link', { name: 'Understanding React hooks' })).toBeNull();
  });
});

describe('PostDetailPage failure', () => {
  it('reports the failure and retries', async () => {
    const fetchMock = stubFetchError(500);

    const { user } = renderPage();

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('We could not load this post.'),
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('reports a missing post as an error rather than as an empty page', async () => {
    stubFetchError(404);

    renderPage('missing');
    await settled();

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load this post.');
    expect(screen.queryByText('Post not found')).toBeNull();
  });
});
