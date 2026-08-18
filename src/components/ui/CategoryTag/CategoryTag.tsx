import styles from './CategoryTag.module.scss';

interface CategoryTagProps {
  name: string;
}

const CategoryTag = ({ name }: CategoryTagProps) => <span className={styles.tag}>{name}</span>;

export default CategoryTag;
