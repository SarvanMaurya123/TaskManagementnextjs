"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/store';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
    const { user, loading: authLoading } = useUser(); // Assuming you have a context provider for user data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            setLoading(true);
        } else {
            setLoading(false);
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center mt-10">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <span className="ml-2 text-gray-600">Loading...</span>
            </div>
        );
    }

    if (error) return <div className="text-center text-red-600">Error loading profile: {error}</div>;

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error updating user');
            }

            setIsEditing(false); // Exit edit mode after successful update
            Swal.fire('Success!', 'Profile updated successfully!', 'success');
        } catch (err) {
            setError('Failed to update user. Please try again.');
            console.error('Failed to update user:', err);
        }
    };

    const logout = async () => {
        try {
            await axios.get("/api/users/logout/");
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully!',
                text: 'You have logged out.',
                confirmButtonText: 'OK',
            });
            router.push("/login");
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: error.response?.data?.message || 'An error occurred during logout.',
                confirmButtonText: 'Try Again',
            });
            console.log(error.message);
        }
    };

    return (
        <div className="container mx-auto p-6 md:p-12">
            <h1 className="text-3xl font-semibold mb-6 text-center">User Profile</h1>
            <div className="flex justify-center">
                <div className="border rounded-lg shadow-lg bg-white p-8 w-full max-w-md">
                    <div className="flex flex-col items-center mb-6">
                        <FaUser className="text-blue-600 w-24 h-24 mb-4 rounded-full bg-gray-100 p-4" />
                        <h2 className="text-2xl font-semibold text-center">{user?.username || 'User Name'}</h2>
                        <p className="text-gray-600 flex items-center">
                            <FaEnvelope className="mr-2 text-blue-600" />
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg mx-2 hover:bg-blue-600 transition"
                        >
                            <FaEdit className="mr-2" />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg mx-2 hover:bg-red-600 transition"
                        >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                    </div>

                    {isEditing && (
                        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="username" className="text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="p-3 border rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 border rounded-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                            >
                                Save Changes
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
