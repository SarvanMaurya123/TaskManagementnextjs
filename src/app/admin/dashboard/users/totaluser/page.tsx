'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the interfaces for the expected data structure
interface MonthWiseUser {
    _id: {
        year: number;
        month: number;
    };
    count: number;
    growth: string; // Make sure this aligns with your data
}

interface Department {
    _id: string;
    count: number;
}

interface UserStats {
    status: string;
    totalActiveUsers: number;
    totalInactiveUsers: number;
    monthWiseActiveUsers: MonthWiseUser[];
    topDepartments: Department[];
    signUpsLastMonth: number; // Added signUpsLastMonth to the UserStats interface
}

export default function ActiveUserStats() {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const response = await axios.post('/api/admindashboard'); // No data needed in POST
                setUserStats(response.data);
            } catch (err: any) {
                if (axios.isAxiosError(err)) {
                    setError(`Error: ${err.response?.data?.message || 'An error occurred while fetching user stats.'}`);
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats(); // Call the function
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center">
            <div className="spinner" aria-label="Loading users..."></div>
            <span className="ml-2 text-gray-600"></span>
        </div>
    );

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white shadow-md rounded-md max-w-[100%] min-w-max">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">User Statistics</h2>
            {/* Total Active and Inactive Users */}
            <div className="mb-6 flex flex-col md:flex-row md:space-x-6">
                {/* Total Active Users Card */}
                <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM10 1a9 9 0 100 18A9 9 0 0010 1zm-1 9H8V8a1 1 0 112 0v2zm3 0h-2v-2a1 1 0 112 0v2z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-800">Total Active Users: {userStats?.totalActiveUsers}</p>
                </div>

                {/* Total Inactive Users Card */}
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center">
                    <svg className="w-6 h-6 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM10 1a9 9 0 100 18A9 9 0 0010 1zm-1 9H8V8a1 1 0 112 0v2zm3 0h-2v-2a1 1 0 112 0v2z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-800">Total Inactive Users: {userStats?.totalInactiveUsers}</p>
                </div>

                {/* Sign Ups Last Month Card */}
                <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM10 1a9 9 0 100 18A9 9 0 0010 1zm-1 9H8V8a1 1 0 112 0v2zm3 0h-2v-2a1 1 0 112 0v2z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-800">Sign Ups Last Month: {userStats?.signUpsLastMonth}</p>
                </div>
            </div>

            {/* Month-Wise Active Users */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-purple-700 mb-4">Monthly New Active Users</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent">
                        <thead>
                            <tr className="bg-purple-700 text-white rounded-lg">
                                <th className="py-3 px-4 border-b-2 border-gray-300">Year</th>
                                <th className="py-3 px-4 border-b-2 border-gray-300">Month</th>
                                <th className="py-3 px-4 border-b-2 border-gray-300">User Count</th>
                                <th className="py-3 px-4 border-b-2 border-gray-300">Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userStats?.monthWiseActiveUsers.map((item, index) => (
                                <tr key={index} className={`border-b transition-colors duration-300 ease-in-out ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}>
                                    <td className="py-2 px-4 text-center font-medium text-gray-800">{item._id.year}</td>
                                    <td className="py-2 px-4 text-center font-medium text-gray-800">{item._id.month}</td>
                                    <td className="py-2 px-4 text-center font-medium text-gray-800">{item.count}</td>
                                    <td className="py-2 px-4 text-center font-medium text-gray-800">{item.growth}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Departments */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-purple-600 mb-4">Top Departments by Active Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userStats?.topDepartments.map((dept, index) => (
                        <div key={index} className="bg-purple-100 shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                            <span className="text-gray-800 font-semibold">{dept._id}</span>
                            <span className="text-gray-600">{dept.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
