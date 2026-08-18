import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, ErrorState, PillButton } from '@/components/ui';
import { SearchVariant } from '@/constants/searchVariant';
import type { UsePostSearchResult } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { addRecentSearch } from '@/store/searchSlice';
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

const PREVIEW_LIMIT: Record<SearchVariant, number> = {
  [SearchVariant.Desktop]: 3,
  [SearchVariant.Mobile]: 4,
};

const SearchResults = ({ variant, search, resultsPath, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { term, results, isLoading, isPending, hasQuery, error, retry } = search;

  const isMobile = variant === SearchVariant.Mobile;
  const previewLimit = PREVIEW_LIMIT[variant];
  const previewedPosts = results.slice(0, previewLimit);
  const hasResults = hasQuery && !isLoading && !isPending && !error && results.length > 0;
  const hasMore = results.length > previewLimit;
  const hasFooter = hasResults && (isMobile || hasMore);

  const commitTerm = () => {
    dispatch(addRecentSearch(term));
    onClose();
  };

  const seeAllResults = () => {
    commitTerm();
    navigate(resultsPath);
  };

  const renderBody = () => {
    if (isLoading || isPending) return <SearchResultsSkeleton count={previewLimit} />;

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
            <SearchResultItem post={post} query={term} onSelect={commitTerm} />
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

      <div className={`${styles.body} ${isMobile && hasMore ? styles.bodyClipped : ''}`}>
        {renderBody()}
      </div>

      {hasFooter && (
        <div className={styles.footer}>
          {isMobile ? (
            <PillButton onClick={seeAllResults}>See all {results.length} results</PillButton>
          ) : (
            <>
              <Link className={styles.seeAll} to={resultsPath} onClick={commitTerm}>
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
