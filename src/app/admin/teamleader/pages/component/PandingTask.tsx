'use client';
import React, { useState, useEffect } from 'react';
import { FaTasks, FaClock, FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface Task {
    id: string; // Ensure this matches your backend structure
    title: string;
    deadline: string;
    status: string;
}

interface PendingTaskProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string; // Add userId prop
}

const PendingTask: React.FC<PendingTaskProps> = ({ isOpen, onClose, userId }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // State to manage errors

    // Fetch pending tasks from the API for the specific user
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null); // Reset error state
            try {
                const response = await axios.get(`/api/task/pandingtask?userId=${userId}`);
                if (response.status === 200) {
                    console.log("Fetched tasks:", response.data);
                    setTasks(response.data);
                } else {
                    console.error("Error fetching tasks:", response.status, response.data);
                    setError("Failed to fetch tasks. Please try again later.");
                }
            } catch (error) {
                console.error("Error fetching pending tasks:", error);
                setError("An error occurred while fetching tasks.");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchTasks();
    }, [isOpen, userId]);

    // Render loading state
    if (loading) return <div className="text-center"></div>;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl p-6 md:p-8 relative mx-4">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-semibold text-center mb-6">All Tasks</h2>

                {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error if exists */}

                <div className="max-h-96 overflow-y-auto space-y-6"> {/* Enable scrolling */}
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="border rounded-lg p-4 md:p-6 shadow bg-gray-50 flex items-center space-x-4"
                            >
                                <FaTasks className="text-blue-500" size={28} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg md:text-xl">{task.title}</h3>
                                    <p className="text-gray-500 flex items-center">
                                        <FaClock className="mr-2" /> Deadline: {new Date(task.deadline).toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-yellow-500 font-semibold">{task.status}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No pending tasks available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingTask;



