import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./core/Home";
import CSPDashboard from "./csp/CSPDashboard";
import RegisterCSP from "./csp/RegisterCSP";
import LogHistory from "./csp/LogHistory";
import UserDashboard from "./user/UserDashboard";
import RegisterUser from "./user/RegisterUser";
import LoginUser from "./user/LoginUser";

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
            </Routes>
        </BrowserRouter>
    )
}

export default Routs;