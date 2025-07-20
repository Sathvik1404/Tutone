import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const navigate = useNavigate();
    const [institute, setInstitute] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login submitted with", institute, email, password);
        try {
            const res = await fetch('http://localhost:3000/api/institute/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, institute })
            });
            if (res.ok) {
                const InstituteName = sessionStorage.setItem("instituteName", institute)
                console.log(InstituteName)
                toast.success("Institute Login Successful");
                setTimeout(() => {
                    navigate('/Course');
                }, 1000)
            }
            else {
                toast.warning("There was an error in Logging in");
            }

        }
        catch (err) {
            toast.warning(err);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-header">
                <header className="header">
                    <div className="logo-container">
                        <h1 className="logo">TUTONE</h1>
                        <p className="logo-subtitle">Welcome Back Institute</p>
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <div className="content">
                <div className="auth-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Institute</label>
                            <input
                                type="text"
                                value={institute}
                                onChange={(e) => setInstitute(e.target.value)}
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
                        <button type="submit" className="auth-btn">
                            Login
                        </button>
                    </form>
                    <p>
                        Don't have an account? <a href="/Signup">Sign up</a>
                    </p>
                </div>
            </div>
            <ToastContainer position="top-right" />
        </div>
    );
};

export default Login;
