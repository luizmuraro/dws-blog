import styles from './SearchResults.module.scss';

interface SearchResultsSkeletonProps {
  count: number;
}

const SearchResultsSkeleton = ({ count }: SearchResultsSkeletonProps) => (
  <div className={styles.skeletonList} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div className={styles.skeletonRow} key={index}>
        <span className={styles.skeletonThumbnail} />
        <div className={styles.skeletonText}>
          <span className={styles.skeletonTitle} />
          <span className={styles.skeletonMeta} />
          <span className={styles.skeletonTag} />
        </div>
      </div>
    ))}
  </div>
);

export default SearchResultsSkeleton;
