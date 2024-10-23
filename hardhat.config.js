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
    sepolia: {
      url: `https://sepolia.infura.io/v3/b92d8f22539c489cb3be1f0a699133e6`,
      accounts: ["4b95ed8de50a3fa2a213a74e48bcab6eec8e669492cf655dd357876daff4f60d"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
 