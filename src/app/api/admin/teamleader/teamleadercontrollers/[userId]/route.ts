import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import Teams from '@/app/models/Team';
import Users from '@/app/models/userModule';
import { verifyJwt } from '@/app/helpers/verifyJwt';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    await connect();
    const { userId } = params;

    try {
        // Get token from cookies
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }

        // Verify token and check role
        const decoded = verifyJwt(token);
        if (!decoded || decoded.role !== 'TeamLeader') {
            return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can add users to teams' }, { status: 403 });
        }

        // Parse request body for teamId
        const body = await req.json();
        console.log('Request Body:', body); // Log the request body
        const { teamId } = body;

        if (!teamId) {
            return NextResponse.json({ message: 'teamId is required' }, { status: 400 });
        }

        // Check for valid MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return NextResponse.json({ message: 'Invalid team ID format' }, { status: 400 });
        }

        // Check if user exists
        const user = await Users.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Find team by teamId
        console.log(`Attempting to find team with ID: ${teamId}`);
        const team = await Teams.findById(teamId);
        console.log("Team fetched:", team); // Log the fetched team
        if (!team) {
            console.error(`Team not found for ID: ${teamId}`);
            return NextResponse.json({ message: `Team not found for ID: ${teamId}` }, { status: 404 });
        }

        // Check if user is already in the team
        const userInTeam = team.members.some((member: any) => member.userId.toString() === userId);
        console.log("User in Team:", userInTeam);
        if (userInTeam) {
            return NextResponse.json({ message: 'User already in the team' }, { status: 400 });
        }

        // Add user to team
        const newMember = { userId, username: user.username, email: user.email, department: user.department };
        console.log("New Member:", newMember);
        team.members.push(newMember);
        await team.save();

        console.log(`User added to team successfully: ${JSON.stringify(newMember)}`);
        return NextResponse.json({ message: 'User added to team successfully', team }, { status: 200 });
    } catch (error: any) {
        console.error('Error adding user to team:', error);
        return NextResponse.json({ message: 'Error adding user to team', error: error.message }, { status: 500 });
    }
}
