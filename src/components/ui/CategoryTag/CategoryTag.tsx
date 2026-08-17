import styles from './CategoryTag.module.scss';

interface CategoryTagProps {
  name: string;
}

function CategoryTag({ name }: CategoryTagProps) {
  return <span className={styles.tag}>{name}</span>;
}

export default CategoryTag;
