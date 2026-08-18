import type { ApiAuthor, ApiCategory, ApiPost } from '@/types/api';
import type { Author, Category, Post } from '@/types/domain';
import { splitParagraphs } from '@/utils/text';

export const mapApiAuthorToAuthor = (apiAuthor: ApiAuthor): Author => ({
  id: apiAuthor.id,
  name: apiAuthor.name,
  profilePicture: apiAuthor.profilePicture,
});

export const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => ({
  id: apiCategory.id,
  name: apiCategory.name,
});

export const mapApiPostToPost = (apiPost: ApiPost): Post => ({
  id: apiPost.id,
  title: apiPost.title,
  paragraphs: splitParagraphs(apiPost.content),
  thumbnailUrl: apiPost.thumbnail_url,
  publishedAt: apiPost.createdAt,
  author: mapApiAuthorToAuthor(apiPost.author),
  categories: apiPost.categories.map(mapApiCategoryToCategory),
});
