import { Fragment } from 'react';
import styles from './PostMeta.module.scss';

interface PostMetaProps {
  items: string[];
}

const PostMeta = ({ items }: PostMetaProps) => (
  <p className={styles.meta}>
    {items.map((item, index) => (
      <Fragment key={index}>
        {index > 0 && <span className={styles.separator} aria-hidden="true" />}
        <span>{item}</span>
      </Fragment>
    ))}
  </p>
);

export default PostMeta;
