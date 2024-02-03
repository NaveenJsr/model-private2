import UserArtifact from "./artifacts/contracts/USER.sol/USER.json";
import CSPArtifact from "./artifacts/contracts/CSP.sol/CSP.json";
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
  
        const contractAddress = "paste USER contract address";

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

      const contractAddress = "paste CSP contract address";

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
