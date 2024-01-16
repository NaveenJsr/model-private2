// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "./Identity.sol";
import "./LOG.sol";

// Import necessary OpenZeppelin library
import "@openzeppelin/contracts/utils/Strings.sol";

// Updated contract name to NewStringUtils
contract ToStr {
    using Strings for uint256;

    function toString(uint256 _value) external pure returns (string memory) {
        return Strings.toString(_value);
    }
}


contract CSP {

    address contractOwner;
    Identity identityCon;
    LOG logCon;

    ToStr toStrCon = new ToStr();

    constructor(address _identityCon, address _logCon) {
        contractOwner = msg.sender;
        identityCon = Identity(_identityCon);
        logCon = LOG(_logCon);
    }

    struct Csp {
        string CSP_name;
        address CSP_Address;
    }

    struct FirebaseConfig{
        string apiKey;
        string authDomain;
        string ProjectId;
        string storageBucket;
        string messagingSenderId;
        string appId;
        string measurmentId;
    }

    mapping (address => bytes) public fireCred;
    mapping (address => bool) private isCSP;
    mapping (string => Csp) private AlreadyRegisteredCSPs;
    mapping (address => Csp) private cspDetail;
    Csp[] registeredCSPs;

    function getAllRegisteredCSPs() public view returns (Csp[] memory) {
        return registeredCSPs;
    }

    function getCSPDetail() public view returns (Csp memory) {
        return cspDetail[msg.sender];
    }

    //----------------csp registration

    function registerCSP(
        string memory _CSP_name, 
        string memory _apikey, 
        string memory _authDomain, 
        string memory _projectId, 
        string memory _storageBucket, 
        string memory _messagingSenderId, 
        string memory _appId, 
        string memory _measurmentId
    ) public returns (bool) {

        require(!isCSP[msg.sender], "CSP Already Registered");
        for (uint i = 0; i < registeredCSPs.length; i++) {
            require(keccak256(abi.encodePacked(registeredCSPs[i].CSP_name)) != keccak256(abi.encodePacked(_CSP_name)), "CSP already Registered with this name");
        }

        Csp memory newCSP;
        newCSP.CSP_Address = msg.sender;
        newCSP.CSP_name = _CSP_name;
        registeredCSPs.push(newCSP);
        isCSP[msg.sender] = true;
        cspDetail[msg.sender] = newCSP;
        FirebaseConfig memory newConfig;
        newConfig.apiKey = _apikey;
        newConfig.authDomain = _authDomain;
        newConfig.ProjectId = _projectId;
        newConfig.storageBucket = _storageBucket;
        newConfig.messagingSenderId = _messagingSenderId;
        newConfig.appId = _appId;
        newConfig.measurmentId = _measurmentId;
        fireCred[msg.sender] = encode(newConfig);
        return true;
    }

    function getFireCred(address _csp) public view returns(FirebaseConfig memory){
        return decode(fireCred[_csp]);
    }
    
    function checkCSP() public view returns (bool) {
        return isCSP[msg.sender];
    }

    //----------------upload File
    struct File {
        address csp;
        string fileLocationHash;
        string encDataHash;
    }

    mapping (address => File[]) public files;

    function uploadFile(address _user, address csp, File memory _file) external{
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success == true);
        File memory newFile;
        newFile.csp = csp;
        newFile.fileLocationHash = _file.fileLocationHash;
        newFile.encDataHash = _file.encDataHash;
        files[csp].push(newFile);
    }

    //-----------csp List stored files

    struct FileLocation{
        string fileHash;
        string location;
        string createdAt;
    }

    mapping (address => FileLocation[]) public listedFiles;

    function listStoredFiles(FileLocation[] memory fileLocations) public {
        for(uint i = 0; i < fileLocations.length; i++){
            FileLocation memory newFile = fileLocations[i];
            listedFiles[msg.sender].push(newFile);
        }
    }

    function getListedALLFiles() public view returns(FileLocation[] memory){
        return listedFiles[msg.sender];
    }

    //-------------requests

    struct Requests {
        address user;
        string fileHash;
        bool isGranted;
    }

    struct Grant{
        string fileHash;
        string location;
    }

    mapping (address => Requests[]) public requests;
    mapping (address => Grant[]) public grantedAccess;
    

    function requestFile(address _user, address _csp, string memory _fileHash) external {
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        if(verResult.success){
            Requests memory req;
            req.user = _user;
            req.fileHash = _fileHash;
            req.isGranted = true;
            requests[_csp].push(req);
            
            for(uint i = 0; i < listedFiles[_csp].length; i++){
                if (bytes(listedFiles[_csp][i].fileHash).length == bytes(_fileHash).length && keccak256(bytes(listedFiles[_csp][i].fileHash)) == keccak256(bytes(_fileHash))) {
                    Grant memory newGrant = Grant({fileHash: listedFiles[_csp][i].fileHash, location: listedFiles[_csp][i].location});
                    grantedAccess[_user].push(newGrant);
                }
            }
            LOG.AccessLog memory newlog = LOG.AccessLog({
                user: _user,
                fileHash: _fileHash,
                grantTime: toStrCon.toString(block.timestamp)
            });

            logCon.addAccessLog(_csp, newlog);
        }
    }

    function getGrantFiles(address _user) external view returns (Grant[] memory){
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success == true);
        return grantedAccess[_user];
    }

    //-----------get log History

    function getLog() public view returns(LOG.AccessLog[] memory){
        require(isCSP[msg.sender] == true);
        return logCon.getLog(msg.sender);
    }

    //---------------base64

    function decode(bytes memory _fireCred) internal pure returns (FirebaseConfig memory) {
        (string memory apiKey, string memory authDomain, string memory ProjectId, string memory storageBucket, string memory messagingSenderId, string memory appId, string memory measurmentId) = abi.decode(_fireCred, (string, string, string, string, string, string, string));
        return FirebaseConfig(apiKey, authDomain, ProjectId, storageBucket, messagingSenderId, appId, measurmentId);
    }

    function encode(FirebaseConfig memory _fireCred) internal pure returns (bytes memory) {
        return abi.encode(_fireCred.apiKey, _fireCred.authDomain, _fireCred.ProjectId, _fireCred.storageBucket, _fireCred.messagingSenderId, _fireCred.appId, _fireCred.measurmentId);
    }

}
