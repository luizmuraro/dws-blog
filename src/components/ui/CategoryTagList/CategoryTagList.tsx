import type { Category } from '@/types/domain';
import CategoryTag from '../CategoryTag/CategoryTag';
import styles from './CategoryTagList.module.scss';

interface CategoryTagListProps {
  categories: Category[];
}

const CategoryTagList = ({ categories }: CategoryTagListProps) => {
  if (categories.length === 0) return null;

  return (
    <ul className={styles.list}>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryTag name={category.name} />
        </li>
      ))}
    </ul>
  );
};

export default CategoryTagList;
