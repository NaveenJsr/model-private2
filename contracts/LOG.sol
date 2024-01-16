// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract LOG {
    address contractOwner;

    constructor(){
        contractOwner = msg.sender;
    }

    struct AccessLog{
        address user;
        string fileHash;
        string grantTime;
    }

    mapping (address => AccessLog[]) accessLog;

    function addAccessLog(address csp, AccessLog memory _log) external {
        accessLog[csp].push(_log);
    }

    function getLog(address csp) external view returns (AccessLog[] memory){
        return accessLog[csp];
    }
}