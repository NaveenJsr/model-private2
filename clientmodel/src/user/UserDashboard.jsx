import React, { useEffect, useState } from "react";
import { getAccount, getCSPContract, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "../core/Header";
import UserMenu from "./UserMenu";

const UserDashboard = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [searchKey, setSearchKey] = useState(null);
    const [searchList, setSearchList] = useState([]);
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
                console.log("stored Files:",files);
                setFileList(files);

                const accFiles = await userContract.getgrantedFiles();
                console.log("accessedfiles:",accFiles)
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

        console.log(filteredList);

        setSearchList(filteredList);
    }; 

    const handleSubmit = async (csp, file) => {
        try{
            console.log(csp, file)
            const resreq = await userContract.requestFile(csp, file);
            await resreq.wait();
            alert("Accessed...");
            window.location.reload();
            console.log("Accessrequested",resreq);
        }
        catch(error){
            alert("Unable to request access...")
            console.log("unable to request access", error);
        }
    }

    return (
        <div>
            <Header account={account} />
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



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default UserDashboard;
