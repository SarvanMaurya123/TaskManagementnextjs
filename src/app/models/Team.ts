// File: models/Team.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for a team member
interface IMember {
    userId: mongoose.Types.ObjectId;
    username: string;
    email: string;
    department: string;
}

// Define an interface for the team model
interface ITeam extends Document {
    projectname: string;
    description: string;
    teamLeaderId: mongoose.Types.ObjectId;
    members: IMember[]; // Change members to an array of IMember objects
}

const memberSchema = new Schema<IMember>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    }
}, { _id: false }); // Disable automatic generation of _id for each member

const teamSchema = new Schema<ITeam>({
    projectname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    teamLeaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to the Admin model
        required: true,
    },
    members: [memberSchema], // Change members to use memberSchema
}, { timestamps: true });

const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
export default Team;
