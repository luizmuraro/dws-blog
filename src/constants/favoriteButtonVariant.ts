export const FavoriteButtonVariant = {
  Overlay: 'overlay',
  Inline: 'inline',
} as const;

export type FavoriteButtonVariant =
  (typeof FavoriteButtonVariant)[keyof typeof FavoriteButtonVariant];
