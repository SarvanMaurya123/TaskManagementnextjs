import { connect } from "@/app/dbConfig/dbConfig";
import Users from "@/app/models/userModule";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        await connect();
        const reqBody = await request.json()
        const { email, password } = reqBody;

        const user = await Users.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User do not found!" }, { status: 401 })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return NextResponse.json({ error: "password invelid" }, { status: 401 })
        }
        //create token data
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY!, { expiresIn: '1hr' })
        const response = NextResponse.json({ message: "Login Succssfully!", success: true })

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure based on environment
            expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
        })
        return response;
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}