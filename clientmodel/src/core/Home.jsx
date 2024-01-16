import "../style.css";
import { useState, useEffect } from "react";
import { getAccount } from "../config";
import Header from "./Header";

const Home = () => {
    const [account, setAccount] = useState("");

    useEffect(() => {
        const loadAccount = async () => {
            try {
                const res = await getAccount();
                setAccount(res);
            } catch (error) {
                console.error("Error loading account:", error.message);
                // Handle the error appropriately in your application
            }
        };

        loadAccount();
    }, []); // Corrected dependency array

    return (
        <Header account={account} />
    );
};

export default Home;
