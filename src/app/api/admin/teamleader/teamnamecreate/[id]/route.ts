// src/app/api/admin/teamleader/teamnamecreate/[id]/route.ts
import Teams from '@/app/models/Team'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const deletedTeam = await Teams.findByIdAndDelete(id);
        if (!deletedTeam) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Team deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ error: 'Failed to delete team.' }, { status: 500 });
    }
}

