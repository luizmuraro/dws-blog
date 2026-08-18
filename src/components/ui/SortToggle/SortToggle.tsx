import { SortIcon } from '@/components/icons';
import { SortOrder } from '@/constants/sortOrder';
import styles from './SortToggle.module.scss';

interface SortToggleProps {
  order: SortOrder;
  onToggle: () => void;
}

const ORDER_LABELS: Record<SortOrder, string> = {
  [SortOrder.Newest]: 'Newest first',
  [SortOrder.Oldest]: 'Oldest first',
};

const SortToggle = ({ order, onToggle }: SortToggleProps) => (
  <div className={styles.sort}>
    <span className={styles.prefix}>Sort by:</span>
    <button className={styles.toggle} type="button" onClick={onToggle}>
      {ORDER_LABELS[order]}
      <span className={styles.icon}>
        <SortIcon />
      </span>
    </button>
  </div>
);

export default SortToggle;
