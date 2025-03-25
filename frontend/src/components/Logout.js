import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/logout/";

function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoggedIn(false);  
                navigate("/login");
                return;
            }

            try {
                await axios.post(API_URL, {}, {
                    headers: { Authorization: `Token ${token}` }
                });

                localStorage.removeItem("token");  
                setIsLoggedIn(false); 
                navigate("/BlogList");  
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        handleLogout();
    }, [navigate, setIsLoggedIn]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
}

export default Logout;
