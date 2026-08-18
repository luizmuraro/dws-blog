export const SortOrder = {
  Newest: 'newest',
  Oldest: 'oldest',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
