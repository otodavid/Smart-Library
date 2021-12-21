import web3 from "@ethereum/web3";
import libraryRecord from "@ethereum/libraryRecord";
import { GiReturnArrow } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig, toastPromise } from "utils/toastConfig";
import styles from "@styles/BorrowedBook.module.css";
import { useRouter } from "next/router";

const BorrowedBook = ({ book }) => {
  const router = useRouter();

  const handleReturn = async (e) => {
    try {
      const accounts = await web3.eth.getAccounts();

      const book = await libraryRecord.methods.borrowed(accounts[0]).call();

      const student =
        e.target.parentElement.parentElement.parentElement.firstElementChild
          .nextElementSibling.firstElementChild.lastElementChild.textContent;
      const UIBook =
        e.target.parentElement.parentElement.parentElement.firstElementChild
          .textContent;

      if (
        student !== accounts[0] ||
        book.title.toLowerCase() !== UIBook.toLowerCase()
      ) {
        toast.error("Unauthorized access", toastConfig);
      } else {
        await toast.promise(
          libraryRecord.methods
            .returnBook(accounts[0])
            .send({ from: accounts[0] }),
          toastPromise,
          toastConfig
        );

        setTimeout(() => {
          router.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message, toastConfig);
      console.log(error.message);
    }
  };

  const handleApprove = async (e) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const student =
        e.target.parentElement.parentElement.parentElement.firstElementChild
          .nextElementSibling.firstElementChild.lastElementChild.textContent;
      let isReturned = await libraryRecord.methods.borrowed(student).call();
      isReturned = isReturned.returned;

      const librarian = process.env.NEXT_PUBLIC_LIBRARIAN_ADDRESS;

      if (!isReturned) {
        toast.error("This book has not been returned", toastConfig);
      } else if (accounts[0] !== librarian) {
        toast.error("User not authorized for this action", toastConfig);
      } else {
        await toast.promise(
          libraryRecord.methods
            .validateReturn(librarian, true, student)
            .send({ from: librarian }),
          toastPromise,
          toastConfig
        );

        setTimeout(() => {
          router.reload();
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message, toastConfig);
      console.log(error.message);
    }
  };

  return (
    <div className={styles.borrowedBook}>
      <div className={styles.book}>
        <h3>{book[0]}</h3>

        <div className={styles.address}>
          <p>
            <strong>Students Address: </strong>
            <span>{book[1]}</span>
          </p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.action}>
            <p>
              <strong>Student Return</strong>
            </p>
            <button
              className={book[3] ? styles.returned : styles.returnBtn}
              onClick={(e) => handleReturn(e)}
            >
              Return &nbsp;
              <GiReturnArrow />
            </button>
          </div>

          <div className={styles.action}>
            <p>
              <strong>Librarian Approval</strong>
            </p>
            <button
              className={styles.approveBtn}
              onClick={(e) => handleApprove(e)}
            >
              Approve &nbsp;
              <AiOutlineCheckCircle />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBook;
