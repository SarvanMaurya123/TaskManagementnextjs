import { NextResponse } from "next/server";
import Tasks from "@/app/models/Task";
import { connect } from "@/app/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { verifyJwt } from "@/app/helpers/verifyJwt";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        await connect();

        const userId = params.userId;
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        const decoded = verifyJwt(token);
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (decoded.id !== userId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        // Get the status filter from the query parameters
        const url = new URL(request.url);
        const status = url.searchParams.get("status");

        // Build the query based on the status
        const query: any = { assignedTo: userId };
        if (status && ["Pending", "In Progress", "Completed"].includes(status)) {
            query.status = status; // Only include tasks with the specified status
        }

        // Fetch tasks based on the constructed query
        const tasks = await Tasks.find(query);

        // Check if tasks are found
        if (tasks.length === 0) {
            return NextResponse.json({ message: "No tasks found." }, { status: 200 });
        }

        return NextResponse.json({ tasks });
    } catch (error: any) {
        console.error('Error fetching user tasks:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
