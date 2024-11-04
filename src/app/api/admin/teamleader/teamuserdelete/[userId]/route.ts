import { connect } from '@/app/dbConfig/dbConfig';
import Teams from '@/app/models/Team';
import { NextResponse } from 'next/server';

// DELETE API route to remove a member from a team
export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
    // Parse the request body to get teamId
    let teamId: string | undefined;
    try {
        const body = await request.json();
        teamId = body.teamId; // Extract teamId from the request body
    } catch (error) {
        return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate that teamId is provided
    if (!teamId) {
        return NextResponse.json({ message: 'Team ID is required' }, { status: 400 });
    }

    try {
        // Connect to the database
        await connect();

        // Find the team and remove the member by userId
        const updatedTeam = await Teams.findByIdAndUpdate(
            teamId,
            { $pull: { members: { userId: params.userId } } }, // Remove member by userId
            { new: true } // Return the updated team
        );

        // Check if the team was found
        if (!updatedTeam) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Member deleted successfully', team: updatedTeam }, { status: 200 });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
