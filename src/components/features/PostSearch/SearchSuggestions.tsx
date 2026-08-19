import { Link } from 'react-router-dom';
import { CloseIcon, HistoryIcon } from '@/components/icons';
import { CategoryTag } from '@/components/ui';
import { SearchVariant } from '@/constants/searchVariant';
import type { UseCategoriesResult } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearRecentSearches, removeRecentSearch, selectRecentSearches } from '@/store/searchSlice';
import styles from './SearchSuggestions.module.scss';

interface SearchSuggestionsProps {
  variant: SearchVariant;
  categories: UseCategoriesResult;
  onSelectTerm: (term: string) => void;
  onSelectCategory: (name: string) => void;
  onClose: () => void;
}

const SKELETON_CHIP_COUNT = 5;

const SearchSuggestions = ({
  variant,
  categories: { categories, isLoading },
  onSelectTerm,
  onSelectCategory,
  onClose,
}: SearchSuggestionsProps) => {
  const dispatch = useAppDispatch();
  const recentSearches = useAppSelector(selectRecentSearches);

  const isMobile = variant === SearchVariant.Mobile;
  const hasRecent = recentSearches.length > 0;
  const hasCategories = isLoading || categories.length > 0;

  if (!hasRecent && !hasCategories) return null;

  return (
    <div className={`${styles.panel} ${isMobile ? styles.panelMobile : styles.panelDesktop}`}>
      <div className={styles.body}>
        {hasRecent && (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.heading}>Recent searches</h2>
              <button
                className={styles.clear}
                type="button"
                onClick={() => dispatch(clearRecentSearches())}
              >
                Clear
              </button>
            </div>

            <ul className={styles.list}>
              {recentSearches.map((recent) => (
                <li className={styles.item} key={recent}>
                  <button
                    className={styles.term}
                    type="button"
                    onClick={() => onSelectTerm(recent)}
                  >
                    <HistoryIcon className={styles.termIcon} />
                    {recent}
                  </button>
                  <button
                    className={styles.remove}
                    type="button"
                    aria-label={`Remove “${recent}” from recent searches`}
                    onClick={() => dispatch(removeRecentSearch(recent))}
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasCategories && (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.heading}>Browse by category</h2>
            </div>

            <div className={styles.categories}>
              {isLoading
                ? Array.from({ length: SKELETON_CHIP_COUNT }, (_, index) => (
                    <span className={styles.skeletonChip} key={index} />
                  ))
                : categories.map((category) => (
                    <CategoryTag
                      key={category.id}
                      name={category.name}
                      onClick={() => onSelectCategory(category.name)}
                    />
                  ))}
            </div>
          </section>
        )}
      </div>

      {!isMobile && (
        <div className={styles.footer}>
          <Link className={styles.browse} to="/" onClick={onClose}>
            Browse all posts
          </Link>
          <span className={styles.shortcut} aria-hidden="true">
            esc to close
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
