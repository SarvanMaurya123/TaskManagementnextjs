// File: utils/teamHelper.ts

import Teams from '@/app/models/Team'; // Adjust the path as needed
import { verifyJwt } from '@/app/helpers/verifyJwt';
import { NextRequest } from 'next/server';

// Function to get the current team ID for the logged-in user
export async function getCurrentTeamId(req: NextRequest): Promise<string | null> {
    const token = req.cookies.get('token')?.value;

    // Check if the token exists
    if (!token) return null;

    // Verify the JWT token
    const decoded = verifyJwt(token);
    if (!decoded || decoded.role !== 'TeamLeader') {
        return null;
    }

    try {
        const userTeam = await Teams.findOne({ teamLeaderId: decoded.id }).populate('members.userId');
        return userTeam ? userTeam._id.toString() : null; // Return the team ID if found
    } catch (error) {
        console.error('Error retrieving team:', error);
        return null; // Return null in case of an error
    }
}
