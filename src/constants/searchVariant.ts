export const SearchVariant = {
  Desktop: 'desktop',
  Mobile: 'mobile',
} as const;

export type SearchVariant = (typeof SearchVariant)[keyof typeof SearchVariant];
