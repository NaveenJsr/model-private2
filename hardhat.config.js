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

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/b92d8f22539c489cb3be1f0a699133e6`,
      accounts: ["PASTE YOUR METAMASK ACCOUNT PRIVATE KEY"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
