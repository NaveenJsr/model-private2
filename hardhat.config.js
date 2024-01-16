// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.23",
//   networks: {
//     localhost: {
//       url: "HTTP://127.0.0.1:7545",
//     }
//   },
//   paths: {
//     artifacts: "./clientmodel/src/artifacts",
//   },
// };



require("@nomicfoundation/hardhat-toolbox");

// const INFURA_API_KEY = "b92d8f22539c489cb3be1f0a699133e6"; // Replace with your Infura API key

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/b92d8f22539c489cb3be1f0a699133e6`,
      accounts: ["17b52eb8214e353b1ebac7dc7f6bd1c8a8ff1e3d333d28042e84b04ac8625e30"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
