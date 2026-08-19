export interface FilterOption {
  id: string;
  name: string;
}

/** The category/author selection shared by the filter bar and the sidebar. */
export interface FilterSelection {
  categories: FilterOption[];
  authors: FilterOption[];
  selectedCategoryIds: string[];
  selectedAuthorIds: string[];
  onCategoryChange: (selectedIds: string[]) => void;
  onAuthorChange: (selectedIds: string[]) => void;
}
