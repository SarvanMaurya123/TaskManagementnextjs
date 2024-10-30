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

    // Retrieve the token from cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token and decode it
    const decoded: DecodedToken | null = verifyJwt(token);
    if (!decoded) {
        return NextResponse.json({ message: 'Forbidden: Invalid token' }, { status: 403 });
    }

    // Check if the user has the correct role
    if (decoded.role !== 'TeamLeader') {
        return NextResponse.json({ message: 'Access forbidden: Only Team Leaders can create teams' }, { status: 403 });
    }

    // Parse request body
    const { projectname, description } = await req.json();
    if (!projectname || !description) {
        return NextResponse.json({ message: 'Invalid input: Project name and description are required' }, { status: 400 });
    }

    console.log('Incoming data:', { projectname, description });

    try {
        // Check if a team already exists for this Team Leader
        const existingTeam = await Teams.findOne({ teamLeaderId: decoded.id });
        if (existingTeam) {
            return NextResponse.json({ message: 'Team already exists for this Team Leader' }, { status: 400 });
        }

        // Create a new team instance
        const newTeam = new Teams({
            projectname,
            description,
            teamLeaderId: decoded.id,
            members: [],
        });

        // Save the new team to the database
        await newTeam.save();

        // Set teamId in cookies
        let response = NextResponse.json({
            teamId: newTeam._id,
            message: 'Team created successfully'
        }, { status: 201 });

        // // Set the cookie (if you need to do this here)
        // response.cookies.set('teamId', newTeam._id.toString(), {
        //     httpOnly: true,
        //     path: '/', // Make cookie accessible in all routes
        //     maxAge: 60 * 60 * 24 * 7, // 1 week
        // });

        return response; // Return the response with the new team data
    } catch (error: any) {
        console.error('Error creating team:', error);
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
