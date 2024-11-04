'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaEllipsisV, FaTrash } from 'react-icons/fa';
import DeleteTeam from './DeleteTeam';
import UpdateTeam from './UpdateTeam';
import UserInfoModal from './UserInfoModal';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
//import ActiveUser from '@/app/activeuser/page';


interface Member {
    userId: string;
    username: string;
    email: string;
    department: string;
    // isActive: boolean;
}

interface Team {
    _id: string;
    projectname: string;
    description: string;
    members: Member[];
}

const GetTeams: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [updatedProjectName, setUpdatedProjectName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/admin/teamleader/teamnamecreate/');
                const teamsData = response.data;

                // No need for active status fetching anymore
                setTeams(teamsData);

                if (teamsData.length > 0) {
                    sessionStorage.setItem('teamId', teamsData[0]._id);
                    router.push("/admin/teamleader/pages/dashboard");
                }
            } catch (err) {
                console.error('Failed to fetch teams', err);
                setError('Failed to fetch teams. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, [router]);

    const handleDeleteMember = async (userId: string, teamId: string) => {
        try {
            await axios.delete(`/api/admin/teamleader/teamuserdelete/${userId}`, {
                data: { teamId }
            });
            toast.success("Deleted Successfully!");
            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team._id === teamId ? { ...team, members: team.members.filter(member => member.userId !== userId) } : team
                )
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error deleting member';
            toast.error(errorMessage);
            console.error('Error deleting member:', error);
        }
    };

    const handleMemberClick = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const toggleDropdown = (teamId: string) => {
        setDropdownOpen(prev => ({ ...prev, [teamId]: !prev[teamId] }));
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const openUpdateModal = (team: Team) => {
        setSelectedTeamId(team._id);
        setUpdatedProjectName(team.projectname);
        setUpdatedDescription(team.description);
        setIsUpdateModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-6 h-full">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                {teams.length > 0 ? "Teams" : "Please Create Team Members"}
            </h1>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {isLoading && (
                <div className="flex items-center justify-center">
                    <div className="spinner" aria-label="Loading users..."></div>
                    <span className="ml-2 text-gray-600"></span>
                </div>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {teams.map((team) => (
                    <li key={team._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl w-full relative">
                        <h2 className="text-xl font-semibold text-white rounded-xl bg-slate-800 mt-0 text-center p-4 relative">
                            {team.projectname}
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <button onClick={() => toggleDropdown(team._id)} className="focus:outline-none">
                                    <FaEllipsisV className="text-white" size={24} />
                                </button>
                                {dropdownOpen[team._id] && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                        <ul className="py-2">
                                            <li>
                                                <DeleteTeam
                                                    teamId={team._id}
                                                    onDeleteSuccess={() => setTeams(teams.filter(t => t._id !== team._id))}
                                                />
                                            </li>
                                            <li className="m-5 text-sm bg-gray-500 text-white py-3 hover:bg-gray-600" onClick={() => openUpdateModal(team)}>
                                                Update Team Name
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </h2>

                        <p className="text-gray-700 mb-4 text-sm md:text-base mt-4 text-center bg-gray-100 rounded-xl p-4">{team.description}</p>

                        <div className="mt-4 overflow-y-auto h-96">
                            <ul className="mt-2 space-y-2">
                                {team.members.map((member) => (
                                    <li
                                        key={member.userId}
                                        className="flex items-center bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleMemberClick(member)}
                                    >
                                        <div className="relative flex items-center">
                                            <FaUserCircle className="mr-3 text-gray-500" size={50} />
                                            {/* <p>{member.isActive ? "isActive" : "InActive"}</p> */}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">{member.username}</p>
                                            <p className="text-gray-700 text-sm">{member.email}</p>
                                            <p className="text-gray-700 text-sm">{member.department}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMember(member.userId, team._id);
                                            }}
                                            className="text-red-600 hover:text-red-800 ml-4"
                                            title="Remove Member"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </li>
                ))}
            </ul>

            {selectedMember && (
                <UserInfoModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    member={selectedMember}
                />
            )}

            {isUpdateModalOpen && selectedTeamId && (
                <UpdateTeam
                    teamId={selectedTeamId}
                    onUpdateSuccess={() => {
                        setTeams(prev =>
                            prev.map(team =>
                                team._id === selectedTeamId
                                    ? { ...team, projectname: updatedProjectName, description: updatedDescription }
                                    : team
                            )
                        );
                        closeUpdateModal();
                    }}
                    onCancel={closeUpdateModal}
                />
            )}
        </div>
    );
};

export default GetTeams;
