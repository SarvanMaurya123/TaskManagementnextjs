// route.ts for /api/users/alltask/updateStatus/[taskId]
import { NextResponse } from "next/server";
import Tasks from "@/app/models/Task";
import { connect } from "@/app/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { verifyJwt } from "@/app/helpers/verifyJwt";

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
    try {
        await connect();
        const taskId = params.taskId;
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return NextResponse.json({ error: "Token not found" }, { status: 401 });

        const decoded = verifyJwt(token);
        if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

        const { status } = await request.json();
        const task = await Tasks.findOne({ _id: taskId, assignedTo: decoded.id });

        if (!task) return NextResponse.json({ error: "Task not found or not assigned to user" }, { status: 404 });

        task.status = status;
        await task.save();

        return NextResponse.json({ message: "Task status updated successfully", task });
    } catch (error) {
        console.error("Error updating task status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
