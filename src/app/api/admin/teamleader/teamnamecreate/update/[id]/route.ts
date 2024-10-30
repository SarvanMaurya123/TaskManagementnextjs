// src/app/api/admin/teamleader/[id]/route.ts
import { NextResponse } from 'next/server';
import Teams from '@/app/models/Team'; // Adjust the path to your model
import { connect } from '@/app/dbConfig/dbConfig';

const connectDB = async () => {
    await connect();
};

// Handle GET request
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    await connectDB();

    try {
        const team = await Teams.findById(id);
        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }
        return NextResponse.json(team, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching team data', error }, { status: 500 });
    }
}

// Handle PUT request
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { projectname, description } = await request.json();

    await connectDB();

    try {
        const updatedTeam = await Teams.findByIdAndUpdate(
            id,
            { projectname, description },
            { new: true, runValidators: true }
        );

        if (!updatedTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team updated successfully', team: updatedTeam }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating team', error }, { status: 500 });
    }
}
