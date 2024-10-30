import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaUserCircle, FaEllipsisV } from 'react-icons/fa'; // Importing icons
import DeleteTeam from './DeleteTeam';
import UpdateTeam from './UpdateTeam';
import UserInfoModal from './UserInfoModal';
import { useRouter } from 'next/navigation';

interface Member {
    userId: string;
    username: string;
    email: string;
    department: string;
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

    // State for holding the updated values
    const [updatedProjectName, setUpdatedProjectName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('/api/admin/teamleader/teamnamecreate/');
                setTeams(response.data);

                if (response.data.length > 0) {
                    Cookies.set('teamId', response.data[0]._id);
                    router.push("/admin/teamleader/pages/dashboard"); // Redirect after setting team ID
                }
            } catch (err) {
                console.error('Failed to fetch teams', err);
                setError('Failed to fetch teams. Please try again later.'); // Set error message
            }
        };
        fetchTeams();
    }, [router]);

    const handleMemberClick = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const toggleDropdown = (teamId: string) => {
        setDropdownOpen((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
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
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                {teams.length > 0 ? "Teams" : "Please Create Team Members"}
            </h1>

            {error && <p className="text-red-500 text-center">{error}</p>} {/* Error message display */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                {teams.map((team) => (
                    <li key={team._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl w-full relative">
                        <h2 className="text-xl font-semibold text-white rounded-xl bg-slate-800 mt-0 text-center p-4 relative">
                            {team.projectname}
                            {/* Three-dot Icon and Dropdown Menu */}
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <button onClick={() => toggleDropdown(team._id)} className="focus:outline-none">
                                    <FaEllipsisV className="text-white" size={24} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen[team._id] && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                        <ul className="py-2">
                                            <li className="">
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

                        <div className="mt-4">
                            <ul className="mt-2 space-y-2">
                                {team.members.map((member) => (
                                    <li
                                        key={member.userId}
                                        className="flex items-center bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleMemberClick(member)}
                                    >
                                        <FaUserCircle className="text-gray-500 mr-3" size={50} />
                                        <div>
                                            <p className="font-medium text-gray-900">{member.username}</p>
                                            <p className="text-gray-700 text-sm">{member.email}</p>
                                            <p className="text-gray-700 text-sm">{member.department}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>

            {/* User Info Modal */}
            {selectedMember && (
                <UserInfoModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    member={selectedMember}
                />
            )}

            {/* Update Team Modal */}
            {isUpdateModalOpen && selectedTeamId && (
                <UpdateTeam
                    teamId={selectedTeamId}
                    onUpdateSuccess={() => {
                        // Refresh teams after update
                        setTeams((prev) =>
                            prev.map((team) =>
                                team._id === selectedTeamId
                                    ? { ...team, projectname: updatedProjectName, description: updatedDescription }
                                    : team
                            )
                        );
                        closeUpdateModal(); // Close the update modal
                    }}
                    onCancel={closeUpdateModal}
                />
            )}
        </div>
    );
};

export default GetTeams;
