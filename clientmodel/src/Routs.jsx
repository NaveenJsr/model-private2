import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./core/Home";
import CSPDashboard from "./csp/CSPDashboard";
import RegisterCSP from "./csp/RegisterCSP";
import LogHistory from "./csp/LogHistory";
import UserDashboard from "./user/UserDashboard";
import RegisterUser from "./user/RegisterUser";
import LoginUser from "./user/LoginUser";
import EncryptFile from "./user/EncryptFile";
import UploadData from "./user/UploadData";
import GenerateKeyShare from "./user/GenerateKeyShare";
import CreateACL from "./user/CreateACL";

const Routs = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact Component={Home} />
                <Route path="/csp/dashboard" exact Component={CSPDashboard} />
                <Route path="/csp/register" exact Component={RegisterCSP} />
                <Route path="/csp/log-history" exact Component={LogHistory} />
                <Route path="/user/dashboard" exact Component={UserDashboard} />
                <Route path="/user/register" exact Component={RegisterUser} />
                <Route path="/user/login" exact Component={LoginUser} />
                <Route path="/user/encrypt-file" exact Component={EncryptFile} />
                <Route path="/user/upload-data" exact Component={UploadData} />
                <Route path="/user/generate-key-share" exact Component={GenerateKeyShare} />
                <Route path="/user/create-acl" exact Component={CreateACL} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routs;