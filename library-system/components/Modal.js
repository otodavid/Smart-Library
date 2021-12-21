import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import styles from "../styles/Modal.module.css";

function Modal({ showModal, closeModal, title, children }) {
  const [isBrowser, setIsBrowser] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e) => {
    e.preventDefault();
    closeModal();
  };

  useOnClickOutside(modalRef, () => closeModal());

  const modalContent = showModal ? (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <p>{title}</p>
          <button className={styles.closeBtn}>
            <FaTimes onClick={handleClose} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}

export default Modal;
