import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/app/dbConfig/dbConfig';

import Users from '@/app/models/userModule';
import { verifyJwt } from '@/app/helpers/verifyJwt';
import { sendTaskAssignmentEmail } from '@/app/helpers/taskmessage';
import sendEmail from '@/app/helpers/sendemail';
import Tasks from '@/app/models/Task';


interface DecodedToken {
    id: string;   // User ID from the token
    role: string; // User role (e.g., 'TeamLeader')
}

interface TaskData {
    title: string;
    description: string;
    assignedTo: string;
    priority?: string;
    deadline?: Date;
    status?: string;
}

const validateToken = (req: NextRequest): DecodedToken => {
    const token = req.cookies.get('token')?.value;
    if (!token) {
        throw new Error('Unauthorized: No token provided');
    }

    const decoded: DecodedToken | null = verifyJwt(token);
    if (!decoded || decoded.role !== 'TeamLeader') {
        throw new Error('Forbidden: Only Team Leaders can create tasks');
    }

    return decoded;
};

export async function POST(req: NextRequest) {
    try {
        await connect(); // Connect to the database

        const decoded = validateToken(req);
        const formData = await req.formData();

        // Validate required fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const assignedTo = formData.get('assignedTo') as string;

        if (!title || !description || !assignedTo) {
            console.error('Validation Error: Missing required fields'); // Log error
            return NextResponse.json({
                success: false,
                message: 'Bad Request: Title, description, and assigned user are required',
            }, { status: 400 });
        }

        // Create taskData object
        const taskData: TaskData = {
            title,
            description,
            assignedTo,
            priority: formData.get('priority') as string,
            deadline: new Date(formData.get('deadline') as string),
            status: formData.get('status') as string,
        };

        // Validate assignedTo
        const assignedUser = await Users.findById(taskData.assignedTo);
        if (!assignedUser) {
            console.log('User not found:', taskData.assignedTo); // Log if user not found
            return NextResponse.json({
                success: false,
                message: 'Bad Request: Assigned user does not exist',
            }, { status: 400 });
        }

        // Create the task
        const newTask = await Tasks.create({
            ...taskData,
            assignedBy: decoded.id, // Set the creator to the current user
        });

        // Push the task ID to the user's tasks array
        await Users.findByIdAndUpdate(
            assignedTo,
            { $push: { tasks: newTask._id } }, // Push the newly created task's ID
            { new: true } // Optionally return the updated document
        );

        // Send task assignment email
        const taskAssignmentMessage = sendTaskAssignmentEmail(
            assignedUser.username,
            assignedUser.email,
            title,
            decoded.id // ID or name of the user who assigned the task
        );

        // Send the email using the updated signature
        await sendEmail({
            email: assignedUser.email,
            subject: 'Task Assignment: ' + title,
            message: taskAssignmentMessage,
        });

        return NextResponse.json({
            success: true,
            message: 'Task created successfully, assigned, and email sent!',
            task: newTask,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error in task creation:', error.message); // Log the error message
        console.error('Stack Trace:', error.stack); // Log the stack trace

        // Handle specific error types if necessary
        if (error.name === 'MongoError') {
            return NextResponse.json({
                success: false,
                message: 'Database error occurred: ' + error.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: false,
            message: error.message || 'An error occurred while creating the task',
        }, { status: 500 });
    }
}
