import { connect } from "@/app/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import Admin from '@/app/models/adminModule.js';

connect();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { username, email, password, role } = reqBody;

        // Validation checks
        if (!username || !email || !password || !role) {
            return NextResponse.json({ message: "All fields are required.", success: false }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: "Please enter a valid email address.", success: false }, { status: 400 });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({ message: "Password must be 6 to 12 characters long and contain at least one letter, one number, and one special character.", success: false }, { status: 400 });
        }

        // Check if the admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return NextResponse.json({ message: "An admin with this email already exists.", success: false }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create a new admin with provided role
        const newAdmin = new Admin({
            username,
            email,
            password: hashPassword,
            isAdmin: role === "admin",  // Set isAdmin based on role
            role,  // Use the role provided in the request
        });

        // Save the admin
        const savedAdmin = await newAdmin.save();

        return NextResponse.json({
            message: "Admin account created successfully!",
            success: true,
            admin: savedAdmin
        });

    } catch (error: any) {
        console.error("Admin registration failed:", error.message);
        return NextResponse.json({
            message: error.message || "An unexpected error occurred.",
            success: false
        }, { status: 500 });
    }
}
