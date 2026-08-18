import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => <p className={styles.message}>{message}</p>;

export default EmptyState;
