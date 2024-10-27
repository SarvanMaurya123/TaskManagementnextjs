"use client";

import AdminMainLayout from "@/app/components/dashboard/adminLayout";
import axios from "axios";
import { DollarSign, Home, ListTodo, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AdminDashboard = () => {
    const router = useRouter()
    const logout = async () => {
        try {
            await axios.get("/api/admin/logout/");
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully!',
                text: 'You have logged out.',
                confirmButtonText: 'OK'
            });
            router.push("/admin/login");
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <AdminMainLayout>
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md w-full">
                <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded px-2 py-1"
                    />
                    <p className="text-gray-700">Welcome back, Admin!</p>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded
                     hover:bg-orange-600"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Dashboard Content */}
            <div className="flex-1 p-6 space-y-6">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                            <p className="text-2xl font-bold text-gray-900">1,234</p>
                        </div>
                        <div className="text-blue-500">
                            {/* Example Icon */}
                            <Home size={32} />
                        </div>
                    </div>
                    {/* Repeat for other KPIs */}
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">New Signups</h2>
                            <p className="text-2xl font-bold text-gray-900">567</p>
                        </div>
                        <div className="text-green-500">
                            <UserPlus size={32} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Sales</h2>
                            <p className="text-2xl font-bold text-gray-900">$24,500</p>
                        </div>
                        <div className="text-yellow-500">
                            <DollarSign size={32} />
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Pending Tasks</h2>
                            <p className="text-2xl font-bold text-gray-900">76</p>
                        </div>
                        <div className="text-red-500">
                            <ListTodo size={32} />
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 font-semibold">User A signed up</p>
                                <p className="text-gray-500 text-sm">2 hours ago</p>
                            </div>
                            <span className="text-gray-400 text-sm">Activity Type</span>
                        </li>
                        {/* Repeat for more activities */}
                    </ul>
                </div>

                {/* Additional Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Sales</h2>
                        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md">
                            {/* Placeholder for a chart */}
                            <span className="text-gray-500">Chart goes here</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Messages</h2>
                        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md">
                            {/* Placeholder for messages or another widget */}
                            <span className="text-gray-500">Messages component</span>
                        </div>
                    </div>
                </div>
            </div>

        </AdminMainLayout>
    );
};

export default AdminDashboard;
