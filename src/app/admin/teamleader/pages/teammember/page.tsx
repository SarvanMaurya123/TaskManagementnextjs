'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import TeamForm from '../component/NewTeamCreated';
import TeamLeaderAdminMainLayout from '@/app/components/teamleader/TeamLreaderadminLayout';
import toast, { Toaster } from 'react-hot-toast';

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
    const [teamId, setTeamId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const departments = ['Developer', 'Designer', 'Tester', 'Markating', 'Others'];

    // Retrieve the team ID from sessionStorage when the component mounts
    useEffect(() => {
        const storedTeamId = sessionStorage.getItem('teamId');
        setTeamId(storedTeamId || null);
    }, []);

    const fetchUsersByDepartment = async (dept: string) => {
        setLoading(true);
        setError(null); // Clear any previous error

        try {
            const res = await axios.get(`/api/admin/teamleader/${dept}`);

            // if (res.data.length > 0 && res.data[0]._id) {
            //     const firstUserId = res.data[0]._id;
            sessionStorage.setItem('userId', res.data[0]._id); // Store the user ID as a string
            //     console.log(`User ID stored in session storage: ${firstUserId}`); // For debugging
            // }

            setUsers(res.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Could not fetch users. Please try again later.";
            toast.error(errorMessage);
            setError(errorMessage); // Set error state
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAdd = async (userId: string) => {
        if (!teamId) {
            toast.error('No Team ID available. Please select a team.');
            return;
        }

        if (addedUsers.has(userId)) {
            toast.error('This user has already been added.');
            return;
        }

        setIsAdding(true); // Set loading state for adding user
        try {
            const response = await axios.post(`/api/admin/teamleader/teamleadercontrollers/`, {
                userId: userId,
                teamId: teamId,
            });

            if (response.data.success) {
                toast.success("Member added successfully!");
                setAddedUsers(prev => new Set(prev).add(userId));

            } else {
                toast.error(response.data.message || 'Failed to add member');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            toast.error(errorMessage);
            console.error("Error adding user:", error);
        } finally {
            setIsAdding(false); // Reset loading state
        }
    };

    return (
        <TeamLeaderAdminMainLayout>
            <section className="p-6">
                <div className="mb-10">
                    <TeamForm onTeamCreated={setTeamId} />
                </div>
            </section>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex flex-col md:flex-row p-6 w-full mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="w-full md:w-1/4 pr-4 border-r md:border-gray-200 md:mr-4 mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Team Leader</h1>
                    <div className="flex flex-col gap-4">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => fetchUsersByDepartment(dept)}
                                className="flex items-center justify-center px-4 py-2 text-gray-800 hover:bg-purple-600 hover:text-white transition duration-200 ease-in-out focus:outline-none border-2 border-purple-300 transform hover:scale-105 bg-white"
                            >
                                <span className="font-semibold">{dept}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-3/4 pl-4">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="spinner" aria-label="Loading users..."></div>
                            <span className="ml-2 text-gray-600"></span>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p className="text-center text-gray-500">No users found for this department.</p>
                    ) : (
                        <div className="p-4">
                            <ul className="bg-white overflow-y-auto">
                                {users.map((user) => (
                                    <li key={user._id} className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-300 ease-in-out border-[1px] mb-2 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-lg">{user.username}</span>
                                            <span className="text-gray-700 text-sm">{user.email}</span>
                                            <span className="text-gray-500 text-xs">{user.department}</span>
                                        </div>

                                        <button
                                            onClick={() => handleUserAdd(user._id)}
                                            disabled={addedUsers.has(user._id) || isAdding}
                                            className={`ml-4 px-4 py-2 rounded-lg transition duration-300 ease-in-out 
                                             ${addedUsers.has(user._id)
                                                    ? 'bg-green-500 cursor-not-allowed text-white shadow-sm'
                                                    : 'bg-gray-400 hover:bg-gray-600 text-white shadow-lg'
                                                }`}
                                        >
                                            {addedUsers.has(user._id) ? 'Added' : 'Add'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </TeamLeaderAdminMainLayout>
    );
}
