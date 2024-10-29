import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UpdateTeamProps {
    teamId: string;
    onUpdateSuccess: () => void; // Callback to refresh the list after update
}

const UpdateTeam: React.FC<UpdateTeamProps> = ({ teamId, onUpdateSuccess }) => {
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
        <div className="p-4 border rounded-lg shadow-md bg-white max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Update Team</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label className="block text-gray-700">Project Name</label>
                    <input
                        type="text"
                        value={projectname}
                        onChange={(e) => setProjectname(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Team'}
                </button>
            </form>
        </div>
    );
};

export default UpdateTeam;
