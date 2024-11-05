// // Import necessary modules and types
// import { NextRequest, NextResponse } from 'next/server';
// import { connect } from '@/app/dbConfig/dbConfig';
// import Teams from '@/app/models/Team';
// import Users from '@/app/models/userModule'; // Import the User model
// import { verifyJwt } from '@/app/helpers/verifyJwt';
// import { getCurrentTeamId } from '@/app/helpers/teamId'; // Import the getCurrentTeamId function
// import { sendTeamAdditionEmail } from '@/app/helpers/sendmailaddteam';
// import sendEmail from '@/app/helpers/sendemail';

// // Define request body type
// interface AddMemberRequest {
//     userId: string; // Only userId is required from the request body
// }

// interface Member {
//     userId: string;
//     username: string;
//     email: string;
//     department: string;
// }

// // Function to handle errors and return JSON response
// const handleError = (message: string, status: number) => {
//     return NextResponse.json({ success: false, message }, { status });
// };

// // Define the POST function
// export async function POST(request: NextRequest) {
//     try {
//         // Connect to the database
//         await connect();

//         // Get the token from cookies
//         const token = request.cookies.get('token')?.value;


//         // Check if the token exists
//         if (!token) return handleError('No authentication token', 401);

//         // Verify the JWT token
//         const decoded = verifyJwt(token);

//         if (!decoded || decoded.role !== 'TeamLeader') {
//             return handleError('Unauthorized', 403);
//         }

//         // Get the current team ID for the logged-in user
//         const teamId = await getCurrentTeamId(request);

//         if (!teamId) return handleError('No team associated with the user', 404);

//         // Get the request body containing userId
//         const { userId }: AddMemberRequest = await request.json();


//         // Validate the provided user ID
//         if (!userId) return handleError('User ID must be provided', 400);

//         // Fetch user and team information in parallel
//         const [userInfo, team] = await Promise.all([
//             Users.findById(userId),
//             Teams.findById(teamId) // Use the teamId retrieved from getCurrentTeamId
//         ]);


//         // Check if user exists
//         if (!userInfo) return handleError('User not found', 404);

//         // Check if team exists
//         if (!team) return handleError('Team not found', 404);

//         // Check if the user is already a member
//         const isMember = team.members.some((member: Member) => member.userId.toString() === userInfo._id.toString());

//         if (isMember) return handleError('User is already a member of the team', 400);

//         // Update the team by adding the user to the members list
//         const newMember: Member = {
//             userId: userInfo._id,
//             username: userInfo.username,
//             email: userInfo.email,
//             department: userInfo.department,
//         };


//         team.members.push(newMember);


//         await team.save(); // Save the updated team

//         // Send email notification
//         const emailMessage = sendTeamAdditionEmail(userInfo.username, team.name);
//         await sendEmail({
//             email: userInfo.email,
//             subject: `Welcome to ${team.name} Team`,
//             message: emailMessage,
//         });


//         // Return the updated team data
//         return NextResponse.json({ success: true, data: team }, { status: 200 });
//     } catch (error) {
//         console.error('Error in adding team member:', error);
//         return handleError('Server error', 500);
//     }
// }



// Import necessary modules and types
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';
import Teams from '@/app/models/Team';
import Users from '@/app/models/userModule';
import { verifyJwt } from '@/app/helpers/verifyJwt';
import { getCurrentTeamId } from '@/app/helpers/teamId';
import { sendTeamAdditionEmail } from '@/app/helpers/sendmailaddteam';
import sendEmail from '@/app/helpers/sendemail';

// Define request body type
interface AddMemberRequest {
    userId: string;
}

interface Member {
    userId: string;
    username: string;
    email: string;
    department: string;
}

// Function to handle errors and return JSON response
const handleError = (message: string, status: number) => {
    return NextResponse.json({ success: false, message }, { status });
};

// Define the POST function
export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connect();

        // Get the token from cookies
        const token = request.cookies.get('token')?.value;

        // Check if the token exists
        if (!token) return handleError('No authentication token', 401);

        // Verify the JWT token
        const decoded = verifyJwt(token);

        if (!decoded || decoded.role !== 'TeamLeader') {
            return handleError('Unauthorized', 403);
        }

        // Get the current team ID for the logged-in user
        const teamId = await getCurrentTeamId(request);

        if (!teamId) return handleError('No team associated with the user', 404);

        // Get the request body containing userId
        const { userId }: AddMemberRequest = await request.json();

        // Validate the provided user ID
        if (!userId) return handleError('User ID must be provided', 400);

        // Fetch user and team information in parallel
        const [userInfo, team] = await Promise.all([
            Users.findById(userId),
            Teams.findById(teamId)
        ]);

        // Check if user exists
        if (!userInfo) return handleError('User not found', 404);

        // Check if team exists
        if (!team) return handleError('Team not found', 404);

        // Fallback for team name if undefined
        const teamName = team.projectname || "Your Team";

        // Check if the user is already a member
        const isMember = team.members.some((member: Member) => member.userId.toString() === userInfo._id.toString());

        if (isMember) return handleError('User is already a member of the team', 400);

        // Update the team by adding the user to the members list
        const newMember: Member = {
            userId: userInfo._id,
            username: userInfo.username,
            email: userInfo.email,
            department: userInfo.department,
        };

        team.members.push(newMember);

        await team.save(); // Save the updated team

        // Send email notification
        const emailMessage = sendTeamAdditionEmail(userInfo.username, teamName);
        await sendEmail({
            email: userInfo.email,
            subject: `Welcome to ${teamName} Team`,
            message: emailMessage,
        });


        // Return the updated team data
        return NextResponse.json({ success: true, data: team }, { status: 200 });
    } catch (error) {
        console.error('Error in adding team member:', error);
        return handleError('Server error', 500);
    }
}
