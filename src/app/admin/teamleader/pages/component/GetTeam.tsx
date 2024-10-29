import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteTeam from './DeleteTeam';
import UpdateTeam from './UpdateTeam';

interface Team {
    _id: string;
    projectname: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const GetTeams: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/admin/teamleader/teamnamecreate/');
                setTeams(response.data);
            } catch (err) {
                setError('Failed to fetch teams. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const handleDeleteSuccess = (teamId: string) => {
        setTeams(teams.filter(team => team._id !== teamId));
    };

    const refreshTeams = () => {
        setSelectedTeamId(null);
        axios.get('/api/admin/teamleader/teamnamecreate/').then((response) => {
            setTeams(response.data);
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex items-center">
                    <div className="spinner border-t-2 border-b-2 border-blue-500 rounded-full h-8 w-8 animate-spin"></div>
                    <span className="ml-3 text-lg text-blue-500">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Teams</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {teams.map((team) => (
                    <li key={team._id} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl  mx-auto">
                        <h2 className="text-xl font-semibold text-blue-600">{team.projectname}</h2>
                        <p className="text-gray-700 mb-4 text-sm md:text-base">{team.description}</p>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-500 text-xs md:text-sm">
                                Created at: {new Date(team.createdAt).toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm">
                                Updated at: {new Date(team.updatedAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-10">
                            <DeleteTeam teamId={team._id} onDeleteSuccess={() => handleDeleteSuccess(team._id)} />
                            <button
                                onClick={() => setSelectedTeamId(team._id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                            >
                                Update
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedTeamId && (
                <div className="mt-8">
                    <UpdateTeam teamId={selectedTeamId} onUpdateSuccess={refreshTeams} />
                </div>
            )}
        </div>

    );
};

export default GetTeams;
