import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/Book.module.css";

const Book = ({ title, author, image }) => {
  return (
    <Link href={`/books/${title}`} passHref>
      <div className={styles.book}>
        <div className={styles.image}>
          <Image
            src={image}
            layout="responsive"
            objectPosition="center center"
            width={200}
            height={200}
            alt={title}
          />
        </div>
        <div className={styles.content}>
          <p>{title}</p>
          <span>{author}</span>
        </div>
      </div>
    </Link>
  );
};

export default Book;
