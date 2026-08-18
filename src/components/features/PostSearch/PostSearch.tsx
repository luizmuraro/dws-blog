import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, CloseIcon, SearchIcon } from '@/components/icons';
import { SearchVariant } from '@/constants/searchVariant';
import { useDropdown, usePostSearch } from '@/hooks';
import { formatResultCount } from '@/utils/search';
import SearchResults from './SearchResults';
import styles from './PostSearch.module.scss';

const PostSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const committedTerm = searchParams.get('q') ?? '';

  const [term, setTerm] = useState(committedTerm);
  const [lastCommittedTerm, setLastCommittedTerm] = useState(committedTerm);

  const {
    isOpen: isPanelOpen,
    open: openPanel,
    close: closePanel,
    containerRef: panelContainerRef,
    triggerRef: desktopInputRef,
  } = useDropdown<HTMLInputElement>();

  const {
    isOpen: isOverlayOpen,
    open: openOverlay,
    close: closeOverlay,
    containerRef: overlayRef,
    triggerRef: overlayTriggerRef,
  } = useDropdown();

  const overlayInputRef = useRef<HTMLInputElement>(null);

  const search = usePostSearch(term);
  const resultsPath = `/?${createSearchParams({ q: term.trim() })}`;

  if (lastCommittedTerm !== committedTerm) {
    setLastCommittedTerm(committedTerm);
    setTerm(committedTerm);
  }

  useEffect(() => {
    if (isOverlayOpen) overlayInputRef.current?.focus();
  }, [isOverlayOpen]);

  useEffect(() => {
    if (!isOverlayOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOverlayOpen]);

  const updateTerm = (event: ChangeEvent<HTMLInputElement>) => setTerm(event.target.value);

  const updateDesktopTerm = (event: ChangeEvent<HTMLInputElement>) => {
    updateTerm(event);
    openPanel();
  };

  const clearTerm = () => {
    setTerm('');
    overlayInputRef.current?.focus();
  };

  const dismissOverlay = () => {
    closeOverlay();
    setTerm('');
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();

    if (!term.trim()) return;

    closePanel();
    closeOverlay();
    navigate(resultsPath);
  };

  const hasSettledResults = search.hasQuery && !search.isPending && !search.isLoading;

  return (
    <div className={styles.search}>
      <button
        className={styles.trigger}
        ref={overlayTriggerRef}
        type="button"
        aria-label="Open search"
        aria-expanded={isOverlayOpen}
        onClick={openOverlay}
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
            aria-label="Search posts"
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

        {isPanelOpen && search.hasQuery && (
          <SearchResults
            variant={SearchVariant.Desktop}
            search={search}
            resultsPath={resultsPath}
            onClose={closePanel}
          />
        )}
      </div>

      {isOverlayOpen && (
        <div className={styles.overlay} ref={overlayRef}>
          <form className={styles.mobileField} role="search" onSubmit={submitSearch}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Close search"
              onClick={dismissOverlay}
            >
              <ArrowLeftIcon />
            </button>
            <input
              className={styles.input}
              ref={overlayInputRef}
              type="search"
              placeholder="Search"
              aria-label="Search posts"
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

          <SearchResults
            variant={SearchVariant.Mobile}
            search={search}
            resultsPath={resultsPath}
            onClose={closeOverlay}
          />
        </div>
      )}

      <p className="visually-hidden" role="status">
        {hasSettledResults ? `${formatResultCount(search.results.length)} for ${search.term}` : ''}
      </p>
    </div>
  );
};

export default PostSearch;
