import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./core/Home";
import CSPDashboard from "./csp/CSPDashboard";
import RegisterCSP from "./csp/RegisterCSP";

const Routs = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact Component={Home} />
                <Route path="/csp/dashboard" exact Component={CSPDashboard} />
                <Route path="/csp/register" exact Component={RegisterCSP} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routs;