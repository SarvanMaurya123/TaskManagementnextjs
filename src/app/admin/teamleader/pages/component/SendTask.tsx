'use client';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface SimpleTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        title: string,
        description: string,
        priority: string,
        deadline: string,
        status: string,
        attachments: File[],
        assignedUser: string,
        assignedUserName: string // Added assignedUserName here
    ) => void;
    assignedUser: string;
    assignedUserName: string; // Name of the assigned user
}

const SimpleTaskModal: React.FC<SimpleTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    assignedUser,
    assignedUserName // Added this parameter
}) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [priority, setPriority] = useState<string>('Medium');
    const [deadline, setDeadline] = useState<string>('');
    const [status, setStatus] = useState<string>('Pending');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the deadline input
        if (new Date(deadline) < new Date()) {
            toast.error('Deadline cannot be in the past.');
            return;
        }

        // Prepare form data for submission
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('assignedTo', assignedUser);
        formData.append('priority', priority);
        formData.append('deadline', deadline);
        formData.append('status', status);
        attachments.forEach((file) => formData.append('attachments', file));

        setIsSubmitting(true);

        try {
            // Send POST request to the API
            const response = await axios.post('/api/task/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Notify user of success
            toast.success(response.data.message || 'Task created successfully!');

            // Call onSubmit with all necessary parameters
            onSubmit(title, description, priority, deadline, status, attachments, assignedUser, assignedUserName);

            // Reset form fields
            resetFormFields();
            onClose();
        } catch (err: any) {
            console.error("Task Creation Error:", err);

            // Handle various error responses
            const errorMessage = err.response?.data?.message || 'Failed to create the task. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetFormFields = () => {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setDeadline('');
        setStatus('Pending');
        setAttachments([]);
        (document.getElementById('attachments') as HTMLInputElement).value = '';
    };

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 
            bg-opacity-50 z-50 text-black">
                <form onSubmit={handleSubmit} className="bg-white pt-2 p-8 rounded-lg shadow-lg w-full max-w-[500px]">
                    <h2 className="text-xl text-center font-bold mb-6 text-gray-800"> {assignedUserName}</h2>

                    <div className="mb-6">
                        <label className="block mb-1 text-gray-700" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block mb-1 text-gray-700" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
                        <div className="mb-4 md:mb-0 w-full">
                            <label className="block mb-1 text-gray-700" htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="mb-4 md:mb-0 w-full">
                            <label className="block mb-1 text-gray-700" htmlFor="deadline">Deadline</label>
                            <input
                                type="date"
                                id="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>

                        <div className="mb-4 md:mb-0 w-full">
                            <label className="block mb-1 text-gray-700" htmlFor="status">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-1 text-gray-700" htmlFor="attachments">Attachments</label>
                        <input
                            type="file"
                            id="attachments"
                            onChange={handleAttachmentChange}
                            multiple
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                                        ></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Create Task'
                            )}
                        </button>


                    </div>
                </form>
            </div>
        </>
    );
};

export default SimpleTaskModal;
