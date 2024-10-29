// File: pages/api/admin/teamleader/teamLeaderController.ts
import { NextApiRequest, NextApiResponse } from 'next';

import Team from '@/app/models/Team'; // Team model
import Users from '@/app/models/userModule'; // User model
import { connect } from '@/app/dbConfig/dbConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect()
    if (req.method === 'POST') {
        const { userId, projectName, description } = req.body;

        if (!userId || !projectName || !description) {
            return res.status(400).json({ message: 'User ID, project name, and description are required.' });
        }

        try {
            // Check if the user exists
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Check if a team already exists for the user, or create a new team
            let team = await Team.findOne({ projectname: projectName });

            if (!team) {
                team = new Team({
                    projectname: projectName,
                    description: description,
                    members: [userId], // Assuming you want to add the user to a new team
                });
            } else {
                // Add user to existing team
                if (!team.members.includes(userId)) {
                    team.members.push(userId);
                } else {
                    return res.status(400).json({ message: 'User is already a member of this team.' });
                }
            }

            await team.save();

            res.status(200).json({ message: 'User added to the team successfully.', team });
        } catch (error) {
            console.error('Error adding user to team:', error);
            res.status(500).json({ message: 'Server error.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
