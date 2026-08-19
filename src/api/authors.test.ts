import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeApiAuthor } from '@/test/factories';
import { getFetchInit, getFetchUrl, stubFetchError, stubFetchJson } from '@/test/mockFetch';
import { getAuthorById, getAuthors } from './authors';
import { ApiError } from './client';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getAuthors', () => {
  it('requests the authors listing and maps every author', async () => {
    const fetchMock = stubFetchJson([
      makeApiAuthor({ id: 'author-1', name: 'Ada Lovelace' }),
      makeApiAuthor({ id: 'author-2', name: 'Alan Turing' }),
    ]);

    const authors = await getAuthors();

    expect(getFetchUrl(fetchMock)).toMatch(/\/authors$/);
    expect(authors).toEqual([
      { id: 'author-1', name: 'Ada Lovelace', profilePicture: 'https://example.test/ada.png' },
      { id: 'author-2', name: 'Alan Turing', profilePicture: 'https://example.test/ada.png' },
    ]);
  });

  it('forwards the abort signal', async () => {
    const fetchMock = stubFetchJson([]);
    const controller = new AbortController();

    await getAuthors(controller.signal);

    expect(getFetchInit(fetchMock)?.signal).toBe(controller.signal);
  });

  it('rejects with an ApiError when the request fails', async () => {
    stubFetchError(500);

    await expect(getAuthors()).rejects.toBeInstanceOf(ApiError);
  });
});

describe('getAuthorById', () => {
  it('requests the author by id and maps it', async () => {
    const fetchMock = stubFetchJson(makeApiAuthor({ id: 'author-7', name: 'Grace Hopper' }));

    const author = await getAuthorById('author-7');

    expect(getFetchUrl(fetchMock)).toMatch(/\/authors\/author-7$/);
    expect(author).toEqual({
      id: 'author-7',
      name: 'Grace Hopper',
      profilePicture: 'https://example.test/ada.png',
    });
  });

  it('forwards the abort signal', async () => {
    const fetchMock = stubFetchJson(makeApiAuthor());
    const controller = new AbortController();

    await getAuthorById('author-1', controller.signal);

    expect(getFetchInit(fetchMock)?.signal).toBe(controller.signal);
  });

  it('rejects with an ApiError when the author does not exist', async () => {
    stubFetchError(404);

    await expect(getAuthorById('missing')).rejects.toMatchObject({ status: 404 });
  });
});
