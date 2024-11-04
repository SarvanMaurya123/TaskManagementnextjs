// src/models/taskModule.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    assignedTo: mongoose.Types.ObjectId; // Reference to User
    assignedBy: mongoose.Types.ObjectId; // Reference to User or Admin
    status: "Pending" | "In Progress" | "Completed" | "Overdue";
    priority: "Low" | "Medium" | "High";
    deadline: Date;
    attachments: string[];
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "Users", required: true }, // Or ref to Admin if needed
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Overdue"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: { type: Date, required: true },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Check if the model is already compiled
const Tasks = mongoose.models.Tasks || mongoose.model<ITask>('Tasks', taskSchema);

export default Tasks;
