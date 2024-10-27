import { getDataFromToken } from "@/app/helpers/getDataFromToken";
//import { connect } from "@/app/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Users from "@/app/models/userModule.js";

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await Users.findOne({ _id: userId }).select("-passwoed");

        return NextResponse.json({
            message: "User Found Successfully!",
            data: user
        })
    } catch (error: any) {
        throw new Error(error.message)
    }
}