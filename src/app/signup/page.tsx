"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Swal from 'sweetalert2';
import './sign.css';

const SignUpPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        department: ""
    });

    const [validationErrors, setValidationErrors] = useState({
        username: "",
        email: "",
        password: "",
        department: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Email validation
    const validateEmail = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(email).toLowerCase());
    };

    // Password validation
    const validatePassword = (password: any) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
        return passwordRegex.test(password);
    };

    // Handle input changes and validate in real-time
    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });

        // Real-time validation messages
        if (id === "email") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                email: value && !validateEmail(value) ? "Please enter a valid email address." : ""
            }));
        }

        if (id === "password") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                password: value && !validatePassword(value) ? "Password must be 6 to 12 characters long and include at least one letter and one number." : ""
            }));
        }

        if (id === "username") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                username: value.length < 3 ? "Username must be at least 3 characters long." : ""
            }));
        }

        if (id === "department") {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                department: value ? "" : "Department is required."
            }));
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const onSignUp = async (e: any) => {
        e.preventDefault();

        // Validate all fields
        if (!user.username || !user.email || !user.password || !user.department) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Failed!',
                text: 'All fields are required.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!validateEmail(user.email) || !validatePassword(user.password)) {
            return; // Errors will be handled in real-time validation
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup/", user);
            console.log("Sign Up successfully!", response.data);

            Swal.fire({
                icon: 'success',
                title: 'Sign Up Successfully!',
                text: 'You can now log in.',
                confirmButtonText: 'OK'
            });

            setTimeout(() => {
                router.push("/login");
            }, 1000);

        } catch (error: any) {
            console.log("Data not saved", error);
            const errorMessage = error.response?.data?.message || 'Please check your email and username.';
            Swal.fire({
                icon: 'error',
                title: 'Sign Up Failed!',
                text: errorMessage,
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.username && user.email && user.password && user.department) || loading);
    }, [user, loading]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-[1px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
                    {loading ? <div className="spinner dark:text-black"></div> : "Sign Up Now"}
                </h2>
                <form className="space-y-4" onSubmit={onSignUp}>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="username" className="text-sm font-semibold dark:text-black text-black">Username*</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            placeholder="Enter User Name"
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400 dark:text-black text-black"
                        />
                        {validationErrors.username && <p className="text-red-500 text-sm">{validationErrors.username}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold dark:text-black text-black">Email*</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            placeholder="Enter email"
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400 dark:text-black"
                        />
                        {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="password" className="text-sm font-semibold dark:text-black text-black">Password*</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                value={user.password}
                                placeholder="Enter password"
                                onChange={handleInputChange}
                                className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400 dark:text-black"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 "
                            >
                                {passwordVisible ? "Hide" : "Show"}
                            </button>
                        </div>
                        {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="department" className="text-sm font-semibold text-black">Department*</label>
                        <select
                            id="department"
                            value={user.department}
                            onChange={handleInputChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[1px] focus:ring-orange-400 dark:text-black text-black"
                        >
                            <option value="" disabled>Select Department</option>
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Tester">Tester</option>
                            <option value="Markating">Markating</option>
                            <option value="Others">Others</option>

                            {/* ['Developer', 'Designer', 'Tester', 'Markating', 'Others'] */}
                        </select>
                        {validationErrors.department && <p className="text-red-500 text-sm">{validationErrors.department}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full bg-orange-500 text-white py-3 rounded-md font-semibold ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600 transition duration-300'}`}
                    >
                        {loading ? "Processing..." : "Sign Up Now"}
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/login" className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <span className="text-orange-500 font-semibold hover:underline">Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;


