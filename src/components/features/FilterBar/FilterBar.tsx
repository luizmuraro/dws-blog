import { FilterDropdown } from '@/components/ui';
import type { FilterOption } from '@/types/ui';
import styles from './FilterBar.module.scss';

interface FilterBarProps {
  categories: FilterOption[];
  authors: FilterOption[];
  selectedCategoryIds: string[];
  selectedAuthorIds: string[];
  onCategoryChange: (selectedIds: string[]) => void;
  onAuthorChange: (selectedIds: string[]) => void;
}

const FilterBar = ({
  categories,
  authors,
  selectedCategoryIds,
  selectedAuthorIds,
  onCategoryChange,
  onAuthorChange,
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
  </div>
);

export default FilterBar;
