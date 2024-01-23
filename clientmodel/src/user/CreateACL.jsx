import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import Header from "../core/Header";
import { getAccount, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";

const CreateACL = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({
        fileLocation: "",
        csp: "",
        isPublic: "",
        signature: {
            s1: "",
            s2: ""
        }
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

    const handleSelectfile = (location, csp) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            fileLocation: location,
            csp: csp
        }));
    };
    
    

    const handleAccess = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSignature = (e) => {
        const res = e.target.value.split(',');
        setFormData((prevFormData) => ({
            ...prevFormData,
            signature: {
                s1: res[0],
                s2: res[1]
            }
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await userContract.generateAcl(formData.csp, formData.fileLocation, formData.isPublic, formData.signature.s1, formData.signature.s2);
            await res.wait();
            alert("ACL Successfully generated!");
            window.location.reload();
            console.log("successfully ACL generated",res);
        }
        catch(error){
            alert("Error to generate ACL")
            console.log("error to create ACL", error);
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
                                    <h3 className="mb-0">Create Access Control</h3>
                                </div>
                                <hr />
                                <div className="modal-body p-5 pt-0">
                                    <form className="form" onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <label><strong>Select File</strong></label>
                                            <select 
                                                className="form-select"
                                                onChange={(e) => handleSelectfile(e.target.value, fileList.find(file => file.fileLocationHash === e.target.value)?.csp)}
                                            >
                                                <option value="">Select file</option>
                                                {fileList.map((ele, index) => (
                                                    <option key={index} value={ele.fileLocationHash}>
                                                        {ele.desc}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                        <div className="mb-2">
                                            <label><strong>Is Public</strong></label>
                                            <select
                                                className="form-select"
                                                name="isPublic"
                                                value={formData.isPublic}
                                                onChange={handleAccess}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label><strong>Signature</strong> (seperate s1,s2 with comma)</label>
                                            <input className="form-control" name="signature" onChange={handleSignature} />
                                        </div>
                                        <button className="w-100 mt-2 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                                            Upload
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

export default CreateACL;
