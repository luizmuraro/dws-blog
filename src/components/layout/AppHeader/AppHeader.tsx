import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CloseIcon, Logo, SearchIcon } from '@/components/icons';
import styles from './AppHeader.module.scss';

const AppHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const openSearch = () => setIsSearchOpen(true);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setTerm('');
  };

  const clearTerm = () => {
    setTerm('');
    mobileInputRef.current?.focus();
  };

  const updateTerm = (event: ChangeEvent<HTMLInputElement>) => setTerm(event.target.value);

  const preventSubmit = (event: FormEvent) => event.preventDefault();

  return (
    <header className={styles.header}>
      {isSearchOpen && (
        <form className={styles.mobileSearch} role="search" onSubmit={preventSubmit}>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
          >
            <ArrowLeftIcon />
          </button>
          <input
            className={styles.input}
            ref={mobileInputRef}
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
      )}

      <div className={`${styles.row} ${isSearchOpen ? styles.rowSearching : ''}`}>
        <Link className={styles.logo} to="/" aria-label="DWS Blog home">
          <Logo />
        </Link>

        <button
          className={styles.searchTrigger}
          type="button"
          aria-label="Open search"
          onClick={openSearch}
        >
          <SearchIcon />
        </button>

        <form className={styles.desktopSearch} role="search" onSubmit={preventSubmit}>
          <input
            className={styles.input}
            type="search"
            placeholder="Search"
            aria-label="Search posts"
            value={term}
            onChange={updateTerm}
          />
          <button className={styles.searchSubmit} type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>
      </div>
    </header>
  );
};

export default AppHeader;
