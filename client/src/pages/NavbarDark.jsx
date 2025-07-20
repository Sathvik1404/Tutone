import React from 'react';
import { useNavigate } from 'react-router-dom';
const NavbarDark = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <nav className='bg-purple-700 w-full flex justify-between items-center px-10 py-5'>
            <div className='text-4xl font-extrabold text-white font-serif'>
                AI FORMX
            </div>
            <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
            >
                Logout
            </button>

        </nav>
    );
};

export default NavbarDark;