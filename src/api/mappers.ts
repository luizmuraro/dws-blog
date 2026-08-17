import type { ApiAuthor, ApiCategory, ApiPost } from '@/types/api';
import type { Author, Category, Post } from '@/types/domain';
import { splitParagraphs } from '@/utils/text';

export function mapApiAuthorToAuthor(apiAuthor: ApiAuthor): Author {
  return {
    id: apiAuthor.id,
    name: apiAuthor.name,
    profilePicture: apiAuthor.profilePicture,
  };
}

export function mapApiCategoryToCategory(apiCategory: ApiCategory): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
  };
}

export function mapApiPostToPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    paragraphs: splitParagraphs(apiPost.content),
    thumbnailUrl: apiPost.thumbnail_url,
    publishedAt: apiPost.createdAt,
    author: mapApiAuthorToAuthor(apiPost.author),
    categories: apiPost.categories.map(mapApiCategoryToCategory),
  };
}
