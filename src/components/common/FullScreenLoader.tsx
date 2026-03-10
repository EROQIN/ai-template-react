import styles from './FullScreenLoader.module.css';

type FullScreenLoaderProps = {
  message?: string;
};

export const FullScreenLoader = ({ message = '正在加载' }: FullScreenLoaderProps) => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.spinner} />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

