import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddMemberProps {
    teamId: string; // The ID of the team to which the member will be added
}

interface User {
    _id: string; // User ID
    username: string; // Username
    email: string; // Email
}

const AddMember: React.FC<AddMemberProps> = ({ teamId }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]); // State to hold users
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/teamleader/users'); // Adjust the endpoint as necessary
                setUsers(response.data.data); // Assume response contains an array of users
            } catch (err) {
                setError('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('/api/admin/teamleader/teamleadercontrollers/', {
                teamId,
                userId,
            });

            if (response.data.success) {
                setSuccess('Member added successfully!');
                setUserId(null); // Clear the input field
            } else {
                throw new Error(response.data.message || 'Failed to add member');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Add Member to Team</h2>
            <form onSubmit={handleAddMember}>
                <div>
                    <label htmlFor="userId">Select User</label>
                    <select
                        id="userId"
                        value={userId || ''}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a user</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.username} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading || !userId}>
                    {loading ? 'Adding...' : 'Add Member'}
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
};

export default AddMember;
