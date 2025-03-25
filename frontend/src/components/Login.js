import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const API_URL = "http://127.0.0.1:8000/api/login/";

function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "application/json" }, 
            });
            localStorage.setItem("token", response.data.token);
            setIsLoggedIn(true); 
            navigate("/BlogList"); 
        } catch (error) {
            setMessage(error.response?.data?.error || "Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <a href="/">Forgot Password?</a><br></br>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
