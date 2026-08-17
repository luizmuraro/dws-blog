import type { ReactNode } from 'react';
import { EmptyState, PostCard, PostCardSkeleton } from '@/components/ui';
import { usePosts } from '@/hooks';
import styles from './PostsListPage.module.scss';

const SKELETON_COUNT = 6;

function PostsListPage() {
  const { data: posts, isLoading, error, retry } = usePosts();

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div aria-busy="true">
        <p className="visually-hidden">Loading posts…</p>
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className={styles.error} role="alert">
        <p>We could not load the posts.</p>
        <button className={styles.retryButton} type="button" onClick={retry}>
          Try again
        </button>
      </div>
    );
  } else if (!posts || posts.length === 0) {
    content = <EmptyState message="No posts found" />;
  } else {
    content = (
      <ul className={styles.grid}>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>DWS blog</h1>
      {content}
    </section>
  );
}

export default PostsListPage;
