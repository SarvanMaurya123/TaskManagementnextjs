import { NextResponse, NextRequest } from 'next/server';
import { verifyJwt } from '@/app/helpers/verifyJwt';
import { connect } from '@/app/dbConfig/dbConfig';
import Teams from '@/app/models/Team';

interface DecodedToken {
    id: string;
    role: string;
}

export async function POST(req: NextRequest) {
    await connect();

    // Retrieve and validate token
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Decode and verify the token
    const decoded: DecodedToken | null = verifyJwt(token);
    if (!decoded) {
        return NextResponse.json({ message: 'Forbidden: Invalid token' }, { status: 403 });
    }

    // Role check for TeamLeader
    if (decoded.role !== 'TeamLeader') {
        return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can create teams' }, { status: 403 });
    }

    // Parse request body
    const { projectname, description } = await req.json();
    if (!projectname || !description) {
        return NextResponse.json({ message: 'Invalid input: Project name and description are required' }, { status: 400 });
    }

    try {
        // Check if team already exists for this Team Leader
        const existingTeam = await Teams.findOne({ teamLeaderId: decoded.id });
        if (existingTeam) {
            return NextResponse.json({ message: 'Team already exists for this Team Leader' }, { status: 400 });
        }

        // Create a new team
        const newTeam = new Teams({
            projectname,
            description,
            teamLeaderId: decoded.id,
            members: [],
        });

        // Save new team to DB
        await newTeam.save();

        // Prepare response
        const response = NextResponse.json({
            teamId: newTeam._id,
            message: 'Team created successfully'
        }, { status: 201 });

        // Optional: Uncomment if cookie is required
        // response.cookies.set('teamId', newTeam._id.toString(), {
        //     httpOnly: true,
        //     path: '/',
        //     maxAge: 60 * 60 * 24 * 7, // 1 week
        // });

        return response;
    } catch (error: any) {
        console.error('Error creating team:', error);
        return NextResponse.json({ message: 'Error creating team', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connect();

    // Retrieve and validate token
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Decode and verify the token
    const decoded: DecodedToken | null = verifyJwt(token);
    if (!decoded) {
        return NextResponse.json({ message: 'Forbidden: Invalid token' }, { status: 403 });
    }

    // Role check for TeamLeader
    if (decoded.role !== 'TeamLeader') {
        return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can access their teams' }, { status: 403 });
    }

    try {
        // Retrieve teams for the authenticated team leader
        const teams = await Teams.find({ teamLeaderId: decoded.id });
        return NextResponse.json(teams, { status: 200 });
    } catch (error: any) {
        console.error('Error retrieving teams:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve teams.' },
            { status: 500 }
        );
    }
}
