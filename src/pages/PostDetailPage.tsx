import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LatestArticles, PostArticle, PostArticleSkeleton } from '@/components/features';
import { BackButton, EmptyState, ErrorState } from '@/components/ui';
import { usePost } from '@/hooks';
import styles from './PostDetailPage.module.scss';

const PostDetailPage = () => {
  const { id = '' } = useParams();
  const { data: post, isLoading, error, retry } = usePost(id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const renderArticle = () => {
    if (isLoading) {
      return (
        <div aria-busy="true">
          <p className="visually-hidden">Loading post…</p>
          <PostArticleSkeleton />
        </div>
      );
    }

    if (error) {
      return <ErrorState message="We could not load this post." onRetry={retry} />;
    }

    if (!post) {
      return <EmptyState message="Post not found" />;
    }

    return <PostArticle post={post} />;
  };

  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <BackButton />
      </div>
      <div className={styles.main}>
        {renderArticle()}
        {post && <LatestArticles currentPostId={post.id} />}
      </div>
    </div>
  );
};

export default PostDetailPage;
