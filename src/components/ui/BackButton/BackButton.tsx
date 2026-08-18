import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@/components/icons';
import styles from './BackButton.module.scss';

const BackButton = () => {
  const navigate = useNavigate();
  const { key } = useLocation();

  const goBack = () => {
    if (key === 'default') {
      navigate('/');
      return;
    }

    navigate(-1);
  };

  return (
    <button className={styles.button} type="button" onClick={goBack}>
      <span className={styles.icon}>
        <ArrowBackIcon />
      </span>
      Back
    </button>
  );
};

export default BackButton;
