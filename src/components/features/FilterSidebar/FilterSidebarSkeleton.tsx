import styles from './FilterSidebar.module.scss';

const SKELETON_OPTION_COUNT = 5;

const FilterSidebarSkeleton = () => (
  <div className={styles.sidebar} aria-hidden="true">
    <span className={styles.skeletonTitle} />
    {[0, 1].map((group) => (
      <div className={styles.group} key={group}>
        <span className={styles.skeletonLabel} />
        {Array.from({ length: SKELETON_OPTION_COUNT }, (_, index) => (
          <span className={styles.skeletonOption} key={index} />
        ))}
      </div>
    ))}
    <span className={styles.skeletonApply} />
  </div>
);

export default FilterSidebarSkeleton;
