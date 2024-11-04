// src/app/api/admindashboard/chartdeveloper/route.ts
import { connect } from '@/app/dbConfig/dbConfig';
import Users from '@/app/models/userModule';
import { NextRequest, NextResponse } from 'next/server';
connect()
export async function GET(req: NextRequest) {
    try {
        // Aggregate users by department
        const departmentCounts = await Users.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
        ]);

        return NextResponse.json({ departmentCounts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching department data:", error);
        return NextResponse.json({ error: "Error fetching department data" }, { status: 500 });
    }
}
