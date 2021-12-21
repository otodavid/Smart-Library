import styles from "@styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <h5 className={styles.logo}>
          <span>Smart</span> Library
        </h5>
      </div>
      <div className={styles.bottom}>
        <p>
          Project for COMP 7570 - Blockchain Systems and Decentralized
          Applications
        </p>
        <p>University of Manitoba</p>
      </div>
    </footer>
  );
};

export default Footer;
