import UserArtifact from "./artifacts/contracts/USER.sol/USER.json";
import CSPArtifact from "./artifacts/contracts/CSP.sol/CSP.json";
import integrityArtifact from "./artifacts/contracts/Integrity.sol/Integrity.json";
import aclArtifact from "./artifacts/contracts/ACL.sol/ACL.json";
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
  
        const contractAddress = "0xa13427402469B96EC3d09C277fcfE4E54D1A49bc";

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

      const contractAddress = "0xfFC90c6eBF844Ee518c68F4742EEcc99e9eFFe89";

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