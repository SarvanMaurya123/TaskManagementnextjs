import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

interface TeamFormProps {
    onTeamCreated: (newTeamId: string) => void; // Define the type of the prop
}

const TeamForm: React.FC<TeamFormProps> = ({ onTeamCreated }) => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/admin/teamleader/teamnamecreate/', {
                projectname: projectName,
                description,
            });

            console.log("API Response:", response.data); // Log the entire response

            // Ensure the response contains the expected teamId
            const newTeamId = response.data.teamId;
            if (!newTeamId) {
                throw new Error("Team ID is not returned from the server");
            }

            setSuccess('Team created successfully!');
            setProjectName('');
            setDescription('');
            onTeamCreated(newTeamId); // Call the onTeamCreated prop with the new team ID

        } catch (err: any) {
            setError(err.response?.data?.message || 'Error creating team');
            console.error("Error:", err); // Log the error for further debugging
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
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
                                className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Team'}
                            </button>
                        </form>
                        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </>
                )}
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
                >
                    {isFormOpen ? 'Cancel' : 'Create Team'}
                </button>
            </div>
        </>
    );
};

export default TeamForm;
