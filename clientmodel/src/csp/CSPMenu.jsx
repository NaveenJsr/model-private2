import { Link, useLocation, useNavigate } from "react-router-dom";

const CSPMenu = ({cspDetail}) => {

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (currentPath, path) => {
        return currentPath === path ? { background: "red", color: "white"} : {color: "blue"};
    };

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        <div className="d-flex">
            <div className="d-flex flex-column flex-shrink-0 p-2 text-bg-light" style={{ width: "240px", height: "670px"}}>
                <p className="d-flex align-items-center px-2 mb-md-0 me-md-auto text-red fs-4"><span class="bi bi-cloud-fill"></span> <span className="p-2">{cspDetail.CSP_name}</span></p>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <Link 
                            to="/csp/dashboard"
                            className="nav-link"
                            style={isActive(location.pathname, "/csp/dashboard")}
                            onClick={() => handleNavigate("/csp/dashboard")}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/csp/log-history"
                            className="nav-link"
                            style={isActive(location.pathname, "/csp/log-history")}
                            onClick={() => handleNavigate("/csp/log-history")}
                        >
                            Log History
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default CSPMenu;