import React, { useEffect, useState } from "react";
import Booklist from "@components/Booklist";
import Layout from "@components/Layout";
import libraryRecord from "@ethereum/libraryRecord";
import data from "../../data.json";
import BorrowedBook from "@components/BorrowedBook";
import { ToastContainer} from "react-toastify";
import styles from "@styles/BooksPage.module.css";

export default function BooksPage({ borrowed }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [booksCount, setBooksCount] = useState(0);

  useEffect(() => {
    setBorrowedBooks(borrowed);

    setBooksCount(data.length);
  }, [borrowed]);

  return (
    <Layout>
      <section className={styles.books}>
        <div>
          <div className={styles.top}>
            <h2>Library Books</h2>
            <div className={styles.filter}>
              <button
                className={!isFiltered ? styles.filtered : ""}
                onClick={() => setIsFiltered(false)}
              >
                All
              </button>
              <button
                className={isFiltered ? styles.filtered : ""}
                onClick={() => setIsFiltered(true)}
              >
                Borrowed
              </button>
            </div>
          </div>

          <div className={styles.bottom}>
            {!isFiltered ? (
              <>
                <p>
                  <strong>All Books</strong>
                </p>
                <p>
                  <em>{booksCount} Books available</em>
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Borrowed Books</strong>
                </p>
                <p>
                  <em>{borrowedBooks.length} Book(s) unavailable</em>
                </p>
              </>
            )}

            {!isFiltered ? (
              <Booklist />
            ) : (
              borrowedBooks.length > 0 && (
                <div className={styles.borrowed}>
                  {borrowedBooks.map((book, index) => (
                    <BorrowedBook key={index} book={book} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <ToastContainer />
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const borrowed = await libraryRecord.methods.getBorrowedBooks().call();

  return {
    props: {
      borrowed,
    },
  };
};
