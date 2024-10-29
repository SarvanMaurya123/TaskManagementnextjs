// File: src/app/api/admin/teamleader/[department]/route.ts

import { connect } from "@/app/dbConfig/dbConfig";
import Users from "@/app/models/userModule";
import { NextRequest, NextResponse } from "next/server";

// Define the response type
interface UserResponse {
    _id: string;
    username: string;
    email: string;
    department: string;
}

export async function GET(req: NextRequest, { params }: { params: { department: string } }) {
    await connect(); // Ensure database connection

    const { department } = params; // Extract the department from URL parameters

    // Check if department is provided
    if (!department) {
        return NextResponse.json({ message: "Department not specified" }, { status: 400 });
    }

    // Validate the department parameter to ensure it's a valid department
    const validDepartments = ['Developer', 'Designer', 'Tester', 'Marketing', 'Others'];
    if (!validDepartments.includes(department)) {
        return NextResponse.json({ message: "Invalid department specified" }, { status: 400 });
    }

    try {
        // Query the database to find users in the specified department
        const users = await Users.find({ department });

        // Map the result to include username, email, and department
        const userResponse: UserResponse[] = users.map(user => ({
            _id: user._id.toString(), // Convert _id to string if necessary
            username: user.username,
            email: user.email,
            department: user.department // Ensure this field exists in the user model
        }));

        return NextResponse.json(userResponse); // Return the list of users in JSON format
    } catch (error) {
        console.error("Error fetching users by department:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
