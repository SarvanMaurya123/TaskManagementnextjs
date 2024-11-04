// src/app/api/users/contextgetuserdata/route.ts
import { connect } from "@/app/dbConfig/dbConfig";
import Users from "@/app/models/userModule";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/helpers/verifyJwt";

connect();

export async function GET(request: NextRequest) {
    try {
        // Get the token from cookies
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the JWT token
        const decoded = verifyJwt(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.id;
        const user = await Users.findById(userId).select('-password -forgetPasswordToken -forgetPasswordTokenExpiry -verifyToken -verifyTokenExpiry');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
