import { NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import { jwtVerify } from "jose";
import Users from "@/app/models/userModule";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
    try {
        await connect();

        // Get the cookies
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 401 });
        }

        // Verify the token using jose
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) throw new Error("SECRET_KEY is not defined");

        const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey));
        const userId = payload.id;

        // Parse the request body to get the updated user data
        const { username, email } = await request.json();

        // Validate user input
        if (!username || !email) {
            return NextResponse.json({ error: "Username and email are required" }, { status: 400 });
        }

        // Find the user by ID and update their details
        const user = await Users.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return the updated user information
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error); // Log the error for debugging
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
