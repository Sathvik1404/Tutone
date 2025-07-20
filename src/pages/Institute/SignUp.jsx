import React, { useState } from "react";
import "./SignUp.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
    const [institute, setName] = useState("");
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
        console.log("Sign up submitted with", institute, email, password, confirmpassword);
        try {
            const res = await fetch("http://localhost:3000/api/institute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ institute, email, password, confirmpassword })
            });
            if (res.ok) {
                toast.success("User SignUp Successful.")
                setTimeout(() => {
                    navigate('/Login')
                }, 1000)
            } else {
                toast.warning("Institute with given Information already exists.")
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
                        <p className="logo-subtitle">List Your Institute</p>
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <div className="content">
                <div className="auth-box">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Institute Name</label>
                            <input
                                type="text"
                                value={institute}
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
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
};

export default SignUp;
