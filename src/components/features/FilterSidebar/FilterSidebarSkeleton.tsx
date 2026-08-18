import styles from './FilterSidebar.module.scss';

const SKELETON_GROUPS = [1, 5, 5];

const FilterSidebarSkeleton = () => (
  <div className={styles.sidebar} aria-hidden="true">
    <span className={styles.skeletonTitle} />
    {SKELETON_GROUPS.map((optionCount, group) => (
      <div className={styles.group} key={group}>
        <span className={styles.skeletonLabel} />
        {Array.from({ length: optionCount }, (_, index) => (
          <span className={styles.skeletonOption} key={index} />
        ))}
      </div>
    ))}
    <span className={styles.skeletonApply} />
  </div>
);

export default FilterSidebarSkeleton;
