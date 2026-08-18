import { StarIcon } from '@/components/icons';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import { selectIsFavorite, toggleFavorite } from '@/store/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import styles from './FavoriteButton.module.scss';

interface FavoriteButtonProps {
  postId: string;
  variant?: FavoriteButtonVariant;
}

const FavoriteButton = ({
  postId,
  variant = FavoriteButtonVariant.Overlay,
}: FavoriteButtonProps) => {
  const isFavorite = useAppSelector(selectIsFavorite(postId));
  const dispatch = useAppDispatch();

  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  const isInline = variant === FavoriteButtonVariant.Inline;

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${isFavorite ? styles.active : ''}`}
      type="button"
      aria-pressed={isFavorite}
      aria-label={isInline ? undefined : label}
      title={isInline ? undefined : label}
      onClick={() => dispatch(toggleFavorite(postId))}
    >
      <StarIcon filled={isFavorite} />
      {isInline && <span>{isFavorite ? 'Favorited' : 'Add to favorites'}</span>}
    </button>
  );
};

export default FavoriteButton;
