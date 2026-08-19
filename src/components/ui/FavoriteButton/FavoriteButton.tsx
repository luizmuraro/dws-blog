import { StarIcon } from '@/components/icons';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import { cx } from '@/utils/classNames';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  variant?: FavoriteButtonVariant;
}

const FavoriteButton = ({
  isFavorite,
  onToggle,
  variant = FavoriteButtonVariant.Overlay,
}: FavoriteButtonProps) => {
  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  const isInline = variant === FavoriteButtonVariant.Inline;

  return (
    <button
      className={cx(styles.button, styles[variant], isFavorite && styles.active)}
      type="button"
      aria-pressed={isFavorite}
      aria-label={isInline ? undefined : label}
      title={isInline ? undefined : label}
      onClick={onToggle}
    >
      <StarIcon filled={isFavorite} />
      {isInline && <span>{isFavorite ? 'Favorited' : 'Add to favorites'}</span>}
    </button>
  );
};

export default FavoriteButton;
