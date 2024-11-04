'use client'
import React from 'react';
import axios from 'axios';

interface DeleteTeamProps {
    teamId: string;
    onDeleteSuccess: () => void; // Callback function to handle successful deletion
}

const DeleteTeam: React.FC<DeleteTeamProps> = ({ teamId, onDeleteSuccess }) => {
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this team?');
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`/api/admin/teamleader/teamnamecreate/${teamId}`);
            console.log('Delete response:', response.data); // Log response
            if (response.status === 200) {
                onDeleteSuccess(); // Call the success callback
            }
        } catch (err) {
            console.error('Error deleting team:', err);
            alert('Failed to delete team. Please try again.'); // Show error message to user
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="mt-4 text-sm bg-red-500 text-white px-4 py-3  hover:bg-red-600"
        >
            delete All Account
        </button>
    );
};

export default DeleteTeam;
