import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserContract } from "../config";

const UserMenu = ({ userDetail, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userContract, setUserContract] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userCon = await getUserContract();
        setUserContract(userCon);
       }
       catch(error) {
        console.log(error);
       }
    };

    loadData();
  }, []);

  const isActive = (currentPath, path) => {
    return currentPath === path ? { background: "red", color: "white" } : { color: "blue" };
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    if(!isAuthenticated){
      navigate("/user/login")
    }
    try{
      const res = await userContract.signOut();
      await res.wait();
      window.location.reload();
    }
    catch(error){
      console.log(error);
    }
  }

  return (
    <div className="d-flex flex-column flex-shrink-0 p-2 text-bg-light" style={{ width: "240px", height: "670px" }}>
      <p className="d-flex align-items-center px-2 mb-md-0 me-md-auto text-red fs-4">
        <span className="bi bi-person-fill"></span> <span className="p-2">{userDetail.user_name}</span> 
      </p>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link
            to="/user/dashboard"
            className="nav-link"
            style={isActive(location.pathname, "/user/dashboard")}
            onClick={() => handleNavigate("/user/dashboard")}
          >
            Dashboard
          </Link>
        </li>
        <li>
              <Link
                to="/user/encrypt-file"
                className="nav-link"
                style={isActive(location.pathname, "/user/encrypt-file")}
                onClick={() => handleNavigate("/user/encrypt-file")}
              >
                Encrypt File
              </Link>
            </li>
            <li>
              <Link
                to="/user/upload-data"
                className="nav-link"
                style={isActive(location.pathname, "/user/upload-data")}
                onClick={() => handleNavigate("/user/upload-data")}
              >
                Upload Data
              </Link>
            </li>
            <li>
              <Link
                to="/user/generate-key-share"
                className="nav-link"
                style={isActive(location.pathname, "/user/generate-key-share")}
                onClick={() => handleNavigate("/user/generate-key-share")}
              >
                Generate KeyShares
              </Link>
            </li>
            <li>
              <Link
                to="/user/create-acl"
                className="nav-link"
                style={isActive(location.pathname, "/user/create-acl")}
                onClick={() => handleNavigate("/user/create-acl")}
              >
                Create ACL
              </Link>
            </li>
            <li>
              <button 
                className="nav-link" 
                style={{ color: "blue", hover: { color: "white", background: "red" } }}
                onClick={handleLogout}
                >Log Out</button>
            </li>
      </ul>
    </div>
  );
};

export default UserMenu;
