import type { Post } from '@/types/domain';
import { formatPostDate } from '@/utils/date';
import styles from './PostArticle.module.scss';

interface PostArticleProps {
  post: Post;
}

const PostArticle = ({ post }: PostArticleProps) => (
  <article className={styles.article}>
    <header className={styles.header}>
      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.author}>
        <img className={styles.avatar} src={post.author.profilePicture} alt="" />
        <div className={styles.authorText}>
          <p>
            Written by: <span className={styles.authorName}>{post.author.name}</span>
          </p>
          <time className={styles.date} dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </header>

    <img className={styles.cover} src={post.thumbnailUrl} alt={post.title} />

    {post.paragraphs.map((paragraph, index) => (
      <p className={styles.paragraph} key={index}>
        {paragraph}
      </p>
    ))}
  </article>
);

export default PostArticle;
