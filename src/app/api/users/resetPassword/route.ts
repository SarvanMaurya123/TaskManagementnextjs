import Users from "@/app/models/userModule";
import { connect } from "@/app/dbConfig/dbConfig";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

connect().catch(err => {
    console.error("Error connecting to the database:", err);
});

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json();

        // Hash the token to match it with the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user with the matching reset token and check if the token is still valid
        const user = await Users.findOne({
            forgetPasswordToken: hashedToken,
            forgetPasswordTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            return NextResponse.json({ message: 'Token is invalid or has expired' }, { status: 400 });
        }

        // Hash the new password before saving it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token fields
        user.forgetPasswordToken = undefined;
        user.forgetPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);  // Log the error for debugging
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
