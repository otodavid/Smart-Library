const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { it } = require("mocha");
const provider = ganache.provider();
const web3 = new Web3(provider);
const compiledRecords = require("../ethereum/build/LibraryRecord.json");

let accounts;
let libraryRecord;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  libraryRecord = await new web3.eth.Contract(compiledRecords.abi)
    .deploy({
      data: `0x${compiledRecords.evm.bytecode.object}`,
    })
    .send({ from: accounts[0], gas: "6500000" });
});

describe("Library Record", () => {
  it("deploys the library record", () => {
    assert.ok(libraryRecord.options.address);
  });

  it("student has sufficient balance", async () => {
    let student = accounts[0];
    let deposit = await libraryRecord.methods.deposit().call();
    let balance = await web3.eth.getBalance(student);
    assert.ok(web3.utils.toWei(balance, "ether") > deposit);
  });

  it("can borrow book", async () => {
    let student = accounts[0];
    let title = "The Relic";
    let duration = 60;

    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(student)
      .call();

    const fees = (Number(deposit) + Number(lateFees)).toString();

    await libraryRecord.methods
      .borrowBook(title, duration)
      .send({ from: accounts[0], gas: "6500000", value: fees });

      let studentData = await libraryRecord.methods
      .registeredStudents(student)
      .call();
    const outstanding = studentData.outstanding;

    const borrowedBooks = await libraryRecord.methods
      .borrowed(accounts[0])
      .call();

    assert.strictEqual(title, borrowedBooks.title);
    assert.strictEqual(student, borrowedBooks.student);
    assert.strictEqual(false, borrowedBooks.returned);
    assert.strictEqual(true, outstanding);
  });

  it("can return book", async () => {
    let student = accounts[0];
    let title = "The Relic";
    let duration = 60;

    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(student)
      .call();

    const fees = (Number(deposit) + Number(lateFees)).toString();

    await libraryRecord.methods
      .borrowBook(title, duration)
      .send({ from: student, gas: "6500000", value: fees });

    let studentData = await libraryRecord.methods
      .registeredStudents(student)
      .call();
    const outstanding = studentData.outstanding;

    await libraryRecord.methods
      .returnBook(student)
      .send({ from: student, gas: "6500000" });

    const borrowedBooks = await libraryRecord.methods.borrowed(student).call();

    assert.strictEqual(true, borrowedBooks.returned);
    assert.strictEqual(true, outstanding);
  });

  it("can approve return", async () => {
    let student = accounts[0];
    let title = "The Relic";
    let duration = 60;

    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(student)
      .call();

    const fees = (Number(deposit) + Number(lateFees)).toString();

    await libraryRecord.methods
      .borrowBook(title, duration)
      .send({ from: student, gas: "6500000", value: fees });

    await libraryRecord.methods
      .returnBook(student)
      .send({ from: student, gas: "6500000" });

    await libraryRecord.methods
      .validateReturn(accounts[1], true, student)
      .send({ from: accounts[1], gas: "6500000" });

    const borrowedBooks = await libraryRecord.methods.borrowed(student).call();
    let studentData = await libraryRecord.methods
      .registeredStudents(student)
      .call();

    assert.strictEqual(true, borrowedBooks.returned);
    assert.strictEqual(false, studentData.outstanding);
  });

  it("can't approve return", async () => {
    let student = accounts[0];
    let title = "The Relic";
    let duration = 60;

    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(student)
      .call();

    const fees = (Number(deposit) + Number(lateFees)).toString();

    await libraryRecord.methods
      .borrowBook(title, duration)
      .send({ from: student, gas: "6500000", value: fees });

    await libraryRecord.methods
      .returnBook(student)
      .send({ from: student, gas: "6500000" });

    await libraryRecord.methods
      .validateReturn(accounts[1], true, student)
      .send({ from: accounts[0], gas: "6500000" });

      // should fail
  });

  it("student money is returned", async () => {
    let student = accounts[0];
    let title = "The Relic";
    let duration = 60;

    const deposit = await libraryRecord.methods.deposit().call();
    const lateFees = await libraryRecord.methods
      .checkLateReturnsCount(student)
      .call();

    const fees = (Number(deposit) + Number(lateFees)).toString();

    await libraryRecord.methods
      .borrowBook(title, duration)
      .send({ from: student, gas: "6500000", value: fees });

    const initialBal = await web3.eth.getBalance(student)

    await libraryRecord.methods
      .returnBook(student)
      .send({ from: student, gas: "6500000" });

    await libraryRecord.methods
      .validateReturn(accounts[1], true, student)
      .send({ from: accounts[1], gas: "6500000" });

    const finalBal = await web3.eth.getBalance(student)
    
    assert(finalBal > initialBal)
  });
});
