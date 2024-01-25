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
      accounts: ["de208dcfe43edc294ff14017a4b984e9e70d01d30abcf9a30dee4518f182bc07"],
    },
  },
  paths: {
    artifacts: "./clientmodel/src/artifacts",
  },
};
