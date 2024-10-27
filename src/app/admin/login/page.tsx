"use client"; // Marking this file as a client component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../login/sign.css';
const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/admin/login', { email, password });
            if (response.data.success) {
                router.push('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "An error occurred during login.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-0">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="spinner"></div>
                        <span className="ml-2"></span>
                    </div>
                ) : (

                    <p className='text-center text-2xl'>Login Admin</p>
                )}
                {error && (
                    <div className="flex items-center text-red-700 bg-red-100 p-3 mb-4 rounded border border-red-300">
                        <span className="material-icons mr-2">error</span>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border rounded w-full py-2 px-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border rounded w-full py-2 px-3 mt-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold w-full py-3 rounded-md hover:bg-blue-700 transition duration-200 shadow-lg transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
                <p className="text-gray-600 text-center mt-4">
                    Don't have an account?{" "}
                    <a href="/admin/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
