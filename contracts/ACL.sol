// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "./Integrity.sol";
import "./Identity.sol";

contract ACL {

    address contractOwner;
    Integrity integrityCon;
    Identity identityCon;
    Identity.VerificationResult public verifivcationResult;


    constructor (address _integrityCon, address _identityCon) {
        contractOwner = msg.sender;
        integrityCon = Integrity(_integrityCon);
        identityCon = Identity(_identityCon);
    }
    
    struct Signature {
        string s1;
        string s2;
    }

    struct Acl {
        string id; // hash of file lcation
        bool isPublic; 
        Signature sig; // ecdsa 
        bool accessMode; //true => write, false => read
    }

    mapping(address => mapping(string => Acl)) private acl;

    function createACL(address _user, address _csp, string memory _id, bool _isPublic, string memory _s1, string memory _s2) public {
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success == true); 
        require(integrityCon.verifyDataOwner(_user, _id) == true);
        Acl storage newACL = acl[_csp][_id];
        newACL.id = _id;
        newACL.isPublic = _isPublic;
        newACL.sig.s1 = _s1;
        newACL.sig.s2 = _s2;
    }
}