import styles from './PostCardSkeleton.module.scss';

const PostCardSkeleton = () => (
  <div className={styles.card} aria-hidden="true">
    <div className={styles.thumbnail} />
    <div className={styles.content}>
      <div className={styles.meta}>
        <span className={styles.line} />
      </div>
      <div className={styles.summary}>
        <div className={styles.title}>
          <span className={styles.line} />
          <span className={styles.line} />
        </div>
        <div className={styles.lead}>
          <span className={styles.line} />
          <span className={styles.line} />
        </div>
      </div>
      <div className={styles.categories}>
        <span className={styles.tag} />
      </div>
    </div>
  </div>
);

export default PostCardSkeleton;
