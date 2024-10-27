import { connect } from "@/app/dbConfig/dbConfig";
import sendEmail from "@/app/helpers/sendemail";
import { sendRegisterThanksPage } from "@/app/helpers/thankspage";
import Users from "@/app/models/userModule.js";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

connect();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { username, email, password, department } = reqBody;

        // Validation checks
        if (!username || !email || !password || !department) {
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

        // Department validation
        const allowedDepartments = ['Developer', 'Designer', 'Tester', 'Markating', 'Others'];
        if (!allowedDepartments.includes(department)) {
            return NextResponse.json({ message: "Invalid department selected.", success: false }, { status: 400 });
        }

        // Check if the user already exists
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "A user with this email already exists.", success: false }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create a new user with the department field
        const newUser = new Users({ username, email, password: hashPassword, department });

        // Save the user
        const savedUser = await newUser.save();

        // Generate the thank-you page content
        const messageSend = sendRegisterThanksPage(username, email);

        // Send email with the generated content
        await sendEmail({
            email: email,
            subject: "Welcome to <SM/> Task Management Platform",
            message: messageSend,
        });

        return NextResponse.json({
            message: "Account created successfully!",
            success: true,
            user: savedUser
        });

    } catch (error: any) {
        console.error("Error creating account:", error.message);
        return NextResponse.json({
            message: "Sign Up Failed: An unexpected error occurred.",
            success: false
        }, { status: 500 });
    }
}
