// File: components/UserInfoModal.tsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import a user icon
import Link from 'next/link'; // Import Link for navigation

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: {
        username: string;
        email: string;
        department: string;
    } | null;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) return null; // Hide modal if not open or no member data

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                {/* Profile Icon */}
                <div className="flex justify-center mb-4">
                    <FaUserCircle className="text-blue-600" size={100} />
                </div>

                {/* Basic Info */}
                <div className="flex gap-4 justify-around mb-4">
                    <p className="text-gray-700 p-3 bg-slate-100 rounded-xl">{member.username}</p>
                    <p className="text-gray-700 p-3 bg-slate-100 rounded-xl">{member.department}</p>
                </div>

                {/* Additional Info - Tasks */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tasks</h3>
                    <p className="text-gray-700">
                        <strong>Pending:</strong> <Link href="/tasks/pending" className="text-blue-600 underline">View</Link>
                    </p>
                    <p className="text-gray-700">
                        <strong>Completed:</strong> <Link href="/tasks/completed" className="text-blue-600 underline">View</Link>
                    </p>
                </div>

                {/* Additional Info - Chats */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Chats</h3>
                    <p className="text-gray-700">
                        <strong>Team Chat:</strong> <Link href="/chats/team" className="text-blue-600 underline">Open</Link>
                    </p>
                    <p className="text-gray-700">
                        <strong>Personal Chat:</strong> <Link href="/chats/personal" className="text-blue-600 underline">Open</Link> (3 new messages)
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 bg-gray-300 border-gray-300 border-[2px] px-4 py-2  hover:bg-gray-500 hover:text-white transition duration-300 w-full hover:border-gray-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserInfoModal;
