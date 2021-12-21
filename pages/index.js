import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Booklist from "../components/Booklist";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import styles from "../styles/Home.module.css";
{
  /* <a href="https://storyset.com/education">Education illustrations by Storyset</a> */
}

export default function Home() {
  const [bookTitle, setBookTitle] = useState("");

  return (
    <Layout>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1>Redefined Library Access</h1>
          <p>
            Borrow books from your favorite physical library with our
            tried-and-true blockchain solution
          </p>
          <Link href="/books">
            <a>View All</a>
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/book-lover.gif"
            width={1000}
            height={1000}
            objectPosition="top center"
            alt="girl reading book"
          />
        </div>
      </div>
      <section className={styles.bookList}>
        <h2>You can borrow books with ease</h2>
        <Booklist />
      </section>
    </Layout>
  );
}
