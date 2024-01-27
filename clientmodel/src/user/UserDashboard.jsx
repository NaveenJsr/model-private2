import React, { useEffect, useState } from "react";
import { getAccount, getCSPContract, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "../core/Header";
import UserMenu from "./UserMenu";
import { getText } from "../helpers/readdata";
import { decryptFile } from "../helpers/aes-config";
const CryptoJS = require('crypto-js');

const UserDashboard = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [searchKey, setSearchKey] = useState(null);
    const [searchList, setSearchList] = useState(null);
    const [accessedFiles, setAccessedfiles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const accountRes = await getAccount();
                setAccount(accountRes);

                const contractRes = await getUserContract();
                setUserContract(contractRes)

                const isUserRes = await contractRes.checkUser();
                // console.log("isUser", isUserRes)
                if (!isUserRes) {
                    navigate("/user/register");
                }

                const isAuthen = await contractRes.isAuthenticated();
                // console.log("isAuthen",isAuthenticated)
                if(!isAuthen.success){
                    navigate("/user/login")
                }
                setIsAuthenticated(isAuthen);

                const user = await contractRes.getUserdetail();
                // console.log("userdetail:",user)
                setUserDetail(user);

                const cspCon = await getCSPContract();
                const files = await cspCon.getAllFiles();
                // console.log("stored Files:",files);
                setFileList(files);

                const accFiles = await cspCon.getGrantFiles();
                // console.log("accessedfiles:",accFiles)
                setAccessedfiles(accFiles);

            } catch (error) {
                console.error("Error loading data:", error.message);
            }
        };

        loadData();
    }, [navigate]);
    
    const handleChange = (e) => {
        var res = e.target.value;
        setSearchKey(res);
    }

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchKey) {
            return;
        }

        const searchKeyLower = searchKey.toLowerCase();

        const filteredList = fileList.filter((data) => {
            const descLower = data.desc.toLowerCase();
            return descLower.includes(searchKeyLower);
        });

        // console.log(filteredList);

        setSearchList(filteredList);
    }; 

    const handleSubmit = async (csp, file) => {
        try{
            // console.log(csp, file)
            const resreq = await userContract.requestFile(csp, file);
            await resreq.wait();
            console.log(resreq);
            alert("Accessed...");
            window.location.reload();
            // console.log("Accessrequested",resreq);
        }
        catch(error){
            alert("Only private user can access this file...")
            console.log("unable to request access", error);
        }
    }

    const cryptoHash = (input) => {
        const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
        return hash;
    };

    const decrypt = (encData, key) => {
        if(!encData && !key){
            return;
        }
        const decryptText = decryptFile(encData, key[0]);
        const decryptedBlob = new Blob([decryptText], {type: 'text/plain'});
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(decryptedBlob);
        downloadLink.download = `textfile`;
        downloadLink.click();
    }

    const handleGenerateKey = async (file) => {
        try {
            // Call the generateKeyContract.input function
            const inputTransaction = await userContract.generageKey(file);
            // console.log("key generation processing...")
            // Wait for the transaction to be confirmed
            await inputTransaction.wait();
            // console.log("key generated...")
    
            // Once the transaction is confirmed, call generateKeyContract.getKey
            const key = await userContract.getKey(file);
            return key;
        } catch (error) {
            console.log(error);
        }
    };
    

    const handleDownload = async (file, location, encDataHash) => {
        console.log(file, location, encDataHash);
        try {
            const res = await getText(location);
            // console.log(res);
            const dataHash1 = cryptoHash(res);
            
            const dataInterity = await userContract.checkInterity(file, dataHash1);

            if (dataInterity) {
                let key = await userContract.getKey(file);
    
                if (key.length === 0) {
                    key = await handleGenerateKey(file);
                }
    
                decrypt(res, key);
            } 
        } catch (error) {
            console.error("Error during file download:", error);
        }
    };
    

    return (
        <div>
            <Header account={account} />
            {isAuthenticated.success && (
                <div className="d-flex">
                <UserMenu userDetail={userDetail} isAuthenticated={isAuthenticated} />
                <div className="container">
                    <div className="model model-sheet position-static d-block bg-white py-sm-4">
                        <div className="model-dialog">
                            <div className="model-content rounded-4">
                            <div className="modal-header border-bottom-0">
                                    <div className="search-box wide-search">
                                        <form className="input-group" onSubmit={handleSearch}>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Search" 
                                                aria-label="Search" 
                                                aria-describedby="button-addon2"
                                                value={searchKey}
                                                onChange={handleChange} 
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-danger" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <hr />


                                {searchList === null ? (null) : (
                                    <div className="bg-white">
                                        <div className="p-3">
                                            <p>{searchList.length} result found</p>
                                            <div className="border rounded-3">
                                                <div className="table-responsive p-3">
                                                    <table className="table">
                                                        <tbody>
                                                            {searchList.map((data, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <p className="copy-button" 
                                                                        onClick={() => handleSubmit(data.csp, data.fileLocationHash)} 
                                                                        ><strong>
                                                                            {data.desc}
                                                                        </strong></p>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {accessedFiles.length === 0 ? (null) : (
                                    <div className="bg-white">
                                        <div className="p-3">
                                            <h3>Accessed Files</h3>
                                            <div className="border rounded-3">
                                                <div className="table-responsive p-3">
                                                    <table className="table">
                                                        <tbody>
                                                            {accessedFiles.map((data, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {fileList.map((ele) => (
                                                                            ele.fileLocationHash === data.fileHash && (
                                                                                <span><strong>{ele.desc}</strong></span>
                                                                            )
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        {fileList.map((ele) => (
                                                                            ele.fileLocationHash === data.fileHash && (
                                                                                <button className="btn btn-primary btn-sm" onClick={() => handleDownload(data.fileHash, data.location, ele.encDataHash)}>Download</button>
                                                                            )
                                                                        ))}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )

};

export default UserDashboard;
