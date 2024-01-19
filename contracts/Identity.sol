// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/utils/Strings.sol";

contract ToString {
    using Strings for uint256;

    function toStr(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

contract Identity {

    address contractOwner;

    ToString tosStrCon = new ToString();

    constructor() {
        contractOwner = msg.sender;
    }

    struct AccessToken {
        address user;
        uint iat;
        uint exp;
        bytes validationHash;
    }

    mapping(address => bytes) public  tokens; // user => newToken

    function requestToken(address _user) external {
        if(tokens[_user].length != 0){
            delete tokens[_user];
            bytes memory validationHash = abi.encodePacked(keccak256(abi.encodePacked(_user, block.timestamp, block.timestamp + 5200, contractOwner)));
            bytes memory newToken = encodeToken(AccessToken(_user, block.timestamp, block.timestamp + 5200, validationHash));
            tokens[_user] = newToken; 
        }
        else{
            bytes memory validationHash = abi.encodePacked(keccak256(abi.encodePacked(_user, block.timestamp, block.timestamp + 5200, contractOwner)));
            bytes memory newToken = encodeToken(AccessToken(_user, block.timestamp, block.timestamp + 5200, validationHash));
            tokens[_user] = newToken; 
        }
    }

    struct VerificationResult {
        bool success;
        string message;
    }

    function verifyToken(address _user) external view returns(VerificationResult memory) {
        if(tokens[_user].length != 0){
            AccessToken memory token = decodeToken(tokens[_user]);
            bytes memory velidationHash1 = abi.encodePacked(keccak256(abi.encodePacked(_user, token.iat, token.exp, contractOwner)));
            bytes32 hash1 = keccak256(velidationHash1);
            bytes32 hash2 = keccak256(token.validationHash);
            if(hash1 == hash2){
                if(token.exp > block.timestamp){
                    return VerificationResult(true, tosStrCon.toStr(token.exp));
                }
                else{
                    return VerificationResult(false, tosStrCon.toStr(token.exp));
                }
            }
            else {
                return VerificationResult(false, tosStrCon.toStr(token.exp));
            }
        }
        else{
            return VerificationResult(false, tosStrCon.toStr(0));
        }
    }

    function deleteToken(address _user) external {
        delete tokens[_user];
    }

    function decodeToken(bytes memory ssoToken) internal pure returns(AccessToken memory) {
        return abi.decode(ssoToken, (AccessToken));
    }

    function encodeToken(AccessToken memory token) internal pure returns(bytes memory) {
        return abi.encode(token);
    }
}