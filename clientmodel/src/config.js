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
  
        const contractAddress = "0x930b46EFA6b81A3099800092AF83dD9B586d9F04";

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

      const contractAddress = "0xC6226Fe04799a488cd1B22303C732D1069E305E6";

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
