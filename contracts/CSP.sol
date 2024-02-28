// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
import "./Identity.sol";
import "./LOG.sol";
import "./ACL.sol";
import "./Integrity.sol";

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
    Integrity public integrityCon;
    LOG logCon;
    ACL aclCon;

    ToStr toStrCon = new ToStr();

    constructor(address _identityCon, address _logCon, address _aclCon, address _integrityCon) {
        contractOwner = msg.sender;
        identityCon = Identity(_identityCon);
        logCon = LOG(_logCon);
        aclCon = ACL(_aclCon);
        integrityCon = Integrity(_integrityCon);
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

    function getFireConfig() public view returns(FirebaseConfig memory){
        require(isCSP[msg.sender] == true);
        return decode(fireCred[msg.sender]);
    }

    function getFireCred(address _user, address _csp) external view returns(FirebaseConfig memory){
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success == true);
        return decode(fireCred[_csp]);
    }
    
    function checkCSP() public view returns (bool) {
        return isCSP[msg.sender];
    }

    //----------------upload File
    struct File {
        address csp;
        string desc;
        string fileLocationHash;
        string encDataHash;
        string createdAt;
    }

    File[] files;

    function uploadFile(address _user, File memory _file) external{
        Identity.VerificationResult memory verResult = identityCon.verifyToken(_user);
        require(verResult.success == true);
        _file.createdAt = toStrCon.toString(block.timestamp);
        files.push(_file);
    }

    function getAllFiles() external view returns(File[] memory){
        return files;
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

        require(verResult.success == true, "User verification failed");
        if(aclCon.verifyAcl(_csp, _fileHash) == true){
            Requests memory req;
            req.user = _user;
            req.fileHash = _fileHash;
            req.isGranted = true;
            requests[_csp].push(req);

            for (uint i = 0; i < listedFiles[_csp].length; i++) {
                if (keccak256(bytes(listedFiles[_csp][i].fileHash)) == keccak256(bytes(_fileHash))) {
                    bool granted;
                    for(uint j = 0; j < grantedAccess[_user].length; j++){
                        if (bytes(grantedAccess[_user][j].fileHash).length != 0) {
                            granted = true;
                        }
                    }
                    if(granted == false){
                        Grant memory newGrant = Grant({
                            fileHash: listedFiles[_csp][i].fileHash,
                            location: listedFiles[_csp][i].location
                        });
                        grantedAccess[_user].push(newGrant);

                        LOG.AccessLog memory newlog = LOG.AccessLog({
                            user: _user,
                            fileHash: _fileHash,
                            grantTime: toStrCon.toString(block.timestamp)
                        });
                        logCon.addAccessLog(_csp, newlog);
                    }
                }
            }
        }
        else if (integrityCon.verifyDataOwner(_user, _fileHash) == true){
            Requests memory req;
            req.user = _user;
            req.fileHash = _fileHash;
            req.isGranted = true;
            requests[_csp].push(req);

            for (uint i = 0; i < listedFiles[_csp].length; i++) {
                if (keccak256(bytes(listedFiles[_csp][i].fileHash)) == keccak256(bytes(_fileHash))) {
                    bool granted;
                    for(uint j = 0; j < grantedAccess[_user].length; j++){
                         if (bytes(grantedAccess[_user][j].fileHash).length != 0) {
                            granted = true;
                        }
                    }
                    if(granted == false){
                        Grant memory newGrant = Grant({
                            fileHash: listedFiles[_csp][i].fileHash,
                            location: listedFiles[_csp][i].location
                        });
                        grantedAccess[_user].push(newGrant);

                        LOG.AccessLog memory newlog = LOG.AccessLog({
                            user: _user,
                            fileHash: _fileHash,
                            grantTime: toStrCon.toString(block.timestamp)
                        });
                        logCon.addAccessLog(_csp, newlog);
                    }
                }
            }
        }
        else{
            revert();
        }
    }

    function getGrantFiles() external view returns (Grant[] memory){
        return grantedAccess[msg.sender];
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
