import React, { useEffect, useState } from "react";
import data from "../data.json";
import Book from "./Book";
import styles from "../styles/Booklist.module.css";

const Booklist = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks(data);
  }, []);

  return (
    <div className={styles.grid}>
      {books.length > 0 &&
        books.map((book, index) => (
          <Book
            title={book.title}
            author={book.author}
            image={book.image}
            key={index}
          />
        ))}
    </div>
  );
};

export default Booklist;
