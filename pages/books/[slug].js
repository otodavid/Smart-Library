import React, { useEffect, useState } from "react";
import web3 from "@ethereum/web3";
import libraryRecord from "@ethereum/libraryRecord";
import Book from "@components/Book";
import Layout from "@components/Layout";
import data from "../../data.json";
import styles from "@styles/SingleBook.module.css";
import Spinner from "@components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig, toastPromise } from "utils/toastConfig";
import { useRouter } from "next/router";

export default function SingleBook({ bookTitle }) {
  const [book, setBook] = useState({ title: "", image: "", author: "" });
  const [borrow, setBorrow] = useState(false);
  const [duration, setDuration] = useState(1);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState({
    lateFees: 0,
    deposit: 0,
    totalFees: 0,
  });

  useEffect(() => {
    data.forEach((d) => {
      if (d.title === bookTitle) {
        setBook({ title: d.title, image: d.image, author: d.author });
      }
    });
  }, [bookTitle]);

  const handleContinue = async (e) => {
    e.preventDefault();

    const regex = /^\d+$/;

    if (duration === "") {
      toast.error("Please set a duration", toastConfig);
    } else if (!regex.test(parseInt(duration))) {
      toast.error("Please input a number", toastConfig);
    } else if (parseInt(duration) > 21) {
      toast.error("The maximum duration is 21 days", toastConfig);
    } else if (parseInt(duration) < 1) {
      toast.error("The minimum duration is 1 day", toastConfig);
    } else {
      setBorrow(true);
    }

    const accounts = await web3.eth.getAccounts();
    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(accounts[0])
      .call();

    const total = (Number(lateFees) + Number(deposit)).toString();

    setFeeDetails({
      lateFees: web3.utils.fromWei(lateFees, "ether"),
      deposit: web3.utils.fromWei(deposit, "ether"),
      totalFees: web3.utils.fromWei(total, "ether"),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(feeDetails.totalFees);

    try {
      const accounts = await web3.eth.getAccounts();
      const student = await libraryRecord.methods
        .registeredStudents(accounts[0])
        .call();

      if (student.outstanding) {
        toast.error("You have not returned a book", toastConfig);
      } else {
        await toast.promise(
          libraryRecord.methods
            .borrowBook(book.title, Number(duration) * 86400)
            .send({
              from: accounts[0],
              value: web3.utils.toWei(feeDetails.totalFees, "ether"),
            }),
          toastPromise,
          toastConfig
        );

        setTimeout(() => {
          router.push("/books");
        }, 2000);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message, toastConfig);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.borrowBook}>
        {book.title !== "" && (
          <section className={styles.singleBook}>
            <h1>{book.title}</h1>
            <div className={styles.bookImage}>
              <Book
                author={book.author}
                title={book.title}
                image={book.image}
              />
            </div>
            <section className={styles.details}>
              {!borrow ? (
                <>
                  <h3>Borrow this book</h3>
                  <form onSubmit={handleContinue} className={styles.duration}>
                    <label htmlFor="duration">Duration</label>
                    <input
                      type="text"
                      id="duration"
                      placeholder="Specify duration in days"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <button className={styles.borrowBtn} type="submit">
                      Continue
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <button
                    className={styles.backBtn}
                    onClick={() => setBorrow(false)}
                  >
                    Back
                  </button>
                  <h3>Transactions Details</h3>
                  <p>
                    Late Return Fees:{" "}
                    <strong>{feeDetails.lateFees} ethers</strong>
                  </p>
                  <p>
                    Deposit: <strong>{feeDetails.deposit} ethers</strong>
                  </p>
                  <p>
                    Total Fees: <strong>{feeDetails.totalFees} ethers</strong>
                  </p>
                  <form onSubmit={handleSubmit}>
                    <button
                      className={
                        isLoading
                          ? `${styles.borrowBtn} ${styles.disabled}`
                          : styles.borrowBtn
                      }
                    >
                      {" "}
                      {isLoading ? <Spinner /> : "Borrow book"}{" "}
                    </button>
                  </form>
                </>
              )}
            </section>
          </section>
        )}
      </div>

      <ToastContainer />
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const bookTitle = ctx.params.slug;

  return {
    props: {
      bookTitle,
    },
  };
};
