const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("deploying contracts with account:", deployer.address);

  const Identity = await hre.ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();

  const LOG = await hre.ethers.getContractFactory("LOG");
  const log = await LOG.deploy();
  
  const Generate_Shares = await hre.ethers.getContractFactory("Generate_Shares");
  const generateShare = await Generate_Shares.deploy();
  
  const Integrity = await hre.ethers.getContractFactory("Integrity");
  const integrity = await Integrity.deploy();

  const Generate_Key = await hre.ethers.getContractFactory("Generate_Key");
  const generateKey = await Generate_Key.deploy(generateShare.address);
  
  const ACL = await hre.ethers.getContractFactory("ACL");
  const acl = await ACL.deploy(integrity.address, identity.address);

  const CSP = await hre.ethers.getContractFactory("CSP");
  const csp = await CSP.deploy(identity.address, log.address, acl.address, integrity.address);

  const USER = await hre.ethers.getContractFactory("USER");
  const user = await USER.deploy(identity.address, csp.address, acl.address, integrity.address, generateShare.address, generateKey.address);

  console.log("CSP: ", csp.address);
  console.log("USER: ", user.address);
  console.log("identity: ", identity.address);
  console.log("ACL:", acl.address);
  console.log("LOG: ", log.address);
  console.log("file Integrity: ", integrity.address);
  console.log("Gen Share: ", generateShare.address);
  console.log("Gen Key: ", generateKey.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
