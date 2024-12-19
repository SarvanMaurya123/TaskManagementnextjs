// models/PersonalChat.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonalChat extends Document {
    sender: mongoose.Schema.Types.ObjectId;  // Reference to sender (User or Admin)
    receiver: mongoose.Schema.Types.ObjectId;  // Reference to receiver (User or Admin)
    message: string;  // The content of the message
    status: 'sent' | 'delivered' | 'read';  // Message status
    createdAt: Date;  // Timestamp when the message was sent
    updatedAt: Date;  // Timestamp when the message was last updated
}

const personalChatSchema: Schema<IPersonalChat> = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',  // Could reference either Users or Admin (TeamLeader)
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',  // Could reference either Users or Admin (TeamLeader)
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Message content is required'],
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
    },
    { timestamps: true }  // Automatically manage createdAt and updatedAt
);

// Ensure that the model is created once
const PersonalChat = mongoose.models.PersonalChat || mongoose.model<IPersonalChat>('PersonalChat', personalChatSchema);

export default PersonalChat;
