import { useEffect, useState } from "react";
import { getAccount, getUserContract } from "../config";
import { useNavigate } from "react-router-dom";
import Header from "../core/Header"

const LoginUser = () => {
    const [account, setAccount] = useState("");
    const [userContract, setUserContract] = useState(null);
    const [formData, setFormData] = useState({
        password: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const accountRes = await getAccount();
                setAccount(accountRes);

                const contractRes = await getUserContract();
                setUserContract(contractRes);

                const isUserRes = await contractRes.checkUser();

                if (!isUserRes) {
                    navigate("/user/register");
                }

                const isAuthenticated = await contractRes.isAuthenticated();
                if(isAuthenticated.success){
                    navigate("/user/dashboard");
                }

            } catch (error) {
                console.error("Error loading data:", error.message);
                // Handle the error appropriately in your application
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await userContract.authenticateUser(
                formData.password
            );
            await res.wait()
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Fetching errors in registration...");
        }
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Header account={account} />
            
            <div className="modal modal-sheet position-static d-block bg-body-secondary py-md-4" style={{ height: "670px" }}>
                <div className="modal-dialog">
                    <div className="modal-content rounded-4 align-items-center shadow">
                        <div className="modal-header border-bottom-0">
                            <h3 className="mb-3">Login User</h3>
                        </div>

                        <div className="modal-body p-3 pt-0">
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        id="floatingInput"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="floatingInput">Password</label>
                                </div>
                                
                                <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;
