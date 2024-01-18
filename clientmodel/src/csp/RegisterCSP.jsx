import React, { useEffect, useState } from "react";
import { getAccount, getCSPContract } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "../core/Header";

const RegisterCSP = () => {
    const [account, setAccount] = useState("");
    const [cspContract, setCSPContract] = useState(null);
    const [formData, setFormData] = useState({
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    });
    // const [isCSP, setIsCSP] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const acc = await getAccount();
                setAccount(acc);

                const cspCon = await getCSPContract();
                setCSPContract(cspCon);

                const isCSP = await cspCon.checkCSP();
                // setIsCSP(isCSP)
                if (isCSP) {
                    navigate("/csp/dashboard");
                } else {
                    navigate("/csp/register");
                }
            } catch (error) {
                console.error("Error loading account:", error.message);
                // Handle the error appropriately in your application
                // You might want to show an error message to the user
            }
        };

        loadData();
    }, [navigate, setCSPContract]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await cspContract.registerCSP(formData.name, formData.apiKey, formData.authDomain, formData.projectId, formData.storageBucket, formData.messagingSenderId, formData.appId, formData.measurementId);
            await res.wait();
            alert("CSP registered successfully!");
            window.location.reload();
            console.log("cspRegistered:", res);
        } catch (error) {
            console.log(error);
            alert("Fetching error in registration...");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFirebaseConfig = (e) => {
        try {
            const jsonString = e.target.value.replace("firebase configuration", "").trim();
            const parsedConfig = JSON.parse(jsonString);
            setFormData({
                ...formData,
                ...parsedConfig
            });
            console.log(parsedConfig);
        } catch (error) {
            console.error("Error parsing Firebase configuration:", error.message);
            // Handle the error appropriately in your application
            // You might want to show an error message to the user
        }
    };

    return (
        <div>
            <Header account={account} />
            <div className="modal modal-sheet position-static d-block bg-body-secondary" style={{ height: "670px" }}>
                <div className="modal-dialog">
                    <div className="modal-content rounded-4 align-items-center shadow">
                        <div className="modal-header border-bottom-0">
                            <h3 className="mb-2">Register CSP</h3>
                        </div>
                        <div className="modal-body p-3 pt-0">
                            <form className="form-floating mb-3" onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <label>Name </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label>Cloud Configuration</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        name="firebaseConfig"
                                        value={JSON.stringify(formData, null, 2)}
                                        onChange={handleFirebaseConfig}
                                    />
                                </div>
                                <button className="w-100 mt-2 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCSP;
