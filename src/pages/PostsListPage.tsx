import { FilterBar, FilterBarSkeleton } from '@/components/features';
import { EmptyState, ErrorState, PostCard, PostCardSkeleton } from '@/components/ui';
import { usePostFilters, usePosts } from '@/hooks';
import styles from './PostsListPage.module.scss';

const SKELETON_COUNT = 6;

const PostsListPage = () => {
  const { data: posts, isLoading, error, retry } = usePosts();
  const {
    categoryOptions,
    authorOptions,
    selectedCategoryIds,
    selectedAuthorIds,
    setSelectedCategoryIds,
    setSelectedAuthorIds,
    filteredPosts,
  } = usePostFilters(posts);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div aria-busy="true">
          <p className="visually-hidden">Loading posts…</p>
          <div className={styles.grid}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return <ErrorState message="We could not load the posts." onRetry={retry} />;
    }

    if (filteredPosts.length === 0) {
      return <EmptyState message="No posts found" />;
    }

    return (
      <ul className={styles.grid}>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.heading}>DWS blog</h1>
      {isLoading ? (
        <FilterBarSkeleton />
      ) : (
        <FilterBar
          categories={categoryOptions}
          authors={authorOptions}
          selectedCategoryIds={selectedCategoryIds}
          selectedAuthorIds={selectedAuthorIds}
          onCategoryChange={setSelectedCategoryIds}
          onAuthorChange={setSelectedAuthorIds}
        />
      )}
      {renderContent()}
    </section>
  );
};

export default PostsListPage;
