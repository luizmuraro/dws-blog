import { SortIcon } from '@/components/icons';
import type { SortOrder } from '@/types/ui';
import styles from './SortToggle.module.scss';

interface SortToggleProps {
  order: SortOrder;
  onToggle: () => void;
}

const ORDER_LABELS: Record<SortOrder, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
};

const SortToggle = ({ order, onToggle }: SortToggleProps) => (
  <button className={styles.toggle} type="button" onClick={onToggle}>
    {ORDER_LABELS[order]}
    <span className={styles.icon}>
      <SortIcon />
    </span>
  </button>
);

export default SortToggle;
