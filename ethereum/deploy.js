const dotenv = require("dotenv");
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./build/LibraryRecord.json");

dotenv.config({ path: path.resolve(__dirname, "../", ".env.local") });

const mnemonicPhrase = process.env.MNEMONIC_PHRASE;
const providerUrl = process.env.PROVIDER_URL;

let provider = new HDWalletProvider({
  mnemonic: { phrase: mnemonicPhrase },
  providerOrUrl: providerUrl,
});

const web3 = new Web3(provider);

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy contract from: ", accounts[0]);

    const libraryMill = await new web3.eth.Contract(abi)
      .deploy({ data: "0x" + evm.bytecode.object })
      .send({ from: accounts[0] });

    console.log("Contract deployed at address: ", libraryMill.options.address);
  } catch (error) {
    console.log("Contract deploy error: ", error);
  }
  // ENDING SCRIPT PROCESS
  process.exit();
})();
