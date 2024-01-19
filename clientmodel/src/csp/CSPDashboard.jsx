import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, getCSPContract } from "../config";
import Header from "../core/Header";
import CSPMenu from "./CSPMenu";
import { fetchUploadedFiles } from "../helpers/uploadFile";

const CSPDashboard = () => {
    const [account, setAccount] = useState("");
    const [cspContract, setCSPContract] = useState(null);
    const [isCSP, setIsCSP] = useState(false);
    const [cspDetail, setCspDetail] = useState([]);
    const [listedFiles, setListedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const acc = await getAccount();
                setAccount(acc);

                const cspCon = await getCSPContract();
                setCSPContract(cspCon);

                const isCSP = await cspCon.checkCSP();
                // console.log(isCSP);
                setIsCSP(isCSP);
                if (!isCSP) {
                    navigate("/csp/register");
                    return;
                }
                

                const cspdetail = await  cspCon.getCSPDetail();
                console.log(cspdetail)
                setCspDetail(cspdetail);

                const listFile = await cspCon.getListedALLFiles();
                setListedFiles(listFile);

                const fireConfig = await cspCon.getFireConfig();
                console.log("fireconfig:",fireConfig)
                const listFileHashes = new Set(listFile.map(data => data.fileHash));

                const filesData = await fetchUploadedFiles(fireConfig);
                setUploadedFiles(
                    filesData.filter(ele => !listFileHashes.has(ele[0])).map(ele => ele)
                );


            } catch (error) {
                console.error("Error loading account:", error.message);
            }
        };

        loadData();
    }, [navigate]);

    const handleListing = async () => {
        if(!uploadedFiles){
            return;
        }
        try{
            const res = await cspContract.listStoredFiles(uploadedFiles);
            await res.wait();
            alert("Files Listed Succesfully!");
            window.location.reload();
            console.log(res)
        }
        catch(error){
            console.log(error);
        }
    }

    return (
        <div>
           <Header account={account} />
           {isCSP && (
            <div className="d-flex">
                <CSPMenu cspDetail={cspDetail} />
                <div className="container">
                    {uploadedFiles && uploadedFiles.length > 0 && (
                        <div className="bg-white">
                            <div className="p-3">
                                <div className="d-flex">
                                    <h3>New files are added</h3>
                                </div>
                                <div>
                                    <div className="border rounded-3">
                                        <div className="table-responsive p-3">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>File</th>
                                                        <th>Created at</th>
                                                        <th>{uploadedFiles.length === 0 ? null : (<button className="btn btn-primary" onClick={handleListing}>List new files</button>)}</th>
                                                    </tr>    
                                                </thead>
                                                <tbody>
                                                    {uploadedFiles.map((ele, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <p className="m-0 p-0">{ele[0].substring(0, 20) + "..."}</p>
                                                            </td>
                                                            <td>{ele[2]}</td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }
                    {listedFiles && listedFiles.length > 0 && (
                        <div className="bg-white">
                            <div className="p-3">
                                <div className="d-flex">
                                    <h3>Listed files</h3>
                                </div>
                                <div>
                                    <div className="border rounded-3">
                                        <div className="table-responsive p-3">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>File</th>
                                                        <th>Created at</th>
                                                    </tr>    
                                                </thead>
                                                <tbody>
                                                    {listedFiles.map((ele, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <p className="m-0 p-0">{ele.fileHash.substring(0, 20) + "..."}</p>
                                                            </td>
                                                            <td>{ele.createdAt}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>) 
                    }
                </div>
            </div>
           )} 
        </div>
    );
};

export default CSPDashboard;