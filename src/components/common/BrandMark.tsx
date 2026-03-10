import logoMark from '@/assets/logo-mortarboard.svg';
import styles from './BrandMark.module.css';

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

const sizeClassName: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const BrandMark = ({ size = 'md', label = 'NJUPT 百事通' }: BrandMarkProps) => {
  return (
    <span className={`${styles.frame} ${sizeClassName[size]}`}>
      <img src={logoMark} alt={label} className={styles.logo} />
    </span>
  );
};
