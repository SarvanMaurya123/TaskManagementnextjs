import { connect } from "@/app/dbConfig/dbConfig";
import Admin from "@/app/models/adminModule.js"; // Adjust the import path to your Admin model
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        await connect();
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Find the admin user by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: "Admin not found!" }, { status: 401 });
        }

        // Check if the password is valid
        const checkPassword = await bcryptjs.compare(password, admin.password);
        if (!checkPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Create token data
        const tokenData = {
            id: admin._id,
            email: admin.email,
            username: admin.username,
            role: admin.role // Include access level if needed
        };

        // Generate JWT token
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY!, { expiresIn: '1hr' });

        const response = NextResponse.json({ message: "Login successfully!", success: true });

        // Set the token in cookies
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
        });

        return response;
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
