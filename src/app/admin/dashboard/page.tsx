"use client";

import AdminMainLayout from "@/app/components/dashboard/adminLayout";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ActiveUserStats from "@/app/admin/dashboard/users/totaluser/page";
import DepartmentChart from "@/app/admin/teamleader/pages/dashboard/chart/page";

const AdminDashboard = () => {
    const router = useRouter();

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
            console.error(error.message);
        }
    };

    return (
        <AdminMainLayout>
            <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md w-full">
                <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600" onClick={logout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6 space-y-6">
                <p className="text-gray-700">Welcome back, Admin!</p>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

                <ActiveUserStats />

                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2 text-center">
                        User Department Distribution
                    </h2>
                    <DepartmentChart />
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Weekly Sales</h2>
                        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md">
                            <span className="text-gray-500">Chart goes here</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Messages</h2>
                        <div className="h-40 bg-gray-100 flex items-center justify-center rounded-md">
                            <span className="text-gray-500">Messages component</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminMainLayout>
    );
};

export default AdminDashboard;
