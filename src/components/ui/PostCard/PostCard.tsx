import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useLineCount } from '@/hooks';
import type { Post } from '@/types/domain';
import { formatPostDate } from '@/utils/date';
import { getLastName } from '@/utils/text';
import CategoryTag from '../CategoryTag/CategoryTag';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
}

const SUMMARY_LINES = 4;

const PostCard = ({ post }: PostCardProps) => {
  const [leadParagraph] = post.paragraphs;
  const { ref: titleRef, lineCount: titleLines } = useLineCount<HTMLHeadingElement>();

  return (
    <article className={styles.card}>
      <img className={styles.thumbnail} src={post.thumbnailUrl} alt={post.title} loading="lazy" />
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{formatPostDate(post.publishedAt)}</span>
          <div className={styles.separator} aria-hidden="true" />
          <span>{getLastName(post.author.name)}</span>
        </div>
        <div className={styles.summary}>
          <h3 className={styles.title} ref={titleRef}>
            <Link className={styles.link} to={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h3>
          {leadParagraph && (
            <p
              className={styles.lead}
              style={{ '--lead-lines': SUMMARY_LINES - titleLines } as CSSProperties}
            >
              {leadParagraph}
            </p>
          )}
        </div>
        {post.categories.length > 0 && (
          <ul className={styles.categories}>
            {post.categories.map((category) => (
              <li key={category.id}>
                <CategoryTag name={category.name} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

export default PostCard;
