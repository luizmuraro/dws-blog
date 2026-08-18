import { useEffect, useState } from 'react';
import styles from './BackgroundDecor.module.scss';

const SETTLE_DELAY_MS = 150;

const BackgroundDecor = () => {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    let timeout = 0;

    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        observer.disconnect();
        setIsSettled(true);
      }, SETTLE_DELAY_MS);
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`${styles.decor} ${isSettled ? styles.settled : ''}`} aria-hidden="true">
      <span className={`${styles.blob} ${styles.teal}`} />
      <span className={`${styles.blob} ${styles.pink}`} />
      <span className={`${styles.blob} ${styles.blue}`} />
    </div>
  );
};

export default BackgroundDecor;
