const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
const libraryPath = path.resolve(__dirname, "contracts", "library-system.sol");
const source = fs.readFileSync(libraryPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "library-system.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "library-system.sol"
];

(function () {
  try {
    fs.removeSync(buildPath);
    fs.ensureDirSync(buildPath);

    for (let contract in output) {
      fs.outputJSONSync(
        path.resolve(buildPath, contract + ".json"),
        output[contract]
      );
      console.log("contract created successfully");
    }
  } catch (error) {
    console.log(error.message);
  }

  process.exit;
})();
