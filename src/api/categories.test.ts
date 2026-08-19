import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeApiCategory } from '@/test/factories';
import { getFetchInit, getFetchUrl, stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { ApiError } from './client';
import { getCategories } from './categories';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getCategories', () => {
  it('requests the categories listing', async () => {
    const fetchMock = stubFetchJson([]);

    await getCategories();

    expect(getFetchUrl(fetchMock)).toMatch(/\/categories$/);
  });

  it('deduplicates the rows the api returns per post, keeping the first id seen', async () => {
    stubFetchJson([
      makeApiCategory({ id: 'category-1', name: 'Frontend', postId: 'post-1' }),
      makeApiCategory({ id: 'category-2', name: 'Frontend', postId: 'post-2' }),
      makeApiCategory({ id: 'category-3', name: 'Frontend', postId: 'post-3' }),
    ]);

    await expect(getCategories()).resolves.toEqual([{ id: 'category-1', name: 'Frontend' }]);
  });

  it('sorts the categories by name', async () => {
    stubFetchJson([
      makeApiCategory({ id: 'category-1', name: 'Startups' }),
      makeApiCategory({ id: 'category-2', name: 'Design' }),
      makeApiCategory({ id: 'category-3', name: 'Frontend' }),
    ]);

    const categories = await getCategories();

    expect(categories.map((category) => category.name)).toEqual(['Design', 'Frontend', 'Startups']);
  });

  it('sorts accented names by locale rather than by code point', async () => {
    stubFetchJson([
      makeApiCategory({ id: 'category-1', name: 'Zebra' }),
      makeApiCategory({ id: 'category-2', name: 'Ácido' }),
    ]);

    const categories = await getCategories();

    expect(categories.map((category) => category.name)).toEqual(['Ácido', 'Zebra']);
  });

  it('returns an empty list when the api has no categories', async () => {
    stubFetchJson([]);

    await expect(getCategories()).resolves.toEqual([]);
  });

  it('forwards the abort signal', async () => {
    const fetchMock = stubFetchJson([]);
    const controller = new AbortController();

    await getCategories(controller.signal);

    expect(getFetchInit(fetchMock)?.signal).toBe(controller.signal);
  });

  it('rejects with an ApiError when the request fails', async () => {
    stubFetchError(503);

    await expect(getCategories()).rejects.toBeInstanceOf(ApiError);
  });
});
