import web3 from "./web3";
import LibraryRecord from "./build/LibraryRecord.json";

const instance = new web3.eth.Contract(
  LibraryRecord.abi,
  "0x0D4f073E1AE469a96CAc4E0325A85EfA31027aC2"
);

export default instance;
