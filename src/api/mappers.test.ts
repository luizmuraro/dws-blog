import { describe, expect, it } from 'vitest';
import { makeApiAuthor, makeApiCategory, makeApiPost } from '@/test/factories';
import { mapApiAuthorToAuthor, mapApiCategoryToCategory, mapApiPostToPost } from './mappers';

describe('mapApiAuthorToAuthor', () => {
  it('keeps only the fields the app renders', () => {
    const apiAuthor = makeApiAuthor({ id: 'author-9', name: 'Grace Hopper' });

    expect(mapApiAuthorToAuthor(apiAuthor)).toEqual({
      id: 'author-9',
      name: 'Grace Hopper',
      profilePicture: apiAuthor.profilePicture,
    });
  });
});

describe('mapApiCategoryToCategory', () => {
  it('keeps only the id and the name', () => {
    expect(mapApiCategoryToCategory(makeApiCategory({ id: 'category-9', name: 'Design' }))).toEqual(
      {
        id: 'category-9',
        name: 'Design',
      },
    );
  });
});

describe('mapApiPostToPost', () => {
  it('renames thumbnail_url and createdAt to the domain names', () => {
    const post = mapApiPostToPost(
      makeApiPost({
        thumbnail_url: 'https://example.test/cover.png',
        createdAt: '2024-07-01T12:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
      }),
    );

    expect(post.thumbnailUrl).toBe('https://example.test/cover.png');
    expect(post.publishedAt).toBe('2024-07-01T12:00:00.000Z');
  });

  it('splits the content into paragraphs', () => {
    const post = mapApiPostToPost(makeApiPost({ content: 'One.\n\nTwo.\n\nThree.' }));

    expect(post.paragraphs).toEqual(['One.', 'Two.', 'Three.']);
  });

  it('maps the nested author and categories', () => {
    const post = mapApiPostToPost(
      makeApiPost({
        author: makeApiAuthor({ id: 'author-2', name: 'Alan Turing' }),
        categories: [
          makeApiCategory({ id: 'category-1', name: 'Frontend' }),
          makeApiCategory({ id: 'category-2', name: 'Design' }),
        ],
      }),
    );

    expect(post.author).toEqual({
      id: 'author-2',
      name: 'Alan Turing',
      profilePicture: 'https://example.test/ada.png',
    });
    expect(post.categories).toEqual([
      { id: 'category-1', name: 'Frontend' },
      { id: 'category-2', name: 'Design' },
    ]);
  });

  it('drops the api-only fields', () => {
    const post = mapApiPostToPost(makeApiPost());

    expect(post).not.toHaveProperty('content');
    expect(post).not.toHaveProperty('thumbnail_url');
    expect(post).not.toHaveProperty('authorId');
    expect(post).not.toHaveProperty('updatedAt');
    expect(post.categories[0]).not.toHaveProperty('postId');
  });

  it('handles a post with no categories', () => {
    expect(mapApiPostToPost(makeApiPost({ categories: [] })).categories).toEqual([]);
  });

  it('handles empty content', () => {
    expect(mapApiPostToPost(makeApiPost({ content: '' })).paragraphs).toEqual([]);
  });
});
