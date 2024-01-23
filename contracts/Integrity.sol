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
        string desc;
        string fileLocationHash;
        string encDataHash;
        string createdAt;
    }

    mapping (address => RegFile[]) registeredFiles;

    function registerFile(address _user, address _csp, string memory _desc, string memory _fileLocHash, string memory _encdataHash, string memory _createdAt) external {
        RegFile memory newfile = RegFile({
            csp: _csp,
            desc: _desc,
            fileLocationHash: _fileLocHash,
            encDataHash: _encdataHash,
            createdAt: _createdAt
        });
        registeredFiles[_user].push(newfile);
    }

    function getRegFiles(address user) external view returns (RegFile[] memory) {
        return registeredFiles[user];
    }

    function verifyDataOwner(address _user, string memory fileHash) external view returns (bool) {
        uint filesLength = registeredFiles[_user].length;
        if (filesLength > 0) {
            for (uint i = 0; i < filesLength; i++) {
                bytes32 targetHash = keccak256(abi.encodePacked(registeredFiles[_user][i].fileLocationHash)); 
                bytes32 fileHashBytes = keccak256(abi.encodePacked(fileHash));
                if (targetHash == fileHashBytes) {
                    return true;
                }
            }
        }
        return false;
    }
}
