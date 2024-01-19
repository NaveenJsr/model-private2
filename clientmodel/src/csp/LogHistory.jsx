import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, getCSPContract} from "../config";
import Header from "../core/Header";
import CSPMenu from "./CSPMenu";

const LogHistory = () => {
    const [account, setAccount] = useState("");
    const [isCSP, setIsCSP] = useState(false);
    const [cspDetail, setCSPDetail] = useState([]);
    const [logHistory, setLogHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const acc = await getAccount();
                setAccount(acc);

                const cspCon = await getCSPContract();

                const isCSP = await cspCon.checkCSP();
                setIsCSP(isCSP);
                if (!isCSP || !acc) {
                    navigate("/csp/register");
                    return;
                }

                const cspDetails = await cspCon.getCSPDetail();
                setCSPDetail(cspDetails);

                const log = await cspCon.getLog();
                setLogHistory(log);

            } catch (error) {
                console.error("Error loading account:", error.message);
            }
        };

        loadData();
    }, [navigate]);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
        return formattedDateTime;
    }

    return (
        <div>
            <Header account={account} />
            {isCSP && (
                <div className="d-flex">
                <CSPMenu cspDetail={cspDetail} />
                <div className="container">
                    <div className="bg-white">
                        <div className="p-3">
                            <div className="d-flex">
                                <h3>Log History</h3>
                            </div>
                            <div>
                                <div className="border rounded-3">
                                    <div className="table-responsive p-3">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>User</th>
                                                    <th>File</th>
                                                    <th>Granted at</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logHistory.map((ele, i) => (
                                                    <tr key={i}>
                                                        <td>{ele.user.substring(0, 20) + "..."}</td>
                                                        <td>{ele.fileHash.substring(0, 20) + "..."}</td>
                                                        <td>{formatTimestamp(ele.grantTime)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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

export default LogHistory;