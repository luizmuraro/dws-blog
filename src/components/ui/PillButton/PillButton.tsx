import type { ButtonHTMLAttributes } from 'react';
import styles from './PillButton.module.scss';

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const PillButton = (props: PillButtonProps) => (
  <button className={styles.pill} type="button" {...props} />
);

export default PillButton;
