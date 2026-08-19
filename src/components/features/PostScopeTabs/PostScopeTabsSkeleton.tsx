import styles from './PostScopeTabs.module.scss';

const PostScopeTabsSkeleton = () => (
  <div className={styles.tabs} data-post-scope-tabs aria-hidden="true">
    <span className={styles.skeletonTab} />
    <span className={styles.skeletonTab} />
  </div>
);

export default PostScopeTabsSkeleton;
