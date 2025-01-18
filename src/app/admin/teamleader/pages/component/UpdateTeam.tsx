'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UpdateTeamProps {
    teamId: string;
    onUpdateSuccess: () => void; // Callback to refresh the list after update
    onCancel: () => void; // Callback for cancel action
}

const UpdateTeam: React.FC<UpdateTeamProps> = ({ teamId, onUpdateSuccess, onCancel }) => {
    const [projectname, setProjectname] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch existing team data
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get(`/api/admin/teamleader/teamnamecreate/update/${teamId}`);
                setProjectname(response.data.projectname);
                setDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };

        fetchTeam();
    }, [teamId]);

    // Update team data
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`/api/admin/teamleader/teamnamecreate/update/${teamId}`, {
                projectname,
                description,
            });
            onUpdateSuccess(); // Callback to refresh the list or notify success
            alert('Team updated successfully!');
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Failed to update team. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md w-full mx-auto text-black">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Update Team</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Project Name</label>
                        <input
                            type="text"
                            value={projectname}
                            onChange={(e) => setProjectname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        <button
                            type="button"
                            onClick={onCancel} // Call the cancel function
                            className="w-1/2 py-2   border-[2px] text-gray-800 font-semibold hover:bg-gray-400 hover:text-white hover:border-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`w-1/2 py-2 bg-gray-300 border-gray-300 border-[2px] ${loading ? 'bg-gray-300' : 'hover:bg-gray-500 hover:text-white hover:border-gray-500'} transition`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateTeam;
