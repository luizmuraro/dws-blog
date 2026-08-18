import styles from './SortToggle.module.scss';

const SortToggleSkeleton = () => (
  <div className={styles.skeleton} aria-hidden="true">
    <span className={styles.skeletonPrefix} />
    <span className={styles.skeletonLabel} />
    <span className={styles.skeletonIcon} />
  </div>
);

export default SortToggleSkeleton;
