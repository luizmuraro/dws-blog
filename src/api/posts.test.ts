import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeApiPost } from '@/test/factories';
import {
  getFetchInit,
  getFetchUrl,
  stubFetchError,
  stubFetchJson,
  stubFetchReject,
} from '@/test/mockFetch';
import { ApiError } from './client';
import { clearPostsCache, getPostById, getPosts } from './posts';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getPosts', () => {
  it('requests the posts listing', async () => {
    const fetchMock = stubFetchJson([]);

    await getPosts();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(getFetchUrl(fetchMock)).toMatch(/\/posts$/);
  });

  it('maps every post to the domain shape', async () => {
    stubFetchJson([
      makeApiPost({ id: 'post-1', title: 'First', content: 'One.\n\nTwo.' }),
      makeApiPost({ id: 'post-2', title: 'Second' }),
    ]);

    const posts = await getPosts();

    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({
      id: 'post-1',
      title: 'First',
      paragraphs: ['One.', 'Two.'],
      thumbnailUrl: 'https://example.test/thumb.png',
      publishedAt: '2024-03-05T12:00:00.000Z',
    });
    expect(posts[1].id).toBe('post-2');
  });

  it('returns an empty list when the api has no posts', async () => {
    stubFetchJson([]);

    await expect(getPosts()).resolves.toEqual([]);
  });

  it('rejects with an ApiError when the request fails', async () => {
    stubFetchError(500);

    await expect(getPosts()).rejects.toBeInstanceOf(ApiError);
  });

  it('fetches once and shares the listing with later callers', async () => {
    const fetchMock = stubFetchJson([makeApiPost({ id: 'post-1' })]);

    const [first, second] = await Promise.all([getPosts(), getPosts()]);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(first).toBe(second);
    await expect(getPosts()).resolves.toBe(first);
  });

  it('does not cache a rejection, so a retry hits the api again', async () => {
    stubFetchError(500);
    await expect(getPosts()).rejects.toBeInstanceOf(ApiError);

    const fetchMock = stubFetchJson([makeApiPost({ id: 'post-1' })]);

    await expect(getPosts()).resolves.toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('clearPostsCache forces the next call to refetch', async () => {
    stubFetchJson([]);
    await getPosts();

    clearPostsCache();
    const fetchMock = stubFetchJson([]);
    await getPosts();

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe('getPostById', () => {
  it('requests the post by id', async () => {
    const fetchMock = stubFetchJson(makeApiPost());

    await getPostById('post-42');

    expect(getFetchUrl(fetchMock)).toMatch(/\/posts\/post-42$/);
  });

  it('maps the post to the domain shape', async () => {
    stubFetchJson(makeApiPost({ id: 'post-42', title: 'The answer' }));

    await expect(getPostById('post-42')).resolves.toMatchObject({
      id: 'post-42',
      title: 'The answer',
    });
  });

  it('forwards the abort signal', async () => {
    const fetchMock = stubFetchJson(makeApiPost());
    const controller = new AbortController();

    await getPostById('post-1', controller.signal);

    expect(getFetchInit(fetchMock)?.signal).toBe(controller.signal);
  });

  it('resolves to null when the post does not exist', async () => {
    stubFetchError(404);

    await expect(getPostById('missing')).resolves.toBeNull();
  });

  it('still rejects when the request fails for any other reason', async () => {
    stubFetchError(500);

    await expect(getPostById('post-1')).rejects.toMatchObject({ name: 'ApiError', status: 500 });
  });

  it('does not swallow a network failure', async () => {
    const networkError = new TypeError('Failed to fetch');
    stubFetchReject(networkError);

    await expect(getPostById('post-1')).rejects.toBe(networkError);
  });
});
