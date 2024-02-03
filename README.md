# Blockchain-based Secure Cloud Identity Management

## How to run 

1. Clone the project:
   ```bash
     git clone git@github.com:NaveenJsr/model-private2.git
   ```
2. Deploy the contract:
   First, paste your METAMASK private key into hardhat.config.js where it says PASTE YOUR METAMASK ACCOUNT PRIVATE KEY.
   ```bash
     cd model-private2
     npm install
     npx hardhat run --network goerli scripts/deploy.js
   ```
4. Copy the USER and CSP contract addresses from the console and paste them into the clientmodel/src/config.js file where it says paste USER/CSP contract address.
5. Run the application
   ```bash
     cd model-private2/clientmodel
     npm install
     npm start
   ```
