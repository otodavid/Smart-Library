import styles from "@styles/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      &nbsp;
      <div className={styles.inner}></div>
    </div>
  );
};

export default Spinner;
