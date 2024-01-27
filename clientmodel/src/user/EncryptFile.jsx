import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import Header from "../core/Header";
import { getAccount, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";
import { encryptFile } from "../helpers/aes-config";
import { Signature } from "../helpers/ecdsa";
import copy from "clipboard-copy";

const EncryptFile = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [key, setKey] = useState("");
    const [file, setFile] = useState(null);
    const [signature, setSignature] = useState(null);
    const navigate = useNavigate();
    const [clipboardStatus, setClipboardStatus] = useState(<span>Copy <span class="bi bi-clipboard"></span></span>)
    

    useEffect(() => {
        const loadData = async () => {
            try {
                const accountRes = await getAccount();
                setAccount(accountRes);

                const contractRes = await getUserContract();
                setUserContract(contractRes);

                const isUserRes = await contractRes.checkUser();

                if (!isUserRes) {
                    navigate("/user/register");
                }

                const isAuthen = await contractRes.isAuthenticated();
                if(!isAuthen.success){
                    navigate("/user/login");
                }
                setIsAuthenticated(isAuthen);

                const user = await contractRes.getUserdetail();
                setUserDetail(user);

            } catch (error) {
                console.error("Error loading data:", error.message);
            }
        };

        loadData();
    }, [navigate]);

    const retrieveFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const encrypt = () => {
        const start = performance.now();
        if(!isAuthenticated){
            navigate("/user/login");
        }
        if (!file) {
            alert('Please select a file to encrypt.');
            return;
        }
        if (!key) {
            alert('Please enter a key for encryption.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const originalData = new Uint8Array(event.target.result);
            const textDecoder = new TextDecoder('utf-8');
            const originalText = textDecoder.decode(originalData);
            const secretKey = key;
            const encrypted = encryptFile(originalText, secretKey);
            const signature = Signature(originalText);
            setSignature(signature);
            const encryptedBlob = new Blob([encrypted]);
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(encryptedBlob);
            downloadLink.download = `encrypted_${file.name}`;
            downloadLink.click();
            const end = performance.now();
            console.log(`Execution time: ${(end - start) / 1000} sec for file of size ${(file.size / 1024) / 1024} mb`); 
        };
        reader.readAsArrayBuffer(file);
           
    };

    const handleCopySignature = () => {
        if (signature) {
            copy(signature);
            setClipboardStatus(<span>Copied! <span class="bi bi-clipboard-check"></span></span>)
        }
    };

    return (
        <div>
            <Header account={account} />
            {isAuthenticated.success && (
                <div className="d-flex">
                <div>
                    <UserMenu userDetail={userDetail} isAuthenticated={isAuthenticated} />
                </div>
                <div className="container">
                    <div className="model model-sheet position-static d-block bg-white py-md-4">
                        <div className="model-dialog">
                            <div className="model-content rounded-4">
                                <div className="modal-header border-bottom-0">
                                    <h3 className="mb-0">Encrypt File</h3>
                                </div>
                                <hr />
                                <div className="modal-body p-5 pt-0">
                                    <form className="form" onSubmit={(e) => e.preventDefault()}>
                                        <div className="mb-2">
                                            <label>
                                                Select File
                                            </label>
                                            <input
                                                type="file"
                                                name="data"
                                                onChange={retrieveFile}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>
                                                Enter Key
                                            </label>
                                            <input
                                                type="text"
                                                value={key}
                                                onChange={(e) => setKey(e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-2 align-item-center">
                                            <button type="button" onClick={encrypt} className="w-30 mb-2 btn btn-lg rounded-3 btn-primary">Encrypt</button>
                                        </div>
                                    </form>

                                    <div className="mt-5">
                                        {!signature ? (null) : (
                                            <p>
                                                <strong>Signature :</strong> {signature[0]}{","}{signature[1]}{" "}
                                                <span className="copy-button" onClick={handleCopySignature}>{clipboardStatus}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default EncryptFile;
