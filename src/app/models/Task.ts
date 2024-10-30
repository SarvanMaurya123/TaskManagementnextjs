import mongoose, { Document, Schema } from "mongoose";

// Define the ITask interface
export interface ITask extends Document {
    title: string;
    description: string;
    assignedTo: mongoose.Types.ObjectId;
    assignedBy: mongoose.Types.ObjectId;
    status: "Pending" | "In Progress" | "Completed" | "Overdue";
    priority: "Low" | "Medium" | "High";
    deadline: Date;
    tags: string[];
    comments: { user: mongoose.Types.ObjectId; comment: string; timestamp: Date }[];
    attachments: string[];
    progress: number;
    dependencies: mongoose.Types.ObjectId[];
    estimatedTime: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Task schema
const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Overdue"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: { type: Date, required: true },
    tags: [{ type: String }],
    comments: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, comment: { type: String, required: true }, timestamp: { type: Date, default: Date.now } }],
    attachments: [{ type: String }],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dependencies: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    estimatedTime: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware for updating status and timestamp
taskSchema.pre("save", function (next) {
    const task = this as ITask;
    task.updatedAt = new Date();
    if (task.deadline < new Date() && task.status !== "Completed") {
        task.status = "Overdue";
    }
    next();
});

export const Task = mongoose.model<ITask>("Task", taskSchema);
