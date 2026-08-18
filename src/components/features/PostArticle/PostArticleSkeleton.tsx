import styles from './PostArticle.module.scss';

const SKELETON_PARAGRAPH_COUNT = 3;
const SKELETON_LINE_COUNT = 4;

const PostArticleSkeleton = () => (
  <div className={styles.article} aria-hidden="true">
    <div className={styles.header}>
      <span className={styles.skeletonTitle} />

      <div className={styles.byline}>
        <div className={styles.author}>
          <span className={styles.skeletonAvatar} />
          <div className={styles.authorText}>
            <span className={styles.skeletonAuthorLine} />
            <span className={styles.skeletonAuthorLine} />
          </div>
        </div>

        <span className={styles.skeletonFavorite} />
      </div>
    </div>

    <span className={styles.skeletonCover} />

    {Array.from({ length: SKELETON_PARAGRAPH_COUNT }, (_, paragraph) => (
      <div className={styles.skeletonParagraph} key={paragraph}>
        {Array.from({ length: SKELETON_LINE_COUNT }, (_, line) => (
          <span className={styles.skeletonLine} key={line} />
        ))}
      </div>
    ))}
  </div>
);

export default PostArticleSkeleton;
