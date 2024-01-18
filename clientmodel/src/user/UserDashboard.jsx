import React, { useEffect, useState } from "react";
import { getAccount, getUserContract } from "../config";
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

                const files = await userContract.getAllFile();
                console.log("stored Files:",files)
                // console.log(files);
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
                                        <form className="input-group">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Search" 
                                                aria-label="Search" 
                                                aria-describedby="button-addon2"
                                                // value={searchKey}
                                                // onChange={handleChange} 
                                            />
                                            <div className="input-group-append">
                                                <button className="btn btn-danger" type="submit" id="button-addon2"><i className="bi bi-search"></i></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default UserDashboard;
