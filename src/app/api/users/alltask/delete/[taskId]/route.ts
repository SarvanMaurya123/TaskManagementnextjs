import { NextResponse } from "next/server";
import Tasks from "@/app/models/Task";
import { connect } from "@/app/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { verifyJwt } from "@/app/helpers/verifyJwt";

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
    try {
        await connect();

        const taskId = params.taskId;
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        const decoded = verifyJwt(token);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Find the task and ensure it's assigned to the user
        const task = await Tasks.findOne({ _id: taskId, assignedTo: decoded.id });

        if (!task) {
            return NextResponse.json({ error: "Task not found or not assigned to the user" }, { status: 404 });
        }

        // Use deleteOne or findByIdAndDelete to delete the task
        await Tasks.deleteOne({ _id: taskId }); // This will delete the task by its ID

        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
