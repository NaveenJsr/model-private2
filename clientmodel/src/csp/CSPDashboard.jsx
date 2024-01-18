import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, getCSPContract } from "../config";
import Header from "../core/Header";
import CSPMenu from "./CSPMenu";

const CSPDashboard = () => {
    const [account, setAccount] = useState("");
    const [cspContract, setCSPContract] = useState(null);
    const [cspDetail, setCspDetail] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const acc = await getAccount();
                setAccount(acc);

                const cspCon = await getCSPContract();
                setCSPContract(cspCon);

                const isCSP = await cspCon.checkCSP();
                console.log(isCSP);
                if (!isCSP) {
                    navigate("/csp/register");
                    return;
                }

                const cspdetail = await  cspCon.getCSPDetail();
                console.log(cspdetail)
                setCspDetail(cspdetail);

                


            } catch (error) {
                console.error("Error loading account:", error.message);
            }
        };

        loadData();
    }, [navigate]);

    // const handleListing = async () => {
    //     if(!uploadedFiles){
    //         return;
    //     }
    //     try{
    //         const res = await identityContract.setStoredFile(account, uploadedFiles);
    //         alert("Files Listed Succesfully!");
    //         console.log(res)
    //     }
    //     catch(error){
    //         console.log(error);
    //     }
    // }

    return (
        <div>
            <Header account={account} />
            <CSPMenu cspDetail={cspDetail} />
        </div>
    );
};

export default CSPDashboard;