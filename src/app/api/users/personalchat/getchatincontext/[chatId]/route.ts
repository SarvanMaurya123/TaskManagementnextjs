// pages/api/chats/getUserChat/[userId].ts
import { connect } from '@/app/dbConfig/dbConfig';
import PersonalChat from '@/app/models/PersonalChat';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// GET: Retrieve a specific chat by chatId
export async function GET(request: Request, { params }: { params: { chatId: string } }) {
    try {
        await connect();

        const chatId = params.chatId;

        // Validate chatId format
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            return NextResponse.json({ error: 'Invalid chatId format' }, { status: 400 });
        }

        const chatObjectId = new mongoose.Types.ObjectId(chatId);

        // Find the chat by chatId
        const chat = await PersonalChat.findOne({ _id: chatObjectId });

        if (!chat) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        // Return the chat data
        return NextResponse.json({ chat });
    } catch (error) {
        console.error('Error retrieving chat:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
