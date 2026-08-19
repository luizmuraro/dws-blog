import { FilterDropdown } from '@/components/ui';
import type { FilterSelection } from '@/types/ui';
import styles from './FilterBar.module.scss';

const FilterBar = ({
  categories,
  authors,
  selectedCategoryIds,
  selectedAuthorIds,
  onCategoryChange,
  onAuthorChange,
}: FilterSelection) => (
  <div className={styles.bar} role="group" aria-label="Filters" data-dropdown-group>
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
