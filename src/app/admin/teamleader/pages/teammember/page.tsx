'use client';
import { useState } from 'react';
import axios from 'axios';

import TeamLeaderAdminMainLayout from '@/app/components/teamleader/TeamLreaderadminLayout';
import TeamForm from '../component/NewTeamCreated';

interface User {
    _id: string;
    username: string;
    email: string;
    department: string;
}

export default function TeamLeaderDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const departments = ['Developer', 'Designer', 'Tester', 'Marketing', 'Others'];

    const fetchUsersByDepartment = async (dept: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/admin/teamleader/${dept}`);
            setUsers(res.data);
        } catch (error: any) {
            setError(error.response?.data?.message || "Could not fetch users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Updated function to accept teamId as a parameter
    const addYourTeam = async (userId: string, teamId: string) => {
        if (addedUsers.has(userId)) return;

        try {
            setSuccessMessage(null); // Reset success message

            // Validate input fields
            if (!teamId || !userId) {
                throw new Error('All fields are required');
            }

            const res = await axios.post(`/api/admin/teamleader/teamleadercontrollers/${userId}`, {
                teamId,
                username: '', // You can include username here if needed, or pass it dynamically
                email: '', // Similarly for email
                department: '' // And for department
            });

            setAddedUsers(prev => new Set(prev).add(userId));
            setSuccessMessage(res.data.message);
            setError(null); // Reset any previous error
        } catch (err: any) {
            setError(err.response?.data?.message || "Error adding user. Please try again.");
        }
    };

    return (
        <TeamLeaderAdminMainLayout>
            <section>
                <div className='mb-10'>
                    <TeamForm />
                </div>
            </section>
            <div className="flex flex-col md:flex-row p-6 w-full mx-auto bg-white shadow-lg rounded-lg">
                <div className="w-full md:w-1/4 pr-4 border-r md:border-gray-200 md:mr-4 mb-4 md:mb-0">
                    <h1 className="text-2xl font-semibold text-center mb-6">Team Leader</h1>
                    <div className="flex flex-col gap-4">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => fetchUsersByDepartment(dept)}
                                className="px-4 py-2 text-black hover:bg-purple-600 transition duration-200 ease-in-out focus:outline-none border-[1px] transform hover:scale-105 bg-gray-100 hover:text-white"
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-3/4 pl-4">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="spinner"></div>
                            <span className="ml-2">Loading...</span>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div>
                            {successMessage && <p className="text-center text-green-500">{successMessage}</p>}
                            <h2 className="text-xl font-medium mb-4 text-center">Select Your Teams</h2>
                            <div className="max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg">
                                <ul className="space-y-3">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <li
                                                key={user._id}
                                                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm transition duration-200 ease-in-out hover:bg-gray-200"
                                            >
                                                <div>
                                                    <strong className="text-blue-600">{user.username}</strong>
                                                    <p className="text-gray-500">{user.email}</p>
                                                    <p className="text-gray-500">{user.department}</p>
                                                </div>
                                                <button
                                                    className="px-4 py-2 text-black hover:bg-purple-600 transition duration-200 ease-in-out focus:outline-none border-[1px] transform hover:scale-105 bg-gray-100 hover:text-white"
                                                    onClick={() => addYourTeam(user._id, "671fb2816a44748e9e2834b5")} // Pass the teamId dynamically here
                                                    disabled={addedUsers.has(user._id)}
                                                >
                                                    {addedUsers.has(user._id) ? 'Added' : 'Add to Your Team'}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No users found for this department.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TeamLeaderAdminMainLayout>
    );
}
