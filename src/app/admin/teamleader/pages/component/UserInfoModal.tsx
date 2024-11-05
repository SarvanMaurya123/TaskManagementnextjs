// UserInfoModal.tsx
'use client';
import React, { useState } from 'react';
import { FaComments, FaUserCircle } from 'react-icons/fa';
import SendChat from '@/app/admin/teamleader/pages/component/TeamChat';
import SinglePersonChat from '@/app/admin/teamleader/pages/component/SinglePersonChat';
import SimpleTaskModal from '@/app/admin/teamleader/pages/component/SendTask';
import PendingTask from '@/app/admin/teamleader/pages/component/PandingTask';

interface Member {
    userId: string;
    username: string;
    email: string;
    department: string;
}

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, member }) => {
    const [isChatModalOpen, setChatModalOpen] = useState(false);
    const [isSingleChatModalOpen, setSingleChatModalOpen] = useState(false);
    const [isSendTask, setSendTask] = useState(false);
    const [isPanding, setPandingTask] = useState(false);

    const handleTaskSubmit = (title: string, description: string) => {
        console.log('Task Created:', { title, description });
        setSendTask(false);
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-lg md:max-w-2xl max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <FaUserCircle className="text-blue-600" size={100} />
                </div>

                <div className="flex gap-4 justify-around mb-4">
                    <p className="text-gray-700 p-3 bg-slate-100 rounded-xl">{member.username}</p>
                    <p className="text-gray-700 p-3 bg-slate-100 rounded-xl">{member.department}</p>
                </div>

                <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">Tasks Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            className="flex justify-center items-center bg-white p-4 rounded-lg shadow transform hover:scale-100 hover:shadow-lg"
                            onClick={() => setSendTask(true)}
                        >
                            Send Task
                        </button>

                        <button
                            className="flex justify-center items-center bg-white p-4 rounded-lg shadow transform hover:scale-100 hover:shadow-lg"
                            onClick={() => setPandingTask(true)}
                        >
                            View Tasks
                        </button>
                    </div>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md ">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Chats</h3>
                    <div className="flex justify-around">
                        <button
                            className="text-gray-700 flex items-center p-3 bg-white rounded-lg shadow transform hover:scale-105"
                            onClick={() => setChatModalOpen(true)}
                        >
                            <FaComments className="text-blue-600 text-2xl mr-2" /> Team Chat
                        </button>
                        <button
                            className="text-gray-700 flex items-center p-3 bg-white rounded-lg shadow transform hover:scale-105"
                            onClick={() => setSingleChatModalOpen(true)}
                        >
                            <FaUserCircle className="text-blue-600 text-2xl mr-2" /> Personal Chat
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 bg-gray-300 border-gray-300 border-[2px] px-4 py-2 hover:bg-gray-500 hover:text-white transition duration-300 w-full"
                >
                    Close
                </button>
            </div>

            {isChatModalOpen && <SendChat onClose={() => setChatModalOpen(false)} />}
            {isSingleChatModalOpen && <SinglePersonChat onClose={() => setSingleChatModalOpen(false)} />}
            {isSendTask && member && (
                <SimpleTaskModal
                    isOpen={isSendTask}
                    onClose={() => setSendTask(false)}
                    onSubmit={handleTaskSubmit}
                    assignedUser={member.userId}
                    assignedUserName={member.username}
                />
            )}

            <PendingTask
                isOpen={isPanding}
                onClose={() => setPandingTask(false)}
                userId={member.userId} // Pass the userId to PendingTask
            />
        </div>
    );
};

export default UserInfoModal;
