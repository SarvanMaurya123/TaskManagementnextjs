import { connect } from "@/app/dbConfig/dbConfig"; // Import your database connection
import Users from "@/app/models/userModule"; // Import your user model
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/helpers/verifyJwt"; // Import the verifyJwt function

// Ensure the database is connected before handling requests
connect();

// Handle the POST request
export async function POST(req: NextRequest) {
    try {
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;

        // Verify the JWT
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'No token provided',
            }, { status: 401 }); // Unauthorized
        }

        const verifiedUser = verifyJwt(token);
        if (!verifiedUser) {
            return NextResponse.json({
                success: false,
                message: 'Invalid token',
            }, { status: 401 }); // Unauthorized
        }


        // Get total active and inactive users
        const totalActiveUsers = await Users.countDocuments({ isActive: true });
        const totalInactiveUsers = await Users.countDocuments({ isActive: false });


        // Get month-wise active users, filtering out null createdAt
        const monthWiseActiveUsers = await Users.aggregate([
            {
                $match: { createdAt: { $ne: null } } // Exclude documents with null createdAt
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    growth: { $last: "$growth" } // Add growth if applicable
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);



        // Get top departments by active users
        const topDepartments = await Users.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);



        // Calculate the date one month ago from today
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Count users who signed up in the last month
        const signUpsLastMonth = await Users.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });



        // Return the response
        return NextResponse.json({
            status: 'success',
            totalActiveUsers,
            totalInactiveUsers,
            monthWiseActiveUsers,
            topDepartments,
            signUpsLastMonth
        }, { status: 200 });
    } catch (err: any) {
        console.error("Error occurred:", err.stack || err);

        return NextResponse.json({
            success: false,
            message: err.message || 'Error retrieving user statistics',
            error: err // Include error details (for debugging)
        }, { status: 500 });
    }
}
