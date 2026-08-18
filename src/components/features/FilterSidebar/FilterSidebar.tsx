import { useId, useState } from 'react';
import { FiltersIcon } from '@/components/icons';
import { PillButton } from '@/components/ui';
import type { FilterOption } from '@/types/ui';
import { toggleItem } from '@/utils/array';
import styles from './FilterSidebar.module.scss';

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
}

const FilterGroup = ({ label, options, selectedIds, onToggle }: FilterGroupProps) => {
  const labelId = useId();

  return (
    <div className={styles.group}>
      <h3 className={styles.groupLabel} id={labelId}>
        {label}
      </h3>
      <ul className={styles.options} aria-labelledby={labelId}>
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);

          return (
            <li key={option.id}>
              <button
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(option.id)}
              >
                {option.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface Selection {
  categoryIds: string[];
  authorIds: string[];
  favoritesOnly: boolean;
}

interface FilterSidebarProps {
  categories: FilterOption[];
  authors: FilterOption[];
  selectedCategoryIds: string[];
  selectedAuthorIds: string[];
  showFavoritesOnly: boolean;
  favoritesCount: number;
  onCategoryChange: (selectedIds: string[]) => void;
  onAuthorChange: (selectedIds: string[]) => void;
  onFavoritesOnlyChange: (showFavoritesOnly: boolean) => void;
}

const FAVORITES_OPTION_ID = 'favorites';

const FilterSidebar = ({
  categories,
  authors,
  selectedCategoryIds,
  selectedAuthorIds,
  showFavoritesOnly,
  favoritesCount,
  onCategoryChange,
  onAuthorChange,
  onFavoritesOnlyChange,
}: FilterSidebarProps) => {
  const applied: Selection = {
    categoryIds: selectedCategoryIds,
    authorIds: selectedAuthorIds,
    favoritesOnly: showFavoritesOnly,
  };
  const [draft, setDraft] = useState<Selection>(applied);
  const [lastApplied, setLastApplied] = useState<Selection>(applied);

  if (
    lastApplied.categoryIds !== applied.categoryIds ||
    lastApplied.authorIds !== applied.authorIds ||
    lastApplied.favoritesOnly !== applied.favoritesOnly
  ) {
    setLastApplied(applied);
    setDraft(applied);
  }

  const toggleCategory = (optionId: string) =>
    setDraft((current) => ({ ...current, categoryIds: toggleItem(current.categoryIds, optionId) }));

  const toggleAuthor = (optionId: string) =>
    setDraft((current) => ({ ...current, authorIds: toggleItem(current.authorIds, optionId) }));

  const toggleFavoritesOnly = () =>
    setDraft((current) => ({ ...current, favoritesOnly: !current.favoritesOnly }));

  const applyFilters = () => {
    onCategoryChange(draft.categoryIds);
    onAuthorChange(draft.authorIds);
    onFavoritesOnlyChange(draft.favoritesOnly);
  };

  const clearFilters = () => {
    setDraft({ categoryIds: [], authorIds: [], favoritesOnly: false });
    onCategoryChange([]);
    onAuthorChange([]);
    onFavoritesOnlyChange(false);
  };

  const hasFilters =
    draft.categoryIds.length > 0 ||
    draft.authorIds.length > 0 ||
    draft.favoritesOnly ||
    applied.categoryIds.length > 0 ||
    applied.authorIds.length > 0 ||
    applied.favoritesOnly;

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>
            <FiltersIcon />
          </span>
          Filters
        </h2>
        {hasFilters && (
          <button className={styles.clear} type="button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <FilterGroup
        label="Favorites"
        options={[{ id: FAVORITES_OPTION_ID, name: `Only favorites (${favoritesCount})` }]}
        selectedIds={draft.favoritesOnly ? [FAVORITES_OPTION_ID] : []}
        onToggle={toggleFavoritesOnly}
      />

      {categories.length > 0 && (
        <FilterGroup
          label="Category"
          options={categories}
          selectedIds={draft.categoryIds}
          onToggle={toggleCategory}
        />
      )}
      {authors.length > 0 && (
        <FilterGroup
          label="Author"
          options={authors}
          selectedIds={draft.authorIds}
          onToggle={toggleAuthor}
        />
      )}

      <PillButton onClick={applyFilters}>Apply filters</PillButton>
    </aside>
  );
};

export default FilterSidebar;
