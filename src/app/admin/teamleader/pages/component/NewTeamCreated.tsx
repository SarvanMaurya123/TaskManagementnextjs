'use client'
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface TeamFormProps {
    onTeamCreated: (newTeamId: string) => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated }) => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'projectName') setProjectName(value);
        if (id === 'description') setDescription(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/admin/teamleader/teamnamecreate/', {
                projectname: projectName,
                description,
            });

            console.log("API Response:", response.data);

            const newTeamId = response.data.teamId;
            if (!newTeamId) {
                throw new Error("Team ID is not returned from the server");
            }

            // Show success toast
            toast.success('Team created successfully!');
            setProjectName('');
            setDescription('');
            onTeamCreated(newTeamId);

        } catch (err: any) {
            // Show error toast
            toast.error(err.response?.data?.message || 'Error creating team');
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md text-black">
                {isFormOpen && (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Create a Team</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={projectName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-gray-400 text-white font-semibold py-2 px-4 hover:bg-gray-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Team'}
                            </button>
                        </form>
                    </>
                )}
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="w-full border-[1px] text-black font-semibold py-2 px-4 hover:bg-gray-600 mb-4 mt-2 hover:text-white"
                >
                    {isFormOpen ? 'Cancel' : 'Create Team'}
                </button>
            </div>
        </>
    );
};

export default TeamForm;
