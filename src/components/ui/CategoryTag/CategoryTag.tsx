import { cx } from '@/utils/classNames';
import styles from './CategoryTag.module.scss';

interface CategoryTagProps {
  name: string;
  onClick?: () => void;
}

const CategoryTag = ({ name, onClick }: CategoryTagProps) =>
  onClick ? (
    <button className={cx(styles.tag, styles.interactive)} type="button" onClick={onClick}>
      {name}
    </button>
  ) : (
    <span className={styles.tag}>{name}</span>
  );

export default CategoryTag;
