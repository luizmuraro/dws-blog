const FAVORITES_KEY = 'dws-blog:favorites';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const readFavoriteIds = (): string[] => {
  try {
    const stored = window.localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeFavoriteIds = (ids: string[]): void => {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    /* A favorite that cannot be persisted still works for the session. */
  }
};
