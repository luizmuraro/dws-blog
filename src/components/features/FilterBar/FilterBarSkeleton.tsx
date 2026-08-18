import styles from './FilterBar.module.scss';

const FilterBarSkeleton = () => (
  <div className={styles.bar} aria-hidden="true">
    <span className={styles.skeletonButton} />
    <span className={styles.skeletonButton} />
    <span className={styles.skeletonButton} />
  </div>
);

export default FilterBarSkeleton;
