import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import Header from "../core/Header";
import { getAccount,  getUserContract } from "../config";
import { useNavigate } from "react-router-dom";

const GenerateKeyShare = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        filelocation: "",
        key: null,
        noOfShare: null
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const accountRes = await getAccount();
                setAccount(accountRes);

                const userCon = await getUserContract();
                setUserContract(userCon);

                const isUserRes = await userCon.checkUser();
                if (!isUserRes) {
                navigate("/user/register");
                }

                const isAuthen = await userCon.isAuthenticated();
                if (!isAuthen.success) {
                navigate("/user/login");
                }
                setIsAuthenticated(isAuthen);
                
                const user = await userCon.getUserdetail();
                setUserDetail(user);

                const regFiles = await userCon.getAllregFiles();
                // console.log("regfiles:", regFiles);
                setFileList(regFiles);

            } catch (error) {
                console.error("Error loading data:", error.message);
            }
        };

        loadData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.filelocation){
            return;
        }
        try {
            const res = await userContract.generateKeyShare(formData.key, formData.noOfShare, formData.filelocation);
            await res.wait();
            alert("Key share generated!");
            window.location.reload();
        } catch (error) {
            alert("Error in generating Key Shares");
            console.error(error);
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
                                    <h3 className="mb-0">Generate Key Shares</h3>
                                </div>
                                <hr />
                                <div className="modal-body p-5 pt-0">
                                    <form className="form" onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <label>Slect File</label>
                                            <select 
                                                name="filelocation"
                                                value={formData.filelocation}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="">Select File</option>
                                                {fileList.map((ele, index) => (
                                                    <option key={index} value={ele.fileLocationHash}>
                                                        {ele.desc}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label>Key</label>
                                            <input
                                                className="form-control"
                                                name="key"
                                                value={formData.key}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Number of Shares</label>
                                            <input
                                                className="form-control"
                                                name="noOfShare"
                                                value={formData.noOfShare}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button className="w-100 mt-2 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                                            Generate Shares
                                        </button>
                                    </form>
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

export default GenerateKeyShare;
