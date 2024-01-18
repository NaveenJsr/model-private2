// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "hardhat/console.sol";
import "./Identity.sol";
import "./CSP.sol";
import "./ACL.sol";
import "./Integrity.sol";
import "./Generate_Shares.sol";
import "./Generate_Key.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract Stri {
    using Strings for uint256;

    function toString(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}

contract USER {
    address public owner;

    Identity identityCon;
    CSP cspCon;
    ACL aclCon;
    Integrity integrityCon;
    Generate_Shares genShareCon;
    Generate_Key genkeyCon;

    Stri toStrCon = new Stri();

    struct User {
        string user_name;
        address user_address;
        bytes32 hashedPassword;
    }

    mapping(address => User) private userDetails;
    mapping(address => bool) private isUser;
    event UserRegistered(address indexed user);

    
    constructor(address _identityCon, 
                address _cspCon, 
                address _aclCon, 
                address _integrityCon, 
                address _genShareCon, 
                address _genkeyCon) {
        owner = msg.sender;
        identityCon = Identity(_identityCon);
        aclCon = ACL(_aclCon);
        cspCon = CSP(_cspCon);
        integrityCon = Integrity(_integrityCon);
        genShareCon = Generate_Shares(_genShareCon);
        genkeyCon = Generate_Key(_genkeyCon);
    }
   

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    //---------------register user
    function registerUser(string memory _userName, string memory _password) public returns (bool) {
        require(!isUser[msg.sender], "User is already registered");

        User memory newUser = User({
            user_name: _userName, 
            user_address: msg.sender, 
            hashedPassword: keccak256(abi.encodePacked(_password))
        });
        userDetails[msg.sender] = newUser;
        isUser[msg.sender] = true;

        // Emit the UserRegistered event
        emit UserRegistered(msg.sender);

        return true;
    }

    //-----------varify user
    function checkUser() public view returns(bool){
        return isUser[msg.sender];
    } 

    function isAuthenticated() public view returns (Identity.VerificationResult memory) {
        return identityCon.verifyToken(msg.sender);
    }

    function getUserdetail() public view returns(User memory){
        require(isUser[msg.sender] == true);
        return userDetails[msg.sender];
    }

    //--------------authenticate user

    function authenticateUser(string memory _password) public {
        require(isUser[msg.sender] == true);
        require(userDetails[msg.sender].hashedPassword == keccak256(abi.encodePacked(_password)));
        identityCon.requestToken(msg.sender);
    }

    //----------signOut

    function signOut() public {
        require(isUser[msg.sender] == true);
        identityCon.deleteToken(msg.sender);
    }

    //---------------uploadFiles

    function getCspFireCred(address _csp) public view returns(CSP.FirebaseConfig memory){
        return cspCon.getFireCred(msg.sender, _csp);
    }

    function uploadFile(address _csp, string memory _desc, string memory _fileLocHash, string memory _encDataHash) public {
        CSP.File memory _file = CSP.File({
            csp: _csp,
            desc: _desc,
            fileLocationHash: _fileLocHash,
            encDataHash: _encDataHash,
            createdAt: toStrCon.toString(block.timestamp)
        });
        
        cspCon.uploadFile(msg.sender, _file);
        integrityCon.registerFile(msg.sender, _file.csp, _file.desc, _file.fileLocationHash, _file.encDataHash, _file.createdAt);
    }

    function getAllregFiles() public view returns(Integrity.RegFile[] memory){
        return integrityCon.getRegFiles(msg.sender);
    }

    //------------generate key share

    function generateKeyShare(uint secret, uint n, string memory fileHash) public {
        require(isUser[msg.sender] == true);
        genShareCon.input(secret, n, fileHash);
    }

    //------------acl creation
    function generateAcl(address csp, string memory fileHash, bool isPublic, string memory s1, string memory s2) public {
        aclCon.createACL( msg.sender, csp, fileHash, isPublic, s1, s2);
    }

    //----------------request files

    function requestFile(address _csp, string memory _fileHash ) public {
        require(isUser[msg.sender] == true);
        cspCon.requestFile(msg.sender, _csp, _fileHash);
    }

    //---------------get Accessed Files

    function getgrantedFiles() public view returns(CSP.Grant[] memory){
        require(isUser[msg.sender] == true);
        CSP.Grant[] memory grantedFiles = cspCon.getGrantFiles(msg.sender);
        return grantedFiles;
    }

    function generageKey(string memory _fileHash) public {
        require(isUser[msg.sender] == true);
        genkeyCon.input(msg.sender, _fileHash);
    }

    function getKey(string memory _fileHash) public view returns(string[] memory){
        return genkeyCon.getKey(msg.sender, _fileHash);
    }
}