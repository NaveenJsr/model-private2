import UserArtifact from "./artifacts/contracts/USER.sol/USER.json";
import CSPArtifact from "./artifacts/contracts/CSP.sol/CSP.json";
import IdentityArtifact from "./artifacts/contracts/Identity.sol/Identity.json";
import GenerateShareArtifact from "./artifacts/contracts/Generate_Shares.sol/Generate_Shares.json";
import GenerateKeyArtifact from "./artifacts/contracts/Generate_Key.sol/Generate_Key.json";
import aclArtifact from "./artifacts/contracts/ACL.sol/ACL.json";
import logArtifact from "./artifacts/contracts/LOG.sol/LOG.json";
import fileIntegrityArtifact from "./artifacts/contracts/Integrity.sol/Integrity.json";
import { ethers } from "ethers";

export const getAccount = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      const signer = provider.getSigner();

      const address = await signer.getAddress();

      return address;
    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};

export const getUserContract = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
  
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        
        const signer = provider.getSigner();
  
        const contractAddress = "0x408928a988cbb44d5e2D7d353Ba32C062Bc5940c";

        const contract = new ethers.Contract(
          contractAddress,
          UserArtifact.abi,
          signer
        );

        return contract

      } else {
        throw new Error("Metamask not detected");
      }
    } catch (error) {
      console.error("Error fetching account:", error.message);
      return null; 
    }
};

export const getCSPContract = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      

      const signer = provider.getSigner();

      const contractAddress = "0x8c79EA272556CF0193e6d127486f75f883920F62";

      const contract = new ethers.Contract(
        contractAddress,
        CSPArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};

export const getIdentityContract = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      
      const signer = provider.getSigner();

      const contractAddress = "0x16147443B54f128d40338c774dFA83910DBb18E9";

      const contract = new ethers.Contract(
        contractAddress,
        IdentityArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};

export const gerACLcontract = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      
      const signer = provider.getSigner();

      const contractAddress = "0xAf71Bf2ecE859f2f4E5D514926ff4c01eBc14210";

      const contract = new ethers.Contract(
        contractAddress,
        aclArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};

export const gerLogContract = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      
      const signer = provider.getSigner();

      const contractAddress = "0xfDB78F28611aB19547AF684BE0772bbADA59DD2A";

      const contract = new ethers.Contract(
        contractAddress,
        logArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};


export const gerFileIntegrityContract = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      
      const signer = provider.getSigner();

      const contractAddress = "0xE402fe8eeaF9b0cFb8De0C3D7e16f67AF1A6dacB";

      const contract = new ethers.Contract(
        contractAddress,
        fileIntegrityArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};

export const getGenerateShare = async () => {
  try {
    if (window.ethereum) {

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      

      const signer = provider.getSigner();

      const contractAddress = "0x0008d20799525b84fb68A84F4556609983D711Da";

      const contract = new ethers.Contract(
        contractAddress,
        GenerateShareArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null;
  }
};

export const getGenerateKey = async () => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      const signer = provider.getSigner();

      const contractAddress = "0x40c759a10d05787C2E8b8af0b03E425ba7103237";

      const contract = new ethers.Contract(
        contractAddress,
        GenerateKeyArtifact.abi,
        signer
      );

      return contract

    } else {
      throw new Error("Metamask not detected");
    }
  } catch (error) {
    console.error("Error fetching account:", error.message);
    return null; 
  }
};