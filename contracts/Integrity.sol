// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Strin {
    using Strings for uint256;

    function toString(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

contract Integrity {

    address contractOwner;
    Strin stringUtils = new Strin();

    constructor() {
        contractOwner = msg.sender;
    }

    struct RegFile {
        address csp;
        address dataOwner;
        string desc;
        string fileLocationHash;
        string encDataHash;
        string createdAt;
    }

    RegFile[] registeredFiles;

    function registerFile(address _user, address _csp, string memory _desc, string memory _fileLocHash, string memory _encdataHash, string memory _createdAt) external {
        RegFile memory newfile = RegFile({
            csp: _csp,
            dataOwner: _user,
            desc: _desc,
            fileLocationHash: _fileLocHash,
            encDataHash: _encdataHash,
            createdAt: _createdAt
        });
        registeredFiles.push(newfile);
    }

    function getRegFiles(address user) external view returns (RegFile[] memory) {
    RegFile[] memory regfiles = new RegFile[](registeredFiles.length);
    uint regIndex = 0;
    for(uint i = 0; i < registeredFiles.length; i++){
        if(registeredFiles[i].dataOwner == user){
            regfiles[regIndex] = registeredFiles[i];
            regIndex++;
        }
    }
    return regfiles;
}

    function verifyDataOwner(address _user, string memory fileHash) external view returns (bool) {
        uint filesLength = registeredFiles.length;
        for (uint i = 0; i < filesLength; i++) {
            bytes32 targetHash = keccak256(abi.encodePacked(registeredFiles[i].fileLocationHash)); 
            bytes32 fileHashBytes = keccak256(abi.encodePacked(fileHash));
            if (targetHash == fileHashBytes) {
                if(registeredFiles[i].dataOwner == _user){
                    return true;
                }
                }
            
            }
        
        return false;
    }

    function verifyIntegrity(string memory file, string memory _datahash) external view returns(bool){
        for(uint i = 0; i < registeredFiles.length; i++){
            if(keccak256(abi.encodePacked(registeredFiles[i].fileLocationHash)) == keccak256(abi.encodePacked(file))){
                if(keccak256(abi.encodePacked(registeredFiles[i].encDataHash)) == keccak256(abi.encodePacked(_datahash))){
                    return true;
                }
            }
        }
        return false;
    }
}
