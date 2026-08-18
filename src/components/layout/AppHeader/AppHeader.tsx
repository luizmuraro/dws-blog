import { Link } from 'react-router-dom';
import { PostSearch } from '@/components/features';
import { Logo } from '@/components/icons';
import styles from './AppHeader.module.scss';

const AppHeader = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <div className={styles.row}>
        <Link className={styles.logo} to="/" aria-label="DWS Blog home">
          <Logo />
        </Link>
        <PostSearch />
      </div>
    </div>
  </header>
);

export default AppHeader;
