// app/components/Sidebar.jsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaTachometerAlt, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Sidebar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const logout = async () => {
        try {
            await axios.get("/api/users/logout/");
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully!',
                text: 'You have logged out.',
                confirmButtonText: 'OK'
            });
            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            {/* Toggle button */}
            <button
                className="absolute top-5 left-5 text-gray-700 text-3xl z-50 bg-gradient-to-r from-indigo-600 to-purple-500 p-2 rounded-full shadow-md hover:bg-indigo-500 transition-transform duration-300"
                onClick={toggleSidebar}
            >
                {isOpen ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 p-6 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <h1 className="text-3xl font-semibold text-purple-400 ml-10">&#60;SM/&#62;</h1>
                    {/* <button className="text-gray-400 hover:text-purple-400 transition duration-300" onClick={toggleSidebar}>
                        <FaTimes />
                    </button> */}
                </div>

                <nav className="flex-1 mt-10 space-y-6">
                    <ul className="space-y-5">
                        {[
                            { name: 'Home', icon: <FaHome />, path: '/' },
                            { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
                            { name: 'Profile', icon: <FaUser />, path: '/profile' },
                            { name: 'Settings', icon: <FaCog />, path: '/settings' },
                        ].map((item, index) => (
                            <li key={index}>
                                <Link href={item.path} onClick={toggleSidebar} className="flex items-center space-x-4 px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-300 text-lg hover:shadow-lg">
                                    <span className="text-xl text-purple-400">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                className="flex items-center w-full space-x-4 px-6 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-300 text-lg  hover:shadow-lg mb-5"
                                onClick={() => {
                                    logout();
                                    toggleSidebar();
                                }}
                            >
                                <FaSignOutAlt className="text-xl" />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto text-center py-4 border-t border-gray-700 mt-5">
                    <p className="text-sm text-gray-500">© 2024 Your Company</p>
                </div>
            </aside>
            {isOpen && (
                <div
                    className="fixed  bg-black opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}
