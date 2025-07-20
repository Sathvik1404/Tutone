import React, { useState } from "react";
import "./UserSignUp.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert("Passwords do not match!");
            return;
        }
        // Handle signup logic here
        console.log("Sign up submitted with", name, email, password, confirmpassword);
        try {
            const res = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, confirmpassword })
            });
            // Optionally handle the response here
            if (res.ok) {
                toast.success("User Information Saved Successfully");
                setTimeout(() => {
                    navigate('/UserLogin');
                }, 1500)
            } else {
                toast.warning("User with given details already exists.")
            }
        }
        catch (err) {
            toast.err(err);
        }
    };

    return (
        <div className="landing-container">
            {/* Animated Background Layer */}
            {/* Header with Animated Logo/Title */}
            <div className="landing-header">
                <header className="header">
                    <div className="logo-container">
                        <h1 className="logo">TUTONE</h1>
                        <p className="logo-subtitle">Create Your Account</p>
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <div className="content">
                <div className="auth-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmpassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn">
                            Sign Up
                        </button>
                    </form>
                    <p>
                        Already have an account? <a href="/UserLogin">Login</a>
                    </p>
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
};

export default UserSignUp;
