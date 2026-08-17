import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <p className={styles.message}>{message}</p>;
}

export default EmptyState;
