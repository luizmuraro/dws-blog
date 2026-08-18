import { FavoritesToggle, FilterDropdown } from '@/components/ui';
import type { FilterOption } from '@/types/ui';
import styles from './FilterBar.module.scss';

interface FilterBarProps {
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

const FilterBar = ({
  categories,
  authors,
  selectedCategoryIds,
  selectedAuthorIds,
  showFavoritesOnly,
  favoritesCount,
  onCategoryChange,
  onAuthorChange,
  onFavoritesOnlyChange,
}: FilterBarProps) => (
  <div className={styles.bar} role="group" aria-label="Filters">
    <FilterDropdown
      label="Category"
      options={categories}
      selectedIds={selectedCategoryIds}
      onChange={onCategoryChange}
    />
    <FilterDropdown
      label="Author"
      options={authors}
      selectedIds={selectedAuthorIds}
      onChange={onAuthorChange}
    />
    <FavoritesToggle
      active={showFavoritesOnly}
      count={favoritesCount}
      onToggle={() => onFavoritesOnlyChange(!showFavoritesOnly)}
    />
  </div>
);

export default FilterBar;
