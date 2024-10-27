import Users from "@/app/models/userModule";
import { connect } from "@/app/dbConfig/dbConfig";
import sendEmail from "@/app/helpers/sendemail";
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/app/helpers/resetsendemail";


export async function POST(request: NextRequest) {
    // Connect to the database
    connect();
    try {
        const { email } = await request.json();

        // Check if user exists with the provided email
        const user = await Users.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'No user found with that email address' },
                { status: 404 }
            );
        }

        // Generate a password reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // Email message
        const messageData = sendPasswordResetEmail(user.username, user.email, resetToken);

        // Send email
        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Token",
                message: messageData,
            });

            return NextResponse.json(
                { message: 'Password reset token sent to your email!' },
                { status: 200 }
            );
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            user.forgetPasswordToken = undefined; // Clear token on error
            user.forgetPasswordTokenExpiry = undefined; // Clear expiry on error
            await user.save({ validateBeforeSave: false });

            return NextResponse.json(
                { message: 'Error sending email. Please try again later.' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Server error:', error); // Log the detailed error
        return NextResponse.json(
            { message: 'Server data error', error: error.message }, // Optional: Include error details
            { status: 500 }
        );
    }
}
