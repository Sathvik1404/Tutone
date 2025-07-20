// import React, { useState } from 'react';
// import './LandingPage.css';

// const LandingPage = () => {
//     const [activeLogin, setActiveLogin] = useState(null);

//     const handleLoginClick = (type) => {
//         setActiveLogin(type);
//     };

//     const closeModal = () => {
//         setActiveLogin(null);
//     };

//     return (
//         <div className="landing-container">
//             <div className="background-animation">
//                 <div className="shape shape1"></div>
//                 <div className="shape shape2"></div>
//                 <div className="shape shape3"></div>
//             </div>

//             <header className="header">
//                 <div className="logo-container">
//                     <div className="logo">TUTONE</div>
//                     <div className="logo-subtitle">Learning Made Easy</div>
//                 </div>
//             </header>

//             <main className="main-content">
//                 <h1 className="main-title">Welcome to TUTONE</h1>
//                 <p className="subtitle">Choose your login type to get started</p>

//                 <div className="login-options">
//                     <div
//                         className="login-card customer"
//                         onClick={() => handleLoginClick('customer')}
//                     >
//                         <div className="card-icon">👤</div>
//                         <h2>Customer Login</h2>
//                         <p>Access your personal learning dashboard</p>
//                     </div>

//                     <div
//                         className="login-card institute"
//                         onClick={() => handleLoginClick('institute')}
//                     >
//                         <div className="card-icon">🏛️</div>
//                         <h2>Institute Login</h2>
//                         <p>Manage your institute and courses</p>
//                     </div>
//                 </div>
//             </main>

//             {activeLogin && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal" onClick={e => e.stopPropagation()}>
//                         <button className="close-button" onClick={closeModal}>×</button>
//                         <h2>{activeLogin === 'customer' ? 'Customer Login' : 'Institute Login'}</h2>
//                         <form className="login-form">
//                             <div className="form-group">
//                                 <input type="email" placeholder="Email" required />
//                             </div>
//                             <div className="form-group">
//                                 <input type="password" placeholder="Password" required />
//                             </div>
//                             <button type="submit" className="submit-button">
//                                 Login
//                             </button>
//                         </form>
//                         <div className="form-footer">
//                             <a href="#forgot-password">Forgot Password?</a>
//                             <a href="#register">Register Now</a>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LandingPage;


import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    const [activeLogin, setActiveLogin] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    const navigate = useNavigate()
    // const handleLoginClick = (type) => {
    //     setActiveLogin(type);
    // };
    const handleStudent = () => {
        navigate('./UserLogin')
    }
    const handleInstitute = () => {
        navigate('./Login')
    }
    const closeModal = () => {
        setActiveLogin(null);
    };

    return (
        <div className={`landing-container ${isVisible ? 'visible' : ''}`}>
            <header className="header">
                <div className="logo-container">
                    <div className="logo">
                        <span className="logo-text">TUTONE</span>
                        <div className="logo-shine"></div>
                    </div>
                    <div className="logo-subtitle">Empowering Education, Enriching Futures</div>
                </div>
            </header>

            <main className="main-content">
                <h1 className="main-title">
                    <span className="gradient-text">Transform Your Learning Journey</span>
                </h1>
                <p className="subtitle">Join our community of learners and educators</p>

                <div className="login-options">
                    <div
                        className={`login-card customer ${isVisible ? 'slide-in-left' : ''}`}
                    // onClick={() => handleLoginClick('customer')}
                    >
                        <div className="card-content">
                            <div className="card-icon">👤</div>
                            <h2>Student Login</h2>
                            <p>Access personalized learning experiences</p>
                            <ul className="feature-list">
                                <li>📚 Access Course Materials</li>
                                <li>📝 Track Your Progress</li>
                                <li>🎯 Set Learning Goals</li>
                            </ul>
                            <button className="login-button" onClick={handleStudent}>Get Started</button>
                        </div>
                    </div>

                    <div
                        className={`login-card institute ${isVisible ? 'slide-in-right' : ''}`}
                    // onClick={() => handleLoginClick('institute')}
                    >
                        <div className="card-content">
                            <div className="card-icon">🏛️</div>
                            <h2>Institute Login</h2>
                            <p>Manage your educational institution</p>
                            <ul className="feature-list">
                                <li>👨‍🏫 Manage Courses</li>
                                <li>📊 Track Performance</li>
                                <li>🤝 Engage Students</li>
                            </ul>
                            <button className="login-button" onClick={handleInstitute}>Access Portal</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;