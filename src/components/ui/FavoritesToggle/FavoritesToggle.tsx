import { StarIcon } from '@/components/icons';
import styles from './FavoritesToggle.module.scss';

interface FavoritesToggleProps {
  active: boolean;
  count: number;
  onToggle: () => void;
}

const FavoritesToggle = ({ active, count, onToggle }: FavoritesToggleProps) => (
  <button
    className={`${styles.toggle} ${active ? styles.active : ''}`}
    type="button"
    aria-pressed={active}
    onClick={onToggle}
  >
    <StarIcon className={styles.icon} filled={active} />
    <span className={styles.label}>Favorites</span>
    <span className={styles.count}>{count}</span>
  </button>
);

export default FavoritesToggle;
