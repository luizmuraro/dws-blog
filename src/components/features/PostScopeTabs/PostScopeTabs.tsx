import { StarIcon } from '@/components/icons';
import { cx } from '@/utils/classNames';
import styles from './PostScopeTabs.module.scss';

interface PostScopeTabsProps {
  allCount: number;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onShowFavoritesOnlyChange: (showFavoritesOnly: boolean) => void;
}

const PostScopeTabs = ({
  allCount,
  favoritesCount,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
}: PostScopeTabsProps) => (
  <div className={styles.tabs} data-post-scope-tabs role="group" aria-label="Post scope">
    <button
      className={cx(styles.tab, !showFavoritesOnly && styles.active)}
      type="button"
      aria-pressed={!showFavoritesOnly}
      onClick={() => onShowFavoritesOnlyChange(false)}
    >
      <span className={styles.label}>All posts</span>
      <span className={styles.count}>{allCount}</span>
    </button>
    <button
      className={cx(styles.tab, showFavoritesOnly && styles.active)}
      type="button"
      aria-pressed={showFavoritesOnly}
      onClick={() => onShowFavoritesOnlyChange(true)}
    >
      <StarIcon className={styles.icon} filled />
      <span className={styles.label}>Favorites</span>
      <span className={styles.count}>{favoritesCount}</span>
    </button>
  </div>
);

export default PostScopeTabs;
