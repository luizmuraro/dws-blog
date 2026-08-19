import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, CloseIcon, SearchIcon } from '@/components/icons';
import { SearchVariant } from '@/constants/searchVariant';
import { useCategories, useDropdown, usePostSearch } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { addRecentSearch } from '@/store/searchSlice';
import { formatResultCount } from '@/utils/search';
import SearchResults from './SearchResults';
import SearchSuggestions from './SearchSuggestions';
import styles from './PostSearch.module.scss';

const PostSearch = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const desktopPanelId = useId();
  const mobilePanelId = useId();
  const committedTerm = searchParams.get('q') ?? '';

  const [term, setTerm] = useState(committedTerm);
  const [lastLocationKey, setLastLocationKey] = useState(location.key);

  const {
    isOpen: isPanelOpen,
    open: openPanel,
    close: closePanel,
    containerRef: panelContainerRef,
    triggerRef: desktopInputRef,
  } = useDropdown<HTMLInputElement>();

  const {
    isOpen: isMobileOpen,
    open: openMobile,
    close: closeMobile,
    containerRef: mobileContainerRef,
    triggerRef: mobileTriggerRef,
  } = useDropdown();

  const mobileInputRef = useRef<HTMLInputElement>(null);
  const wasMobileOpen = useRef(false);

  const search = usePostSearch(term);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories(isPanelOpen || isMobileOpen);
  // A failed category list just hides the chips; the panel still works without them.
  const suggestedCategories = categoriesError ? [] : categories;
  const resultsPath = `/?${createSearchParams({ q: term.trim() })}`;

  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key);
    setTerm(committedTerm);
  }

  useEffect(() => {
    if (isMobileOpen) {
      mobileInputRef.current?.focus();
      mobileInputRef.current?.select();
    } else if (wasMobileOpen.current) {
      mobileTriggerRef.current?.focus();
    }

    wasMobileOpen.current = isMobileOpen;
  }, [isMobileOpen, mobileTriggerRef]);

  const updateTerm = (event: ChangeEvent<HTMLInputElement>) => setTerm(event.target.value);

  const updateDesktopTerm = (event: ChangeEvent<HTMLInputElement>) => {
    updateTerm(event);
    openPanel();
  };

  const clearTerm = () => {
    setTerm('');
    mobileInputRef.current?.focus();
  };

  const collapseMobile = () => {
    closeMobile();
    setTerm(committedTerm);
  };

  const runSearch = (rawTerm: string) => {
    const trimmed = rawTerm.trim();

    if (!trimmed) return;

    dispatch(addRecentSearch(trimmed));
    setTerm(trimmed);
    closePanel();
    closeMobile();
    navigate(`/?${createSearchParams({ q: trimmed })}`);
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    runSearch(term);
  };

  const openCategory = (name: string) => {
    setTerm('');
    closePanel();
    closeMobile();
    navigate(`/?${createSearchParams({ category: name })}`);
  };

  const hasSettledResults = search.hasQuery && !search.isPending && !search.isLoading;

  return (
    <div className={styles.search} data-expanded={isMobileOpen}>
      <button
        className={styles.trigger}
        ref={mobileTriggerRef}
        type="button"
        aria-label="Open search"
        aria-expanded={isMobileOpen}
        onClick={openMobile}
      >
        <SearchIcon />
      </button>

      <div className={styles.desktop} ref={panelContainerRef}>
        <form className={styles.desktopField} role="search" onSubmit={submitSearch}>
          <input
            className={styles.input}
            ref={desktopInputRef}
            type="search"
            placeholder="Search"
            role="combobox"
            aria-label="Search posts"
            aria-haspopup="dialog"
            aria-expanded={isPanelOpen}
            aria-controls={isPanelOpen ? desktopPanelId : undefined}
            value={term}
            onChange={updateDesktopTerm}
            onFocus={openPanel}
          />
          {hasSettledResults && !search.error && (
            <span className={styles.count}>{formatResultCount(search.results.length)}</span>
          )}
          <button className={styles.submit} type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {isPanelOpen &&
          (search.hasQuery ? (
            <SearchResults
              id={desktopPanelId}
              variant={SearchVariant.Desktop}
              search={search}
              resultsPath={resultsPath}
              onClose={closePanel}
            />
          ) : (
            <SearchSuggestions
              id={desktopPanelId}
              variant={SearchVariant.Desktop}
              categories={suggestedCategories}
              isCategoriesLoading={isCategoriesLoading}
              onSelectTerm={runSearch}
              onSelectCategory={openCategory}
              onClose={closePanel}
            />
          ))}
      </div>

      {isMobileOpen && (
        <div className={styles.mobile} ref={mobileContainerRef}>
          <form className={styles.mobileField} role="search" onSubmit={submitSearch}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Close search"
              onClick={collapseMobile}
            >
              <ArrowLeftIcon />
            </button>
            <input
              className={styles.input}
              ref={mobileInputRef}
              type="search"
              placeholder="Search"
              role="combobox"
              aria-label="Search posts"
              aria-haspopup="dialog"
              aria-expanded
              aria-controls={mobilePanelId}
              value={term}
              onChange={updateTerm}
            />
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Clear search"
              onClick={clearTerm}
            >
              <CloseIcon />
            </button>
          </form>

          {search.hasQuery ? (
            <SearchResults
              id={mobilePanelId}
              variant={SearchVariant.Mobile}
              search={search}
              resultsPath={resultsPath}
              onClose={closeMobile}
            />
          ) : (
            <SearchSuggestions
              id={mobilePanelId}
              variant={SearchVariant.Mobile}
              categories={suggestedCategories}
              isCategoriesLoading={isCategoriesLoading}
              onSelectTerm={runSearch}
              onSelectCategory={openCategory}
              onClose={closeMobile}
            />
          )}
        </div>
      )}

      <p className="visually-hidden" role="status">
        {hasSettledResults ? `${formatResultCount(search.results.length)} for ${search.term}` : ''}
      </p>
    </div>
  );
};

export default PostSearch;
