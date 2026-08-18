import { useId } from 'react';
import { ChevronDownIcon, CloseIcon } from '@/components/icons';
import { useDropdown } from '@/hooks';
import type { FilterOption } from '@/types/ui';
import { toggleItem } from '@/utils/array';
import styles from './FilterDropdown.module.scss';

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

const FilterDropdown = ({ label, options, selectedIds, onChange }: FilterDropdownProps) => {
  const { isOpen, toggle, close, containerRef, triggerRef } = useDropdown();
  const panelId = useId();

  const selectedNames = options
    .filter((option) => selectedIds.includes(option.id))
    .map((option) => option.name);
  const hasSelection = selectedNames.length > 0;

  const clearSelection = () => {
    onChange([]);
    close();
  };

  return (
    <div className={styles.dropdown} ref={containerRef}>
      <div
        className={`${styles.control} ${isOpen ? styles.controlOpen : ''} ${hasSelection ? styles.controlSelected : ''}`}
      >
        <button
          className={styles.trigger}
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className={styles.label}>{hasSelection ? selectedNames.join(', ') : label}</span>
          {!hasSelection && (
            <span className={styles.icon}>
              <ChevronDownIcon />
            </span>
          )}
        </button>
        {hasSelection && (
          <button
            className={styles.clearButton}
            type="button"
            aria-label={`Clear ${label.toLowerCase()} filter`}
            onClick={clearSelection}
          >
            <span className={styles.icon}>
              <CloseIcon />
            </span>
          </button>
        )}
      </div>

      {isOpen && (
        <ul className={styles.panel} id={panelId} aria-label={label}>
          {options.map((option) => {
            const isSelected = selectedIds.includes(option.id);

            return (
              <li key={option.id}>
                <button
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange(toggleItem(selectedIds, option.id))}
                >
                  {option.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FilterDropdown;
