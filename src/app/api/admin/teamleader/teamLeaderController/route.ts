// File: pages/api/admin/teamleader/teamLeaderController.ts
import { NextRequest, NextResponse } from 'next/server';
import Team from '@/app/models/Team'; // Team model
import Users from '@/app/models/userModule'; // User model
import { connect } from '@/app/dbConfig/dbConfig';

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { userId, projectName, description } = await req.json();

        // Log the received request body for debugging
        console.log('Received body:', { userId, projectName, description });

        if (!userId || !projectName || !description) {
            return NextResponse.json(
                { message: 'User ID, project name, and description are required.' },
                { status: 400 }
            );
        }

        // Check if the user exists
        const user = await Users.findById(userId);
        if (!user) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
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
                return NextResponse.json(
                    { message: 'User is already a member of this team.' },
                    { status: 400 }
                );
            }
        }

        await team.save();

        return NextResponse.json(
            { message: 'User added to the team successfully.', team },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error adding user to team:', error);
        return NextResponse.json(
            { message: 'Server error.' },
            { status: 500 }
        );
    }
}
