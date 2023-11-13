# Smart Library
This is my project for the course Comp 7570: Blockchain Systems and Decentralized Applications

## Tools and Technologies Used
- Solidity
- Infura
- Metamask
- Next.js
- Web3
- Smart contracts

##  Prerequisites
You would need the Metamask wallet extension installed and an Infura account

## Setting up the Project
To test this project on your computer, follow the following steps:
1. Download or clone this repository on your computer
2. Open the project folder, navigate into the `library-system` directory, and run

    ```text
   npm install
    ```

to install all dependencies

3. Inside the `library-system` directory, create a `.env.local` file
    - Follow the `env.example` file and have those variables ready
    
4. Go to <https://infura.io> on a new webpage and create an account.
    - Sign in and click on the Create New Project button
    - Select Ethereum as a product and give a name.
    - In the keys section, select rinkeby from the drop-down menu for the endpoints field
    - Add that key to your `.env.local` file.

5. Open <https://chrome.google.com/webstore/category/extensions> and search for metamask
    - install Metamask. You should be redirected to a Metamask page, if not, click on the fox icon
    - Create a new account by clicking create a wallet and following the signup procedures.
    - Save the mnemonic phrase you were given in a text file on your computer
    - Copy the phrase the `.env.local` file
    - Sign In to your Metamask wallet in your browser and click on the icon at the top right corner of the Metamask modal.
    - Create a new Account
    - Copy the address of that new account and paste it in the `.env.local` file

6.  Go to <https://faucet.rinkeby.io/> and follow the instructions to get ethers for your wallet
7.  Come back to your terminal and run 

  ```text
  npm run dev
  ```

##  Note
To run your own version of the smart contract on the Rinkeby test network, go to the  `library-system/ethereum`  directory on your terminal and run

```text
node compile.js
```

Then run 

```text
node deploy.js
```

Copy the address the contract was deployed to, navigate to `libraryRecord.js`, and replace the address there with yours.

##  View live project
-   To view the deployed project, go to <https://comp-7570-project.vercel.app/>
-   If you were not prompted to connect your Metamask wallet to the application, click on the Metamask icon and sign in. Then refresh the page.
 
