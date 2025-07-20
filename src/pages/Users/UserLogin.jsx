import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserLogin.css";

const UserLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login submitted with", email, password);

        try {
            const res = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Login Successful!");

                // Store user and token in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                sessionStorage.setItem("instituteName", "");

                setTimeout(() => {
                    navigate("/Course");
                }, 1500);
            }
            else {
                toast.error("Invalid Credentials! Try again.");
            }
        } catch (error) {
            toast.error("Network Error! Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-header">
                <header className="header">
                    <div className="logo-container">
                        <h1 className="logo">TUTONE</h1>
                        <p className="logo-subtitle">Welcome Back Student</p>
                    </div>
                </header>
            </div>

            <div className="content">
                <div className="auth-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="auth-btn">Login</button>
                    </form>
                    <p>Don't have an account? <a href="/UserSignup">Sign up</a></p>
                </div>
            </div>

            {/* Toast Container for displaying notifications */}
            <ToastContainer position="top-right" />
        </div>
    );
};

export default UserLogin;
