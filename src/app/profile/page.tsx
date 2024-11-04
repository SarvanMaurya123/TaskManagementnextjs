'use client';
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
    const router = useRouter()
    useEffect(() => {
        // Simulate loading user data
        if (!user) {
            setLoading(true);
        } else {
            setLoading(false);
            // Populate fields with user data
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);



    if (authLoading || loading) return (
        <div className="flex items-center justify-center mt-10">
            <div className="spinner" aria-label="Loading user profile..."></div>
            <span className="ml-2 text-gray-600">Loading...</span>
        </div>
    );

    if (error) return <div>Error loading profile: {error}</div>;

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // Retrieve the JWT from local storage or cookies

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

            console.log('User updated successfully:', data);
            setIsEditing(false); // Exit edit mode after successful update
        } catch (err) {
            console.error('Failed to update user:', err);
            setError('Failed to update user. Please try again.');
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
                confirmButtonText: 'OK'
            });
            router.push("/login");
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: error.response?.data?.message || 'An error occurred during logout.',
                confirmButtonText: 'Try Again'
            });
            console.log(error.message);
        }
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
            <div className="flex justify-center">
                <div className='border rounded-lg shadow-lg bg-white p-8 max-w-sm w-full'>
                    <div className="flex flex-col items-center mb-6">
                        <FaUser className="text-blue-600 w-[100px] h-[100px] mb-4" />
                        <h2 className="text-xl font-semibold text-center">
                            {user?.username || 'User Name'}
                        </h2>
                        <p className="text-gray-600 flex items-center">
                            <FaEnvelope className="mr-2 text-blue-600" /> {user?.email || 'user@example.com'}
                        </p>
                        <p className="text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-600" /> Joined: {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center bg-blue-500 text-white px-8 py-3 rounded mx-2 hover:bg-blue-600 transition">
                            <FaEdit className="mr-2" /> {/* Change margin-right to mr-2 for spacing */}
                            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span> {/* Wrap text in a span for clarity */}
                        </button>
                        <button className="flex items-center bg-red-500 text-white p-2 rounded mx-2 hover:bg-red-600 transition"
                            onClick={logout}
                        >
                            <FaSignOutAlt className="mr-2" /> {/* Change margin-right to mr-2 for spacing */}
                            <span>Logout</span> {/* Wrap text in a span for clarity */}
                        </button>
                    </div>


                    {isEditing && (
                        <form onSubmit={handleUpdate} className="mt-4">
                            <div className="flex flex-col mb-4">
                                <label htmlFor="username" className="mb-1">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label htmlFor="email" className="mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 border rounded"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-green-500 text-white p-2 rounded mx-2 hover:bg-green-600 transition">
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
