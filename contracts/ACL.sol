// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "./Integrity.sol";
import "./Identity.sol";

contract ACL {

    address public contractOwner;
    Integrity public integrityCon;
    Identity public identityCon;
    Identity.VerificationResult public verificationResult;

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
        string id; // hash of file location
        bool isPublic; // file type
        Signature sig; // ecdsa 
        bool accessMode; // true => write, false => read
    }

    mapping(address => mapping(string => Acl)) private acl;

    function createACL(address _user, address _csp, string memory _id, bool _isPublic, string memory _s1, string memory _s2) public {
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success, "User verification failed");
        require(integrityCon.verifyDataOwner(_user, _id), "Data owner verification failed");

        Acl storage newACL = acl[_csp][_id];
        newACL.id = _id;
        newACL.isPublic = _isPublic;
        newACL.sig.s1 = _s1;
        newACL.sig.s2 = _s2;
    }

    function verifyAcl(address _csp, string memory _id) external view returns (bool) {
        return acl[_csp][_id].isPublic;
    }

}
