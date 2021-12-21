import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

import styles from "../styles/Header.module.css";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.logo}>
          <h3>
            <span>Smart</span> Library
          </h3>
        </a>
      </Link>

      <div className={styles.menuBtn}>
        <button onClick={handleMenu}>
          <FaBars />{" "}
        </button>
      </div>

      <div
        className={
          isMenuOpen || isDesktopOrLaptop ? `${styles.sideMenu} ${styles.open}` : styles.sideMenu
        }
      >
        <div className={styles.closeMenuBtn}>
          <button onClick={handleMenu}>
            <FaTimes />{" "}
          </button>
        </div>

        {/* {isMenuOpen || isDesktopOrLaptop && ( */}
        <ul className={styles.nav}>
          <li>
            <Link href="/">
              <a
                className={
                  router.pathname === "/"
                    ? `${styles.menuLink} ${styles.active}`
                    : `${styles.menuLink}`
                }
              >
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/books">
              <a
                className={
                  router.pathname.includes("/books")
                    ? `${styles.menuLink} ${styles.active}`
                    : `${styles.menuLink}`
                }
              >
                Books
              </a>
            </Link>
          </li>
        </ul>
        {/* )} */}
        <div className={styles.login}>
          <button>Log in</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
