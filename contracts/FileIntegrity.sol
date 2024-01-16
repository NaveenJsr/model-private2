// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Strin {
    using Strings for uint256;

    function toString(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

contract FileIntegrity {

    address contractOwner;
    Strin stringUtils = new Strin();

    constructor() {
        contractOwner = msg.sender;
    }

    struct RegFile {
        address csp;
        string fileHash;
        string createdAt;
    }

    mapping (address => RegFile[]) registeredFiles;

    function registerFile(address _user, address _csp, string memory fileHash) external {
        RegFile memory newFile;
        newFile.csp = _csp;
        newFile.fileHash = fileHash;
        newFile.createdAt = stringUtils.toString(block.timestamp);
        registeredFiles[_user].push(newFile);
    }

    function getRegFiles(address user) external view returns (RegFile[] memory) {
        require(msg.sender == user);
        return registeredFiles[user];
    }

    function verifyDataOwner(address _user, string memory fileHash) external view returns (bool){
        if(registeredFiles[_user].length > 0){
            for(uint i = 0; i < registeredFiles[_user].length; i++){
                if(keccak256(bytes(registeredFiles[_user][i].fileHash)) == keccak256(bytes(fileHash))){
                    return true;
                }
            }
            return false;
        }
        else{
            return false;
        }
    }
}
