import type { ApiAuthor, ApiCategory, ApiPost } from '@/types/api';
import type { Author, Category, Post } from '@/types/domain';

const DEFAULT_DATE = '2024-03-05T12:00:00.000Z';

export const makeAuthor = (overrides: Partial<Author> = {}): Author => ({
  id: 'author-1',
  name: 'Ada Lovelace',
  profilePicture: 'https://example.test/ada.png',
  ...overrides,
});

export const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 'category-1',
  name: 'Technology',
  ...overrides,
});

export const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: 'post-1',
  title: 'A post about testing',
  paragraphs: ['First paragraph.', 'Second paragraph.'],
  thumbnailUrl: 'https://example.test/thumb.png',
  publishedAt: DEFAULT_DATE,
  author: makeAuthor(),
  categories: [makeCategory()],
  ...overrides,
});

export const makeApiAuthor = (overrides: Partial<ApiAuthor> = {}): ApiAuthor => ({
  id: 'author-1',
  name: 'Ada Lovelace',
  profilePicture: 'https://example.test/ada.png',
  createdAt: DEFAULT_DATE,
  updatedAt: DEFAULT_DATE,
  ...overrides,
});

export const makeApiCategory = (overrides: Partial<ApiCategory> = {}): ApiCategory => ({
  id: 'category-1',
  name: 'Technology',
  createdAt: DEFAULT_DATE,
  updatedAt: DEFAULT_DATE,
  postId: 'post-1',
  ...overrides,
});

export const makeApiPost = (overrides: Partial<ApiPost> = {}): ApiPost => ({
  id: 'post-1',
  title: 'A post about testing',
  content: 'First paragraph.\n\nSecond paragraph.',
  thumbnail_url: 'https://example.test/thumb.png',
  authorId: 'author-1',
  createdAt: DEFAULT_DATE,
  updatedAt: DEFAULT_DATE,
  categories: [makeApiCategory()],
  author: makeApiAuthor(),
  ...overrides,
});
