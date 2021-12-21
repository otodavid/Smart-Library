// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

contract LibraryRecord {
    struct Details {
        string title;
        address student;
        uint256 returnTime;
        bool returned;
        uint256 bookIndex;
    }

    struct Student {
        address student;
        bool outstanding;
        uint256 lateReturns;
        bool registered;
        uint256 lateFee;
        uint256 totalFees;
    }

    mapping(address => uint256) public holdings;

    mapping(address => Details) public borrowed;
    Details[] public borrowedBooks;
    uint256 public bookIndex;

    mapping(address => Student) public registeredStudents;

    uint256 public deposit;

    constructor() {
        deposit = 5000000000000000;
    }

    function borrowBook(string memory _title, uint256 _duration)
        public
        payable
    {
        Student storage student = registeredStudents[msg.sender];

        // check for outstanding returns
        require(!student.outstanding, "Student has outstanding submissions");

        student.lateFee = checkLateReturnsCount(msg.sender);
        student.totalFees = deposit + student.lateFee;
        require(
            msg.sender.balance > student.totalFees,
            "Sorry, Insufficient Funds"
        );

        Details storage details = borrowed[msg.sender];
        details.title = _title;
        details.student = msg.sender;
        details.returnTime = _duration + block.timestamp;
        details.returned = false;
        details.bookIndex = bookIndex;
        borrowedBooks.push(details);

        if (!student.registered) {
            // add Student
            student.registered = true;
            student.student = msg.sender;
        }

        // add outstanding to prevent multiple borrowing
        registeredStudents[msg.sender].outstanding = true;

        holdings[msg.sender] = holdings[msg.sender] + student.totalFees;

        bookIndex++;
    }

    function checkLateReturnsCount(address _address)
        public
        view
        returns (uint256)
    {
        uint256 lateReturns = registeredStudents[_address].lateReturns;

        if (lateReturns <= 2) {
            return 0;
        } else if (lateReturns <= 5) {
            return 1000000000000000;
        } else if (lateReturns <= 7) {
            return 10000000000000000;
        } else {
            return 100000000000000000;
        }
    }

    function returnBook(address _student) public {
        Details storage returnedBook = borrowed[msg.sender];
        require(
            returnedBook.student == msg.sender,
            "You did not borrow this book"
        );
        require(msg.sender == _student, "Unauthorized access");
        require(!returnedBook.returned, "Book returned");
        returnedBook.returned = true;
        borrowedBooks[returnedBook.bookIndex].returned = true;

        Student storage borrower = registeredStudents[msg.sender];
        borrower.lateFee = 0;

        if (block.timestamp > returnedBook.returnTime) {
            // do not return money
            // add to late submissions
            borrower.lateReturns = borrower.lateReturns + 1;
        }
    }

    function validateReturn(
        address _librarian,
        bool _approve,
        address _student
    ) public {
        // address will be set in frontend code
        Details storage returnedBook = borrowed[_student];

        require(msg.sender == _librarian, "librarian priviledges only");
        require(returnedBook.returned, "Book not returned");
        Student storage borrower = registeredStudents[_student];

        if (_approve) {
            borrower.outstanding = false;

            // return money
            // address(this).balance - borrower.totalFees;
            payable(_student).transfer(holdings[_student]);

            // remove book from array
            borrowedBooks[returnedBook.bookIndex] = borrowedBooks[
                borrowedBooks.length - 1
            ];
            // Remove the last element
            borrowedBooks.pop();
        } else {
            returnedBook.returned = false;
            borrowedBooks[returnedBook.bookIndex].returned = false;

            //penalty for late submission
            borrower.lateReturns = borrower.lateReturns + 1;
            borrower.outstanding = true;
        }
    }

    function getBorrowedBooks() public view returns (Details[] memory) {
        return borrowedBooks;
    }
}