'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/store';
import toast, { Toaster } from 'react-hot-toast';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: Date;
    attachments: string[];
}

const UserTasks = () => {
    const { user, loading: authLoading } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            try {
                const response = await fetch(`/api/users/alltask/${user._id}`);
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const data = await response.json();

                if (data.message) {
                    setMessage(data.message);
                    setTasks([]);
                } else {
                    setTasks(data.tasks);
                }
            } catch (error: any) {
                console.log("error", error.message)
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/users/alltask/updateStatus/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update task status');
            }

            setTasks((prevTasks) =>
                prevTasks.map((task) => task._id === taskId ? { ...task, status: newStatus } : task)
            );
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            console.error("Error updating task status:", error);
        }
    };

    const deleteTask = async (taskId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this task?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`/api/users/alltask/delete/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete task');
            }

            // Update the task list by filtering out the deleted task
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            toast.success("Deleted Task Successfully");
        } catch (error: any) {
            toast.error(error.message);
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    if (authLoading || loading) return (
        <div className="flex items-center justify-center mt-10">
            <div className="spinner" aria-label="Loading tasks..."></div>
            <span className="ml-2 text-gray-600"></span>
        </div>
    );
    if (error) return <div>Error fetching tasks: {error}</div>;

    const filteredTasks = selectedStatus === 'All' ? tasks : tasks.filter(task => task.status === selectedStatus);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Your Tasks</h1>

                <div className="mb-4 text-center">
                    <div className="flex flex-wrap justify-center">
                        {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
                            <button
                                key={status}
                                className={`mx-2 mb-2 p-3 px-7 text-black rounded transition duration-300 ease-in-out transform ${selectedStatus === status
                                    ? 'bg-gray-500 text-black'
                                    : 'bg-gray-200'
                                    } sm:w-auto w-full md:w-40 hover:bg-gray-400`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {message ? (
                    <p className="text-center text-lg text-gray-500">{message}</p>
                ) : filteredTasks.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No tasks found for the selected status.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map(task => (
                            <div key={task._id} className="border border-gray-300 rounded-lg p-4 shadow-lg bg-white transition-transform duration-300">
                                <h2 className="text-xl font-semibold text-black">{task.title}</h2>
                                <p className="text-gray-700">{task.description}</p>
                                {task.attachments && task.attachments.length > 0 && (
                                    <div className="mt-2">
                                        <h3 className="text-sm font-semibold">Attachments:</h3>
                                        <ul className="list-disc list-inside mt-1">
                                            {task.attachments.map((attachment, index) => (
                                                <li key={index} className="text-blue-600 hover:underline">
                                                    <a href={attachment} target="_blank" rel="noopener noreferrer">{attachment}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between items-center pt-4">
                                    <span className={`text-md font-medium p-2 rounded-2xl ${task.status === 'Completed'
                                        ? 'bg-green-200 text-green-600'
                                        : task.status === 'In Progress'
                                            ? 'bg-blue-200 text-blue-600'
                                            : 'bg-red-200 text-red-600'
                                        }`}>
                                        {task.status}
                                    </span>
                                    <span className={`text-md font-medium p-2 rounded-2xl ${task.priority === 'High'
                                        ? 'bg-red-200 text-red-600'
                                        : task.priority === 'Medium'
                                            ? 'bg-yellow-200 text-yellow-600'
                                            : 'bg-green-200 text-green-600'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="flex mt-5 justify-between items-center">
                                    {task.status !== 'Completed' && (
                                        <div className="">
                                            <button
                                                onClick={() => updateTaskStatus(task._id, 'In Progress')}
                                                className="bg-yellow-500 text-white p-2 md:mx-5 rounded mb-3"
                                            >
                                                Mark as In Progress
                                            </button>
                                            <button
                                                onClick={() => updateTaskStatus(task._id, 'Completed')}
                                                className="bg-green-500 text-white p-2 rounded"
                                            >
                                                Mark as Completed
                                            </button>
                                        </div>
                                    )}
                                    {task.status === 'Completed' && (
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="ml-4 bg-red-500 text-white p-2 rounded"
                                        >
                                            Delete Task
                                        </button>
                                    )}
                                </div>
                                <div className="text-center mt-4">
                                    <p className="text-gray-500 text-lg">Deadline:</p>
                                    <p className="mt-1 text-gray-700 font-semibold text-xl text-red-600">
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default UserTasks;
