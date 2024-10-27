"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import '../signup/sign.css';

// Helper functions for validation
const validateEmail = (email: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: any) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/.test(password);

// Feedback Message Component
const FeedbackMessage = ({ message, type }) => {
    return (
        <p className={`text-center ${type === 'error' ? 'text-red-600' : 'text-green-600'} mb-4`}>
            {message}
        </p>
    );
};

const AdminSignup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Client-only rendering
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be 6 to 12 characters long and contain at least one letter, one number, and one special character.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/admin/signup/", {
                username,
                email,
                password,
                role,
            });

            const data = response.data;
            if (!data.success) {
                setError(data.message);
            } else {
                setSuccess(data.message);
                // Clear fields
                setUsername("");
                setEmail("");
                setPassword("");
                setRole("admin");

                setTimeout(() => router.push("/admin/login"), 1000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An unexpected error occurred.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md">
                <h1 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="spinner"></div>
                            <span className="ml-2">Loading...</span>
                        </div>
                    ) : (
                        "Sign Up Admin"
                    )}
                </h1>
                {error && <FeedbackMessage message={error} type="error" />}
                {success && <FeedbackMessage message={success} type="success" />}

                <div className="mb-5">
                    <label htmlFor="username" className="block text-gray-800 text-sm font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block text-gray-800 text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block text-gray-800 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="role" className="block text-gray-800 text-sm font-semibold mb-2">Access Level</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="admin">Admin</option>
                        <option value="TeamLeader">Team Leader</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full hover:bg-blue-700 transition duration-300 shadow-lg"
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <p className="text-gray-600 text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/admin/login">
                        <span className="text-blue-600 hover:text-blue-700 font-semibold transition">Login Now</span>
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default AdminSignup;
