import styles from './BackgroundDecor.module.scss';

const BackgroundDecor = () => (
  <div className={styles.decor} aria-hidden="true">
    <span className={`${styles.blob} ${styles.teal}`} />
    <span className={`${styles.blob} ${styles.pink}`} />
    <span className={`${styles.blob} ${styles.blue}`} />
  </div>
);

export default BackgroundDecor;
