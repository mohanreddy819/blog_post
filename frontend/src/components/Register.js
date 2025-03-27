import React, { useState } from "react";
import axios from "axios";
import './register.css';
import { useNavigate } from "react-router-dom";
const API_URL = "http://127.0.0.1:8000/api/register/";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(API_URL, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", response.data.token);  
            setMessage("Registration successful! You can now log in.");
            setTimeout(() => {
                navigate("/BlogList");
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Registration failed.");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="register-form">
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Register;
