export const StorageKey = {
  Favorites: 'dws-blog:favorites',
  RecentSearches: 'dws-blog:recent-searches',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const readStringArray = (key: StorageKey): string[] => {
  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeStringArray = (key: StorageKey, values: string[]): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    /* A list that cannot be persisted still works for the session. */
  }
};
