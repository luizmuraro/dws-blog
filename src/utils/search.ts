import type { Post } from '@/types/domain';

export interface TextSegment {
  text: string;
  isMatch: boolean;
}

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const getSearchableFields = (post: Post): string[] => [
  post.title,
  post.author.name,
  ...post.categories.map((category) => category.name),
];

export const searchPosts = (posts: Post[], term: string): Post[] => {
  const query = normalize(term.trim());

  if (!query) return posts;

  return posts.filter((post) =>
    getSearchableFields(post).some((field) => normalize(field).includes(query)),
  );
};

export const splitByMatches = (text: string, term: string): TextSegment[] => {
  const query = term.trim();

  if (!query) return [{ text, isMatch: false }];

  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  const segments: TextSegment[] = [];
  let cursor = 0;
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    if (index > cursor) {
      segments.push({ text: text.slice(cursor, index), isMatch: false });
    }

    segments.push({ text: text.slice(index, index + needle.length), isMatch: true });
    cursor = index + needle.length;
    index = haystack.indexOf(needle, cursor);
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return segments;
};

export const formatResultCount = (count: number): string =>
  `${count} ${count === 1 ? 'result' : 'results'}`;
