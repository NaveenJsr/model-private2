// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "hardhat/console.sol";
import "./Identity.sol";
import "./CSP.sol";
import "./ACL.sol";
import "./Generate_Shares.sol";
import "./Generate_Key.sol";

contract USER {
    address public owner;

    Identity identityCon;
    CSP cspCon;
    ACL aclCon;
    FileIntegrity fileIntegrityCon;
    Generate_Shares genShareCon;
    Generate_Key genkeyCon;

    CSP.Requests public requests;
    CSP.Grant public grant;
    CSP.File public file;

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
                address _fileIntegrityCon, 
                address _genShareCon, 
                address _genkeyCon) {
        owner = msg.sender;
        identityCon = Identity(_identityCon);
        aclCon = ACL(_aclCon);
        cspCon = CSP(_cspCon);
        fileIntegrityCon = FileIntegrity(_fileIntegrityCon);
        genShareCon = Generate_Shares(_genShareCon);
        genkeyCon = Generate_Key(_genkeyCon);
    }
   

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    //---------------register user
    function registerUser(address _userAddress, string memory _userName, string memory _password) public returns (bool) {
        require(!isUser[_userAddress], "User is already registered");

        User memory newUser = User({
            user_name: _userName, 
            user_address: _userAddress, 
            hashedPassword: keccak256(abi.encodePacked(_password))
        });
        userDetails[_userAddress] = newUser;
        isUser[_userAddress] = true;

        // Emit the UserRegistered event
        emit UserRegistered(_userAddress);

        return true;
    }


    //--------------authenticate user

    function authenticateUser(address _userAddress, string memory _password) public {
        require(isUser[msg.sender] == true);
        require(userDetails[msg.sender].hashedPassword == keccak256(abi.encodePacked(_password)));
        identityCon.requestToken(_userAddress);
    }

    //----------signOut

    function signOut(address _userAddress) public {
        require(isUser[msg.sender] == true);
        identityCon.deleteToken(_userAddress);
    }

    //---------------uploadFiles

    function uploadFile(address _user, address _csp, CSP.File memory _file) public {
        cspCon.uploadFile(_user, _csp, _file);

    }

    //------------acl creation
    function generateAcl(address csp, string memory fileHash, bool isPublic, string memory s1, string memory s2) public {
        aclCon.createACL( msg.sender, csp, fileHash, isPublic, s1, s2);
    }

    //----------------request files

    function requestFile(address _user, address _csp, string memory _fileHash ) public {
        require(isUser[msg.sender] == true);
        cspCon.requestFile(_user, _csp, _fileHash);
    }

    //---------------get Accessed Files

    function getgrantedFiles(address _user) public view returns(CSP.Grant[] memory){
        require(isUser[msg.sender] == true);
        CSP.Grant[] memory grantedFiles = cspCon.getGrantFiles(_user);
        return grantedFiles;
    }

    function generateKeyShare(uint secret, uint n, string memory fileHash) public {
        require(isUser[msg.sender] == true);
        genShareCon.input(secret, n, fileHash);
    }

    

}