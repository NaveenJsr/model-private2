import React, { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import Header from "../core/Header";
import { getAccount, getCSPContract, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile";
const CryptoJS = require('crypto-js');

const UploadData = () => {
  const [account, setAccount] = useState("");
  const [userContract, setUserContract] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [file, setFile] = useState(null);
  const [cspList, setCSPList] = useState([]);
  const [formData, setFormData] = useState({
    csp: "",
    desc: "",
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

        const cspCon = await getCSPContract();
        const csps = await cspCon.getAllRegisteredCSPs();
        setCSPList(csps);
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    loadData();
  }, [navigate]);

  const retrieveFile = (e) => {
    setFile(e.target.files[0]);
  };

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

    const cryptoHash = (input) => {
        const hash = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
        return hash;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    try {
        
      const fileContent = await readTextFile(file);
      const hashData = cryptoHash(fileContent);
      console.log("hashedData:", hashData);
      const fireConig = await userContract.getCspFireCred(formData.csp);
      console.log("fireConfig:", fireConig);
      const location = await uploadFile(file, fireConig);
      console.log("location:",location)
      const res = await userContract.uploadFile(formData.csp, formData.desc, location, hashData);
      await res.wait();
      alert("File Uploaded...");
      window.location.reload();
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                                    <h3 className="mb-0">Upload Encrypted File</h3>
                                </div>
                                <hr />
                                <div className="modal-body p-5 pt-0">
                                    <form className="form" onSubmit={handleSubmit}>

                                        <div className="mb-2">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                name="desc"
                                                value={formData.desc}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label>Select CSP</label>
                                            <select
                                                name="csp"
                                                value={formData.csp}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="">Select CSP</option>
                                                {cspList.map((csp, index) => (
                                                    <option key={index} value={csp.CSP_Address}>
                                                        {csp.CSP_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-2">
                                            <label>Select File</label>
                                            <input
                                                type="file"
                                                name="data"
                                                onChange={retrieveFile}
                                                className="form-control"
                                            />
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

export default UploadData;
