import { Link, useSearchParams } from 'react-router-dom';
import {
  FilterBar,
  FilterBarSkeleton,
  FilterSidebar,
  FilterSidebarSkeleton,
} from '@/components/features';
import {
  EmptyState,
  ErrorState,
  PostCard,
  PostCardSkeleton,
  SortToggle,
  SortToggleSkeleton,
} from '@/components/ui';
import { usePostFilters, usePosts } from '@/hooks';
import styles from './PostsListPage.module.scss';

const SKELETON_COUNT = 6;

const PostsListPage = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category') ?? '';

  const { data: posts, isLoading, error, retry } = usePosts();
  const {
    categoryOptions,
    authorOptions,
    selectedCategoryIds,
    selectedAuthorIds,
    setSelectedCategoryIds,
    setSelectedAuthorIds,
    showFavoritesOnly,
    setShowFavoritesOnly,
    favoritesCount,
    hasOptions,
    sortOrder,
    toggleSortOrder,
    visiblePosts,
  } = usePostFilters(posts, searchTerm, categoryParam);

  const renderFilters = () => {
    if (isLoading) return <FilterBarSkeleton />;

    if (!hasOptions) return null;

    return (
      <FilterBar
        categories={categoryOptions}
        authors={authorOptions}
        selectedCategoryIds={selectedCategoryIds}
        selectedAuthorIds={selectedAuthorIds}
        showFavoritesOnly={showFavoritesOnly}
        favoritesCount={favoritesCount}
        onCategoryChange={setSelectedCategoryIds}
        onAuthorChange={setSelectedAuthorIds}
        onFavoritesOnlyChange={setShowFavoritesOnly}
      />
    );
  };

  const renderSidebar = () => {
    if (isLoading) return <FilterSidebarSkeleton />;

    if (!hasOptions) return null;

    return (
      <FilterSidebar
        categories={categoryOptions}
        authors={authorOptions}
        selectedCategoryIds={selectedCategoryIds}
        selectedAuthorIds={selectedAuthorIds}
        showFavoritesOnly={showFavoritesOnly}
        favoritesCount={favoritesCount}
        onCategoryChange={setSelectedCategoryIds}
        onAuthorChange={setSelectedAuthorIds}
        onFavoritesOnlyChange={setShowFavoritesOnly}
      />
    );
  };

  const getEmptyMessage = () => {
    if (showFavoritesOnly) {
      return favoritesCount === 0
        ? 'You have not favorited any posts yet. Tap the star on a post to save it here.'
        : 'No favorites match the current filters.';
    }

    return searchTerm ? `No posts found for “${searchTerm}”` : 'No posts found';
  };

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

    if (visiblePosts.length === 0) {
      return <EmptyState message={getEmptyMessage()} />;
    }

    return (
      <ul className={styles.grid}>
        {visiblePosts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.heading}>DWS blog</h1>
        {renderFilters()}
        {isLoading ? (
          <SortToggleSkeleton />
        ) : (
          <SortToggle order={sortOrder} onToggle={toggleSortOrder} />
        )}
      </div>
      {searchTerm && (
        <p className={styles.searchSummary}>
          Results for <strong className={styles.searchTerm}>“{searchTerm}”</strong>
          <Link className={styles.clearSearch} to="/">
            Clear search
          </Link>
        </p>
      )}
      <div className={styles.layout}>
        {renderSidebar()}
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </section>
  );
};

export default PostsListPage;
