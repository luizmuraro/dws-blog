import { Link } from 'react-router-dom';
import { CategoryTagList, HighlightedText, PostMeta } from '@/components/ui';
import type { Post } from '@/types/domain';
import { formatPostDate } from '@/utils/date';
import styles from './SearchResultItem.module.scss';

interface SearchResultItemProps {
  post: Post;
  query: string;
  onSelect: () => void;
}

const SearchResultItem = ({ post, query, onSelect }: SearchResultItemProps) => (
  <article className={styles.item}>
    <img className={styles.thumbnail} src={post.thumbnailUrl} alt="" loading="lazy" />
    <div className={styles.content}>
      <h3 className={styles.title}>
        <Link className={styles.link} to={`/posts/${post.id}`} onClick={onSelect}>
          <HighlightedText text={post.title} query={query} />
        </Link>
      </h3>
      <PostMeta items={[post.author.name, formatPostDate(post.publishedAt)]} />
      <CategoryTagList categories={post.categories} />
    </div>
  </article>
);

export default SearchResultItem;
