import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ account }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (currentPath, path) => {
        return currentPath === path ? { color: "Blue" } : { color: "white" };
    };

    const handleNavigate = (path) => {
        navigate(path);
    };


    return (
        <header className="p-3 text-bg-dark">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <h1 className="bi me-2 heading">BSCIAM</h1>
                    </Link>

                    <ul className="nav col-12 col-lg-auto ml-4 me-lg-auto mb-1 justify-content-center mb-md-0">
                        <li>
                            <Link
                                to="/"
                                className="nav-link px-2"
                                style={isActive(location.pathname, "/")}
                                onClick={() => handleNavigate("/")}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/user/dashboard"
                                className="nav-link px-2"
                                style={isActive(location.pathname, "/user/dashboard")}
                                onClick={() => handleNavigate("/user/dashboard")}
                            >
                                User
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/csp/dashboard"
                                className="nav-link px-2"
                                style={isActive(location.pathname, "/csp/dashboard")}
                                onClick={() => handleNavigate("/csp/dashboard")}
                            >
                                CSP
                            </Link>
                        </li>
                    </ul>

                    <div className="text-end">
                        <p className="nav-link mb-1 text-white justify-content-center">Account: {!account ? (<span className="text-danger">Connect with MetaMask</span>) : (<span>{account}</span>)}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
