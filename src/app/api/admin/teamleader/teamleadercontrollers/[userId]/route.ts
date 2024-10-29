// src/app/api/admin/teamleader/teamleadercontrollers/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig'; // Adjust the import path based on your setup
import Team from '@/app/models/Team'; // Adjust the import path based on your setup
import Users from '@/app/models/userModule'; // Adjust the import path based on your setup
import { verifyJwt } from '@/app/helpers/verifyJwt';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    await connect(); // Ensure the database connection is established
    const { userId } = params;

    try {
        // Retrieve token from cookies
        const token = req.cookies.get('token')?.value; // Use .value to get the cookie value
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const decoded = verifyJwt(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Forbidden: Invalid token' }, { status: 403 });
        }

        // Allow only Team Leaders to create teams
        if (decoded.role !== 'TeamLeader') {
            return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can create teams' }, { status: 403 });
        }

        const body = await req.json(); // Get request body
        const { teamId, username, email, department } = body; // Extract data from the request body

        // Validate input data
        if (!teamId || !username || !email || !department) {
            return NextResponse.json({
                message: 'All fields are required',
                requiredFields: ['teamId', 'username', 'email', 'department']
            }, { status: 400 });
        }

        // Find the team using the teamId
        const team = await Team.findById(teamId);
        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        // Check if user is already in the team
        const userInTeam = team.members.find((member: any) => member.userId.toString() === userId);
        if (userInTeam) {
            return NextResponse.json({ message: 'User already in the team' }, { status: 400 });
        }

        // Add user to the team with additional information
        team.members.push({
            userId,
            username,
            email,
            department
        });

        await team.save(); // Save the updated team

        return NextResponse.json({ message: 'User added to team successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error adding user to team:', error);
        return NextResponse.json({ message: 'Error adding user to team', error: error.message }, { status: 500 });
    }
}
