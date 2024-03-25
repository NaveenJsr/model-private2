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
      accounts: ["3180f478b57744d5745d2109656ff7b365d0365d15998ed9c30a2c354fff7776"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
 