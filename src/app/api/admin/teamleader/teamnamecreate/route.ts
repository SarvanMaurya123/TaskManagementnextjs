// src/app/api/admin/teamleader/teamnamecreate/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { verifyJwt } from '@/app/helpers/verifyJwt';
import { connect } from '@/app/dbConfig/dbConfig';
import Team from '@/app/models/Team';

// POST request handler for creating teams
export async function POST(req: NextRequest) {
    await connect();

    // Retrieve token from cookies and get its value
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

    const { projectname, description } = await req.json();

    console.log('Incoming data:', { projectname, description }); // Log incoming data

    try {
        // Check if the TeamLeader already has a team
        const existingTeam = await Team.findOne({ teamLeaderId: decoded.id });
        if (existingTeam) {
            return NextResponse.json({ message: 'Team already exists for this Team Leader' }, { status: 400 });
        }

        // Create a new team instance
        const newTeam = new Team({
            projectname,
            description,
            teamLeaderId: decoded.id,
        });

        // Save the new team instance
        await newTeam.save();

        console.log('New Team created:', newTeam); // Log the newly created team

        return NextResponse.json(newTeam, { status: 201 });
    } catch (error: any) {
        console.error('Error creating team:', error); // Log the error
        return NextResponse.json({ message: 'Error creating team', error: error.message }, { status: 500 });
    }
}

// GET request handler for retrieving teams created by the authenticated team leader
export async function GET(req: NextRequest) {
    await connect(); // Ensure the database connection is established

    // Retrieve token from cookies
    const token = req.cookies.get('token')?.value; // Use .value to get the cookie value
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
        return NextResponse.json({ message: 'Forbidden: Invalid token' }, { status: 403 });
    }

    // Allow only Team Leaders to retrieve their teams
    if (decoded.role !== 'TeamLeader') {
        return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can access their teams' }, { status: 403 });
    }

    try {
        // Retrieve teams created by the authenticated team leader
        const teams = await Team.find({ teamLeaderId: decoded.id });
        return NextResponse.json(teams, { status: 200 });
    } catch (error: any) {
        console.error('Error retrieving teams:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve teams.' },
            { status: 500 }
        );
    }
}
