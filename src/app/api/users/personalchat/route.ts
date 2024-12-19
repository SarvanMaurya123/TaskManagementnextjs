// pages/api/messages/personalChat.ts

import { connect } from '@/app/dbConfig/dbConfig';  // Ensure you're connecting to DB
import PersonalChat from '@/app/models/PersonalChat'; // Import the PersonalChat model
import { NextResponse } from 'next/server';

// POST: Send a new message
export async function POST(request: Request) {
    try {
        // Ensure the connection to the database is made
        await connect();

        // Parse incoming request body
        const { senderId, receiverId, messageContent } = await request.json();

        // Validate required fields
        if (!senderId || !receiverId || !messageContent) {
            return NextResponse.json(
                { message: 'Sender, receiver, and message content are required' },
                { status: 400 }
            );
        }

        // Create a new message document in the database
        const newMessage = new PersonalChat({
            sender: senderId,
            receiver: receiverId,
            message: messageContent,
            status: 'sent',
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        // Respond with success and the saved message data
        return NextResponse.json(
            { message: 'Message sent successfully', data: savedMessage },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { message: 'Error sending message' },
            { status: 500 }
        );
    }
}

// GET: Retrieve messages between user and team leader (based on IDs)
export async function GET(request: Request) {
    try {
        // Ensure the connection to the database is made
        await connect();

        // Extract query parameters from the URL
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const teamLeaderId = url.searchParams.get('teamLeaderId');

        if (!userId || !teamLeaderId) {
            return NextResponse.json(
                { message: 'UserId and TeamLeaderId are required' },
                { status: 400 }
            );
        }

        // Retrieve messages between the specified user and team leader
        const messages = await PersonalChat.find({
            $or: [
                { sender: userId, receiver: teamLeaderId },
                { sender: teamLeaderId, receiver: userId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by timestamp (oldest first)

        return NextResponse.json(
            { messages },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return NextResponse.json(
            { message: 'Error retrieving messages' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a specific message by message ID
export async function DELETE(request: Request) {
    try {
        // Ensure the connection to the database is made
        await connect();

        // Extract the message ID from the URL
        const url = new URL(request.url);
        const messageId = url.searchParams.get('messageId');

        if (!messageId) {
            return NextResponse.json(
                { message: 'Message ID is required' },
                { status: 400 }
            );
        }

        // Find and delete the message
        const deletedMessage = await PersonalChat.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return NextResponse.json(
                { message: 'Message not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Message deleted successfully', data: deletedMessage },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { message: 'Error deleting message' },
            { status: 500 }
        );
    }
}
