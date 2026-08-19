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

interface FoldedText {
  value: string;
  sourceIndices: number[];
}

const fold = (text: string): FoldedText => {
  let value = '';
  const sourceIndices: number[] = [];

  for (let index = 0; index < text.length; index += 1) {
    for (const char of normalize(text[index])) {
      value += char;
      sourceIndices.push(index);
    }
  }

  sourceIndices.push(text.length);

  return { value, sourceIndices };
};

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
  const needle = normalize(term.trim());

  if (!needle) return [{ text, isMatch: false }];

  const { value: haystack, sourceIndices } = fold(text);
  const segments: TextSegment[] = [];
  let cursor = 0;
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    const start = sourceIndices[index];
    const end = sourceIndices[index + needle.length];

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), isMatch: false });
    }

    segments.push({ text: text.slice(start, end), isMatch: true });
    cursor = end;
    index = haystack.indexOf(needle, index + needle.length);
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return segments;
};

export const formatResultCount = (count: number): string =>
  `${count} ${count === 1 ? 'result' : 'results'}`;
