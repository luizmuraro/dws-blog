import { useMemo } from 'react';
import { PostCard, PostCardSkeleton } from '@/components/ui';
import { usePosts } from '@/hooks';
import styles from './LatestArticles.module.scss';

interface LatestArticlesProps {
  currentPostId: string;
}

const LATEST_COUNT = 3;

const LatestArticles = ({ currentPostId }: LatestArticlesProps) => {
  const { data: posts, isLoading, error } = usePosts();

  const latestPosts = useMemo(() => {
    if (!posts) return [];

    return posts
      .filter((post) => post.id !== currentPostId)
      .toSorted((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, LATEST_COUNT);
  }, [posts, currentPostId]);

  if (error || (!isLoading && latestPosts.length === 0)) return null;

  return (
    <section className={styles.latest} aria-labelledby="latest-articles">
      <hr className={styles.separator} />
      <div className={styles.body}>
        <h2 className={styles.heading} id="latest-articles">
          Latest articles
        </h2>
        {isLoading ? (
          <div className={styles.grid} aria-busy="true">
            {Array.from({ length: LATEST_COUNT }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <ul className={styles.grid}>
            {latestPosts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default LatestArticles;
