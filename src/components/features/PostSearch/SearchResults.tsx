import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, PillButton } from '@/components/ui';
import { SearchVariant } from '@/constants/searchVariant';
import { MIN_SEARCH_LENGTH } from '@/hooks';
import type { UsePostSearchResult } from '@/hooks';
import { formatResultCount } from '@/utils/search';
import SearchResultItem from './SearchResultItem';
import SearchResultsSkeleton from './SearchResultsSkeleton';
import styles from './SearchResults.module.scss';

interface SearchResultsProps {
  variant: SearchVariant;
  search: UsePostSearchResult;
  resultsPath: string;
  onClose: () => void;
}

const DESKTOP_PREVIEW_LIMIT = 3;

const SKELETON_ROWS: Record<SearchVariant, number> = {
  [SearchVariant.Desktop]: DESKTOP_PREVIEW_LIMIT,
  [SearchVariant.Mobile]: 5,
};

const SearchResults = ({ variant, search, resultsPath, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();
  const { term, results, isLoading, isPending, hasQuery, error, retry } = search;

  const isMobile = variant === SearchVariant.Mobile;
  const previewedPosts = isMobile ? results : results.slice(0, DESKTOP_PREVIEW_LIMIT);
  const hasResults = hasQuery && !isLoading && !isPending && !error && results.length > 0;
  const hasFooter = hasResults && (isMobile || results.length > DESKTOP_PREVIEW_LIMIT);

  const seeAllResults = () => {
    onClose();
    navigate(resultsPath);
  };

  const renderBody = () => {
    if (!hasQuery) {
      return <p className={styles.hint}>Type at least {MIN_SEARCH_LENGTH} characters to search.</p>;
    }

    if (isLoading || isPending) return <SearchResultsSkeleton count={SKELETON_ROWS[variant]} />;

    if (error) {
      return (
        <div className={styles.state}>
          <ErrorState message="We could not load the posts." onRetry={retry} />
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className={styles.state}>
          <EmptyState message={`No posts found for “${term}”`} />
        </div>
      );
    }

    return (
      <ul className={styles.list}>
        {previewedPosts.map((post) => (
          <li key={post.id}>
            <SearchResultItem post={post} query={term} onSelect={onClose} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`${styles.panel} ${isMobile ? styles.panelMobile : styles.panelDesktop}`}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Posts</h2>
        {isMobile && hasResults && (
          <span className={styles.count}>{formatResultCount(results.length)}</span>
        )}
      </div>

      <div className={styles.body}>{renderBody()}</div>

      {hasFooter && (
        <div className={styles.footer}>
          {isMobile ? (
            <PillButton onClick={seeAllResults}>See all {results.length} results</PillButton>
          ) : (
            <>
              <Link className={styles.seeAll} to={resultsPath} onClick={onClose}>
                See all {results.length} results
              </Link>
              <span className={styles.shortcut} aria-hidden="true">
                ↵ enter
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
