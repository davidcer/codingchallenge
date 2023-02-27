const {ALQ_API_URL, WALLET_SECRET_KEY} = require("dotenv").config().parsed;


require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: ALQ_API_URL,
      accounts: [`0x${WALLET_SECRET_KEY}`]
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};