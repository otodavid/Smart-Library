import Head from "next/head";
import Header from "./Header";
import styles from '../styles/Layout.module.css'
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>Smart Library</title>
        <meta
          name="description"
          content="Borrow your book of choice from a tested and trusted ethereum based library system"
        />
        <meta
          name="keywords"
          content="library, smart contract, ethereum smart contract"
        />
      </Head>

      <Header />
      <main className={styles.main}>{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
