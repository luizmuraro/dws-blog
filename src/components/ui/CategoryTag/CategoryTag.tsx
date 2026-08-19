import styles from './CategoryTag.module.scss';

interface CategoryTagProps {
  name: string;
  onClick?: () => void;
}

const CategoryTag = ({ name, onClick }: CategoryTagProps) =>
  onClick ? (
    <button className={`${styles.tag} ${styles.interactive}`} type="button" onClick={onClick}>
      {name}
    </button>
  ) : (
    <span className={styles.tag}>{name}</span>
  );

export default CategoryTag;
