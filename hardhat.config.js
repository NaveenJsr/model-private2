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
      accounts: ["04b4ec4fffdbc4d56785d8dd2d29e9a6f407aae0acd3e75bfd3fcf5d3c0c9299"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
