# Blockchain-based Secure Cloud Identity Management

## How to run 

1. clone the project
   ```bash
     git clone git@github.com:NaveenJsr/model-private2.git
   ```
2. deploy contract
   First, paste your meta mask private into  hardhat.config.js at the place of `PASTE YOUR METAMASK ACCOUNT PRIVATE KEY`

   ```bash
     cd model-private2
     npm install
     npx hardhat run --network goerli scripts/deploy.js
   ```
3. copy the USER and CSP contract address from bash and past into the `clientmodel/src/config.js` file at the place of the `paste USER/CSP contract address`
4. run application
   ```bash
     cd model-private2/clientmodel
     npm install
     npm start
   ```
