import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className={styles.wrapper} role="alert">
    <p>{message}</p>
    <button className={styles.retryButton} type="button" onClick={onRetry}>
      Try again
    </button>
  </div>
);

export default ErrorState;
