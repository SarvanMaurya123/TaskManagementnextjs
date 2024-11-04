"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Swal from 'sweetalert2';
import "./login.css";

// Define the User interface
interface User {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<User>({
        email: "",
        password: ""
    });
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState<{ email?: string; password?: string }>({});

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission
        setValidationErrors({}); // Clear previous validation errors

        const newErrors: { email?: string; password?: string } = {};
        // Validate email
        if (!user.email) {
            newErrors.email = "Email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user.email)) {
                newErrors.email = "Please enter a valid email address.";
            }
        }

        // Validate password
        if (!user.password) {
            newErrors.password = "Password is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors); // Set validation errors
            return; // Prevent submission if there are errors
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/login/", user);
            // console.log("Login successful!", response.data);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back!',
                confirmButtonText: 'OK'
            });
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error: any) {
            console.log("Login failed", error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed!',
                text: error.response?.data?.message || 'Please check your email and password.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password));
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="spinner"></div>
                            <span className="ml-2"></span>
                        </div>
                    ) : (
                        "Login Now"
                    )}
                </h2>
                <form className="space-y-4" onSubmit={onLogin}>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold">Email*</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            placeholder="Enter email"
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400"
                        />
                        {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                    </div>

                    <div className="flex flex-col space-y-2 relative">
                        <label htmlFor="password" className="text-sm font-semibold">Password*</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            value={user.password}
                            placeholder="Enter password"
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400"
                        />
                        <Link href="/forgetpassemail" className="text-right text-blue-400 mt-3 mb-3">
                            Forget Password
                        </Link>
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-[40%] transform -translate-y-1/2 text-sm text-gray-600"
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </button>
                        {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={buttonDisabled || loading}
                        className={`w-full bg-orange-500 text-white py-3 rounded-md font-semibold ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 transition duration-300'}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/signup" className="text-sm text-gray-600">
                            Do not have an Account?{' '}
                            <span className="text-orange-500 font-semibold hover:underline">Sign Up</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
