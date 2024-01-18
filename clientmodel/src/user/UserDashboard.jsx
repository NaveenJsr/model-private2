import React, { useEffect, useState } from "react";
import { getAccount, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null)
    // const [identityContract, setIdentityContract] = useState(null);
    // const [genrateShareContract, setGenerateShareContract] = useState(null);
    // const [generateKeyContract, setGenerateKeyContract] = useState(null);
    // const [userDetail, setUserDetail] = useState([]);
    // const [filesList, setFilesList] = useState([]);
    // const [searchKey, setSearchKey] = useState(null);
    // const [searchList, setSearchList] = useState(null);
    // const [accessedFiles, setAccessedFile] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const accountRes = await getAccount();
                setAccount(accountRes);

                const contractRes = await getUserContract();
                setUserContract(contractRes)

                const isUserRes = await contractRes.checkUser();
                console.log("isUser", isUserRes)
                if (!isUserRes) {
                    navigate("/user/register");
                }

                const isAuthenticated = await contractRes.isAuthenticated();
                console.log("isAuthen",isAuthenticated)
                // if(!isAuthenticated.success){
                //     navigate("/user/login")
                // }

            } catch (error) {
                console.error("Error loading data:", error.message);
            }
        };

        loadData();
    }, [navigate]);


    // const handleChange = (e) => {
    //     var res = e.target.value;
    //     setSearchKey(res);
    // }

    // const handleSearch = (e) => {
    //     e.preventDefault();

    //     if (!searchKey) {
    //         return;
    //     }

    //     const searchKeyLower = searchKey.toLowerCase();

    //     const filteredList = filesList.filter((data) => {
    //         const descLower = data.desc.toLowerCase();
    //         return descLower.includes(searchKeyLower);
    //     });

    //     setSearchList(filteredList);
    // }; 

    // const handleSubmit = async (csp, file) => {
    //     try{
    //         const resreq = await  identityContract.requestToken(account, csp, file);
    //         alert("Access requested! Wait a while...");
    //         console.log("Accessrequested",resreq);
    //     }
    //     catch(error){
    //         alert("Unable to request access...")
    //         console.log("unable to request access", error);
    //     }
    // }
    

    // const decrypt = (location, key, sig) => {
    //     if(!location && !key && !sig){
    //         return;
    //     }

    //     getText(location)
    //         .then((res) => {
    //             console.log(res);
    //             const decryptText = decryptFile(res, key[0]);
    //             console.log(decryptText);
    //             const verifysig = Verification(sig.s1, sig.s2, decryptText);
    //             console.log(verifysig, sig);
    //             const decryptedBlob = new Blob([decryptText], {type: 'text/plain'});
    //                 const downloadLink = document.createElement('a');

    //                 downloadLink.href = URL.createObjectURL(decryptedBlob);
    //                 downloadLink.download = `textfile`;
    //                 downloadLink.click();
    //         })
    //         .catch(error => console.log(error));
    // }

    // const handleGenerateKey = async (file, keySharesDetail) => {
    //     try {
    //         // Call the generateKeyContract.input function
    //         const inputTransaction = await generateKeyContract.input(account, file, keySharesDetail.bk.b, keySharesDetail.shares, keySharesDetail.bk.t);
    //         console.log("key generation processing...")
    //         // Wait for the transaction to be confirmed
    //         await inputTransaction.wait();
    //         console.log("key generated...")
    
    //         // Once the transaction is confirmed, call generateKeyContract.getKey
    //         const key = await generateKeyContract.getKey(account, file);
    //         return key;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    

    // const handleDownload = async (file, location, signature) => {
    //     try {
    //         const keySharesDetail = await genrateShareContract.read_Shares(file);
    //         // console.log(keySharesDetail)
    //         var key = await generateKeyContract.getKey(account, file);
            
    //         if (key.length === 0) {
    //             console.log("key not found...")
    //             // Call the new function handleGenerateKey
    //             const k = await handleGenerateKey(file, keySharesDetail);
    //             key = k;
    //         }

    //         console.log(key,location);
    //         decrypt(location, key, signature);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    
    return (
        <>User Dashboard</>
    )

    // return (
    //     <div>
    //         <Header account={account} />
    //         <div className="d-flex">
    //             <UserMenu userDetail={userDetail} />
    //             <div className="container">
    //                 <div className="model model-sheet position-static d-block bg-white py-sm-4">
    //                     <div className="model-dialog">
    //                         <div className="model-content rounded-4">
    //                             <div className="modal-header border-bottom-0">
    //                                 <div className="search-box wide-search">
    //                                     <form className="input-group" onSubmit={handleSearch}>
    //                                         <input 
    //                                             type="text" 
    //                                             className="form-control" 
    //                                             placeholder="Search" 
    //                                             aria-label="Search" 
    //                                             aria-describedby="button-addon2"
    //                                             value={searchKey}
    //                                             onChange={handleChange} 
    //                                         />
    //                                         <div className="input-group-append">
    //                                             <button className="btn btn-danger" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
    //                                         </div>
    //                                     </form>
    //                                 </div>
    //                             </div>
    //                             <hr />

    //                             {searchList === null ? (null) : (
    //                                 <div className="bg-white">
    //                                     <div className="p-3">
    //                                         <p>{searchList.length} result found</p>
    //                                         <div className="border rounded-3">
    //                                             <div className="table-responsive p-3">
    //                                                 <table className="table">
    //                                                     <tbody>
    //                                                         {searchList.map((data, index) => (
    //                                                             <tr key={index}>
    //                                                                 <td>
    //                                                                     <p className="copy-button" onClick={() => handleSubmit(data.cspAddress, data.hashedLocation)}  ><strong>{data.desc}</strong></p>
    //                                                                 </td>
    //                                                             </tr>
    //                                                         ))}
    //                                                     </tbody>
    //                                                 </table>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             )}

    //                             {accessedFiles.length === 0 ? (null) : (
    //                                 <div className="bg-white">
    //                                     <div className="p-3">
    //                                         <h3>File</h3>
    //                                         <div className="border rounded-3">
    //                                             <div className="table-responsive p-3">
    //                                                 <table className="table">
    //                                                     <tbody>
    //                                                         {accessedFiles.map((data, index) => (
    //                                                             <tr key={index}>
    //                                                                 <td>
    //                                                                     {filesList.map((ele) => (
    //                                                                         ele.hashedLocation === data.hashFile && (
    //                                                                             <span><strong>{ele.desc}</strong></span>
    //                                                                         )
    //                                                                     ))}
    //                                                                 </td>
    //                                                                 <td>
    //                                                                     {filesList.map((ele) => (
    //                                                                         ele.hashedLocation === data.hashFile && (
    //                                                                             <button className="btn btn-primary btn-sm" onClick={() => handleDownload(data.hashFile, data.fileLocation, data.sig)}>Download</button>
    //                                                                         )
    //                                                                     ))}
    //                                                                 </td>
    //                                                             </tr>
    //                                                         ))}
    //                                                     </tbody>
    //                                                 </table>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default UserDashboard;
